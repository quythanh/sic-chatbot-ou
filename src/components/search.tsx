'use client';
import { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import SplitButton from 'react-bootstrap/SplitButton';
import '@/styles/globals.css';

interface SearchProps {
    getValueS?: (query: string, file?: File) => void;
}

function Search({ getValueS }: SearchProps) {
    const [textSearch, setTextSearch] = useState<string>('');
    const [image, setImage] = useState<File | undefined>();
    const [enable, setEnable] = useState<boolean>(true);

    const getValue = () => {
        if (textSearch && getValueS) {
            setEnable(false);
            getValueS(textSearch, image);
            setEnable(true);
        }

        setTextSearch('');
        setImage(undefined);
    };
    return (
        <InputGroup className="mb-3 relative">
            {image && (
                // biome-ignore lint: ignore onKeyEvent lint
                <div
                    className="absolute bottom-12 w-24 h-24 cursor-pointer flex items-center"
                    onClick={() => {
                        setImage(undefined);
                    }}
                >
                    <img
                        alt="Preview"
                        src={URL.createObjectURL(image)}
                        className="w-full h-full p-0.5 border border-gray-200 rounded-md overflow-hidden"
                    />
                </div>
            )}
            <input
                id="inp_img"
                type="file"
                className="hidden"
                accept=".jpg, .jpeg, .png"
                onChange={(e) => {
                    const files = e.target.files;
                    if (files === null) {
                        console.log('Error');
                        return;
                    }

                    setImage(files[0]);
                }}
            />
            <label htmlFor="inp_img" className="border border-gray-50 px-3 py-1 cursor-pointer">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <title>Attach File</title>
                    <path
                        fill="currentColor"
                        fillRule="evenodd"
                        d="M9 7a5 5 0 0 1 10 0v8a7 7 0 1 1-14 0V9a1 1 0 0 1 2 0v6a5 5 0 0 0 10 0V7a3 3 0 1 0-6 0v8a1 1 0 1 0 2 0V9a1 1 0 1 1 2 0v6a3 3 0 1 1-6 0z"
                        clipRule="evenodd"
                    />
                </svg>
            </label>

            <Form.Control
                aria-label="Text input with dropdown button"
                placeholder="Nhập nội dung cần hỏi"
                onKeyDown={(e) => {
                    if (e.key === 'Enter') getValue();
                }}
                value={textSearch}
                onChange={(e) => {
                    setTextSearch(e.target.value);
                }}
            />
            <SplitButton
                disabled={!enable}
                variant="dark"
                title={
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="currentColor"
                        className="bi bi-arrow-up-circle"
                        viewBox="0 0 16 16"
                    >
                        <title>Send</title>
                        <path
                            fillRule="evenodd"
                            d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0m-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707z"
                        />
                    </svg>
                }
                id="segmented-button-dropdown-2"
                onClick={getValue}
            >
                <Dropdown.Item href="https://ou.edu.vn/">Web đại học mở</Dropdown.Item>
                <Dropdown.Item href="https://tienichsv.ou.edu.vn/#/home">Tiện ích sinh viên OU</Dropdown.Item>
                <Dropdown.Item href="http://it.ou.edu.vn/">Khoa công nghệ thông tin OU</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item href="#">Thông tin khác</Dropdown.Item>
            </SplitButton>
        </InputGroup>
    );
}
export default Search;
