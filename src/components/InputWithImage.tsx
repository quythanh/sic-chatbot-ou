import type React from 'react';
import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import '@/styles/global.css';

interface ChatInputProps {
    onFileUpload: (files: File[]) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({ onFileUpload }) => {
    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            onFileUpload(acceptedFiles);
        },
        [onFileUpload],
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
        <div {...getRootProps()} className={`border p-2 rounded-md ${isDragActive ? 'bg-gray-100' : 'bg-white'}`}>
            <input {...getInputProps()} />
            <textarea
                placeholder="Type your message or drag & drop files here..."
                className="w-full h-24 p-2 border-0 focus:ring-0 resize-none"
            />
        </div>
    );
};

export default ChatInput;
