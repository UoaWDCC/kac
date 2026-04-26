import { useState, useEffect } from "react";
import { fetchImageByTag } from "../../api/imageApi";
import { UploadModal } from "./UploadModal";
import placeholder from "../../images/placeholder.png";

interface ImageData {
    id: string | null;
    signedUrl: string | null;
    originalName?: string;
}

interface ImageBlockProps {
    pageKey: string;
    role: "admin" | "user";
    style?: React.CSSProperties;
}

export function ImageBlock({ pageKey, role, style }: ImageBlockProps) {
    const [imageData, setImageData] = useState<ImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    const loadImage = async () => {
        try {
            setLoading(true);
            const data = await fetchImageByTag(pageKey);
            setImageData(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadImage();
    }, [pageKey]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            <img
                src={imageData?.signedUrl ?? placeholder}
                alt={imageData?.originalName ?? "Placeholder image"}
                style={style}
            />

            {role === "admin" && (
                <button onClick={() => setShowModal(true)}>Edit Image</button>
            )}

            {showModal && (
                <UploadModal
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        loadImage();
                    }}
                    tag={pageKey}
                />
            )}
        </div>
    );
}