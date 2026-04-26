import { useState } from "react";
import { useImage } from "./useImage";
import { UploadModal } from "./UploadModal";
import placeholder from "../../images/placeholder.png";

interface ImageBlockProps {
    imageId?: string;
    role: "admin" | "user";
    style?: React.CSSProperties;
}

export function ImageBlock({ imageId: initialImageId, role, style }: ImageBlockProps) {
    const [imageId, setImageId] = useState(initialImageId);
    const { image, loading, error, refetch } = useImage(imageId ?? "");
    const [showModal, setShowModal] = useState(false);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <img
                src={image?.signedUrl ?? placeholder}
                alt={image?.originalName ?? "Placeholder image"}
                style={style}
            />

            {role === "admin" && (
                <button onClick={() => setShowModal(true)}>Edit Image</button>
            )}

            {showModal && (
                <UploadModal
                    onClose={() => setShowModal(false)}
                    onSuccess={(newImageId: string) => {
                        setShowModal(false);
                        setImageId(newImageId); // triggers useImage to fetch the new image
                    }}
                />
            )}
        </div>
    );
}