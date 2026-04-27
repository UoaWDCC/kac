import { useState, useEffect } from "react";
import { fetchImageByTag } from "../../api/imageApi";
import { UploadModal } from "./UploadModal";
import placeholder from "../../images/placeholder.png";
import "../../style/image_block/ImageBlock.css";
import { Pencil } from "lucide-react";

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
        <>
            <div className="image-block" style={style}>
                <img
                    src={imageData?.signedUrl ?? placeholder}
                    alt={imageData?.originalName ?? "Placeholder image"}
                />

                {role === "admin" && (
                    <button
                        className="image-block__edit-btn"
                        onClick={() => setShowModal(true)}
                        title="Edit image"
                    >
                        <Pencil size={17} />
                    </button>
                )}
            </div>

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
        </>
    );
}