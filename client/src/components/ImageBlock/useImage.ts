import { useState, useEffect } from "react";
import { fetchImage } from "../../api/imageApi";

interface ImageData {
    id: string;
    originalName: string;
    mimeType: string;
    size: number;
    s3Key: string;
    uploadedAt: string;
    signedUrl: string;
}

export function useImage(imageId: string) {
    const [image, setImage] = useState<ImageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchImageData = async () => {
        try {
            setLoading(true);
            setImage(await fetchImage(imageId));
        } catch (err) {
            setError(err instanceof Error ? err.message : "Unknown error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchImageData();
    }, [imageId]);

    return { image, loading, error, refetch: fetchImageData };
}