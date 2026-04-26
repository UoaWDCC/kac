import { useState, useEffect } from "react";
import { uploadImage } from "../../api/imageApi";

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
        <div>
            <h2>Upload Image</h2>
            <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileChange}
            />
            {preview && <img src={preview} alt="Preview" />}
            {error && <p>{error}</p>}
            <button onClick={handleUpload} disabled={!file || uploading}>
                {uploading ? "Uploading..." : "Upload"}
            </button>
            <button onClick={onClose} disabled={uploading}>Cancel</button>
        </div>
    );
}