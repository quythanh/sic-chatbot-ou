import re
import torch

import numpy as np
import pytesseract as pt

from PIL import Image
from torchvision import transforms
from transformers import AutoModelForObjectDetection, TableTransformerForObjectDetection


class MaxResize(object):
    def __init__(self, max_size=800):
        self.max_size = max_size

    def __call__(self, image):
        width, height = image.size
        current_max_size = max(width, height)
        scale = self.max_size / current_max_size
        resized_image = image.resize((int(round(scale*width)), int(round(scale*height))))

        return resized_image


class TextTableDetection:
    def __init__(self, device=None):
        self.device = device
        if device is None:
            self.device = TextTableDetection.__get_best_device()

        self.model = AutoModelForObjectDetection.from_pretrained("src/data/weights/table-transformer/detection", revision="no_timm")
        self.structure_model = TableTransformerForObjectDetection.from_pretrained("src/data/weights/table-transformer/structure")

        self.model = self.model.to(self.device)
        self.structure_model = self.structure_model.to(self.device)

        self.id2label = self.model.config.id2label
        self.structure_id2label = self.structure_model.config.id2label

        self.id2label[len(self.id2label)] = "no object"
        self.structure_id2label[len(self.structure_id2label)] = "no object"

        self.detection_transform = transforms.Compose([
            MaxResize(800),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])
        self.structure_transform = transforms.Compose([
            MaxResize(1000),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
        ])

    @staticmethod
    def __get_best_device():
        if torch.cuda.is_available():
            return "cuda"
        return "cpu"

    def outputs_to_objects(self, outputs, img_size, id2label):
        def box_cxcywh_to_xyxy(x):
            x_c, y_c, w, h = x.unbind(-1)
            b = [(x_c - 0.5 * w), (y_c - 0.5 * h), (x_c + 0.5 * w), (y_c + 0.5 * h)]
            return torch.stack(b, dim=1)

        def rescale_bboxes(out_bbox, size):
            img_w, img_h = size
            b = box_cxcywh_to_xyxy(out_bbox)
            b = b * torch.tensor([img_w, img_h, img_w, img_h], dtype=torch.float32)
            return b

        m = outputs.logits.softmax(-1).max(-1)
        pred_labels = list(m.indices.detach().cpu().numpy())[0]
        pred_scores = list(m.values.detach().cpu().numpy())[0]
        pred_bboxes = outputs['pred_boxes'].detach().cpu()[0]
        pred_bboxes = [elem.tolist() for elem in rescale_bboxes(pred_bboxes, img_size)]

        objects = []
        for label, score, bbox in zip(pred_labels, pred_scores, pred_bboxes):
            class_label = id2label[int(label)]
            if not class_label == 'no object':
                objects.append({'label': class_label, 'score': float(score),
                                'bbox': [float(elem) for elem in bbox]})

        return objects

    def objects_to_crops(self, img: Image, tokens, objects, class_thresholds, padding: int = 10):
        """
        Process the bounding boxes produced by the table detection model into
        cropped table images and cropped tokens.
        """

        table_crops = []
        for obj in objects:
            if obj['score'] < class_thresholds[obj['label']]:
                continue

            cropped_table = {}

            bbox = obj['bbox']
            bbox = [bbox[0]-padding, bbox[1]-padding, bbox[2]+padding, bbox[3]+padding]

            cropped_img = img.crop(bbox)

            # DO NOT TRY TO FIX THIS !!!
            # I don't know where tf `iob` come from.
            # But it is still working some how.
            table_tokens = [token for token in tokens if iob(token['bbox'], bbox) >= 0.5]
            for token in table_tokens:
                token['bbox'] = [token['bbox'][0]-bbox[0],
                                 token['bbox'][1]-bbox[1],
                                 token['bbox'][2]-bbox[0],
                                 token['bbox'][3]-bbox[1]]

            cropped_table['image'] = cropped_img
            cropped_table['tokens'] = table_tokens

            table_crops.append(cropped_table)

        return table_crops

    def detect_table(self, image: Image):
        # Preprocessing image input for table detection
        pixel_values = self.detection_transform(image).unsqueeze(0)
        pixel_values = pixel_values.to(self.device)

        # Predict
        with torch.no_grad():
            outputs = self.model(pixel_values=pixel_values)

        # Convert to object
        objects = self.outputs_to_objects(outputs, image.size, self.id2label)

        # Crop table from image
        tokens = []
        detection_class_thresholds = {
            "table": 0.5,
            "table rotated": 0.5,
            "no object": 10
        }
        crop_padding = 0

        tables_crops = self.objects_to_crops(image, tokens, objects, detection_class_thresholds, padding=crop_padding)
        if tables_crops:
            cropped_table = tables_crops[0]['image'].convert("RGB")
            bbox = objects[0]['bbox']
            bbox = [bbox[0]-crop_padding, bbox[1]-crop_padding, bbox[2]+crop_padding, bbox[3]+crop_padding]
            return cropped_table, bbox  # Return the cropped table
        else:
            return None, None  # Return None if no tables are found

    def recognize_table_structure(self, image):
        # Preprocessing cropped table image for table structure recognition
        pixel_values = self.structure_transform(image).unsqueeze(0)
        pixel_values = pixel_values.to(self.device)

        # Forward pass
        with torch.no_grad():
            outputs = self.structure_model(pixel_values)

        cells = self.outputs_to_objects(outputs, image.size, self.structure_id2label)
        return cells

    def get_cell_coordinates_by_row(self, table_data):
        # Extract rows and columns
        rows = [entry for entry in table_data if entry['label'] == 'table row']
        columns = [entry for entry in table_data if entry['label'] == 'table column']

        # Sort rows and columns by their Y and X coordinates, respectively
        rows.sort(key=lambda x: x['bbox'][1])
        columns.sort(key=lambda x: x['bbox'][0])

        # Function to find cell coordinates
        def find_cell_coordinates(row, column):
            cell_bbox = [column['bbox'][0], row['bbox'][1], column['bbox'][2], row['bbox'][3]]
            return cell_bbox

        # Generate cell coordinates and count cells in each row
        cell_coordinates = []

        for row in rows:
            row_cells = []
            for column in columns:
                cell_bbox = find_cell_coordinates(row, column)
                row_cells.append({'column': column['bbox'], 'cell': cell_bbox})

            # Sort cells in the row by X coordinate
            row_cells.sort(key=lambda x: x['column'][0])

            # Append row information to cell_coordinates
            cell_coordinates.append({'row': row['bbox'], 'cells': row_cells, 'cell_count': len(row_cells)})

        # Sort rows from top to bottom
        cell_coordinates.sort(key=lambda x: x['row'][1])

        return cell_coordinates

    def apply_tesseract_ocr(self, cell_coordinates, cropped_table):
        # let's OCR row by row
        data = dict()
        max_num_columns = 0
        for idx, row in enumerate(cell_coordinates):
            row_text = []
            for cell in row["cells"]:
                # crop cell out of image
                cell_image = np.array(cropped_table.crop(cell["cell"]))
                # apply TesseractOCR
                result = self.read_text(np.array(cell_image))
                row_text.append(result.strip())

            if len(row_text) > max_num_columns:
                max_num_columns = len(row_text)

            data[f'row{idx+1}'] = row_text

        # pad rows which don't have max_num_columns elements
        # to make sure all rows have the same number of columns
        for row, row_data in data.copy().items():
            if len(row_data) != max_num_columns:
              row_data = row_data + ["" for _ in range(max_num_columns - len(row_data))]
            data[row] = row_data

        return data

    def pipeline_tesseract(self, image: Image):
        cropped_table, bbox = self.detect_table(image)
        if cropped_table is None:
            print("Error: Can't detect table")
            return None
        cells = self.recognize_table_structure(cropped_table)
        cell_coordinates = self.get_cell_coordinates_by_row(cells)
        data = self.apply_tesseract_ocr(cell_coordinates, cropped_table)
        return data, bbox

    def read_text(self, image: Image):
        text = pt.image_to_string(image, lang='vie')
        text = text.replace('\x0c', '')
        res = re.sub(r'\n+', ' ', text)
        return res

    def predict(self, image: Image):
        table_data, bbox = self.pipeline_tesseract(image)

        # Error: Can't detect table
        if table_data is None:
            return self.read_text(image)

        top_text_box = [0, 0, image.size[0], bbox[1]]
        left_text_box = [0, bbox[1], bbox[0], bbox[3]]
        right_text_box = [bbox[2], bbox[1], image.size[0], bbox[3]]
        bottom_text_box = [0, bbox[3], image.size[0], image.size[1]]

        res = [
            self.read_text(image.crop(text_box)).strip()
                for text_box in [top_text_box, left_text_box,
                                 right_text_box, bottom_text_box]
        ]

        text_table = ['|'.join(row) for row in table_data.values()]

        res = '\n'.join([r for r in res if len(r) > 0])
        res += '\nTable:\n' + '\n'.join(text_table)

        return res
