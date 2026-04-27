import { useState, useEffect } from "react";
import { uploadImage } from "../../api/imageApi";
import "../../style/image_block/UploadModal.css";


interface UploadModalProps {
    onClose: () => void;
    onSuccess: () => void;
    tag: string;
}

export function UploadModal({ onClose, onSuccess, tag }: UploadModalProps) {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (preview) URL.revokeObjectURL(preview);
        };
    }, [preview]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selected = e.target.files?.[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        setError(null);
    };

    const handleUpload = async () => {
        if (!file) return;
        setUploading(true);
        setError(null);
        try {
            await uploadImage(file, tag);
            onSuccess();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="upload-modal__overlay" onClick={onClose}>
            <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
                <h2>UPLOAD IMAGE</h2>

                <label className={`upload-modal__dropzone${preview ? " upload-modal__dropzone--has-preview" : ""}`}>
                    {preview ? (
                        <img src={preview} alt="Preview" className="upload-modal__preview" />
                    ) : (
                        <span>Click to choose a file</span>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                </label>

                {file && <p className="upload-modal__filename">{file.name}</p>}
                {error && <p className="upload-modal__error">{error}</p>}

                <div className="upload-modal__actions">
                    <button
                        className="upload-modal__btn-upload"
                        onClick={handleUpload}
                        disabled={!file || uploading}
                    >
                        {uploading ? "UPLOADING..." : "UPLOAD"}
                    </button>
                    <button
                        className="upload-modal__btn-cancel"
                        onClick={onClose}
                        disabled={uploading}
                    >
                        CANCEL
                    </button>
                </div>
            </div>
        </div>
    );
}