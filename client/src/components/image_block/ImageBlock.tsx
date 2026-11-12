import { useState, useEffect } from "react";
import { getImageByTag, refreshImageByTag } from "../../api/imageApi";
import { UploadModal } from "./UploadModal";
import placeholder from "../../images/placeholder.png";
import "../../style/image_block/ImageBlock.css";
import { Pencil } from "lucide-react";
import { useAuth } from "../../auth/useAuth";

interface ImageData {
  id: string | null;
  signedUrl: string | null;
  originalName?: string;
  width?: number | null;
  height?: number | null;
}

interface ImageBlockProps {
  pageKey: string;
  className?: string;
  style?: React.CSSProperties;
  alt: string;
  editable?: boolean;
  onImageUpdated?: () => void;
  fallbackSrc?: string;
}

export function ImageBlock({
  pageKey,
  className,
  style,
  alt,
  editable,
  onImageUpdated,
  fallbackSrc,
}: Readonly<ImageBlockProps>) {
  const { role } = useAuth();
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    setImageData(null);
    const loadImage = async () => {
      try {
        const data = await getImageByTag(pageKey);

        if (active) {
          setImageData(data);
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setImageData({ id: null, signedUrl: null });
        }
      }
    };

    void loadImage();

    return () => {
      active = false;
    };
  }, [pageKey]);

  const src = imageData?.signedUrl ?? fallbackSrc ?? placeholder;
  const isFetching = imageData === null;
  const hasUploadedImage = Boolean(imageData?.signedUrl);
  const isImageLoading =
    hasUploadedImage && loadedSrc !== src && failedSrc !== src;

  // Older images were stored without dimensions, so fall back to the browser's
  // natural sizing once the file has loaded.
  const dimensions =
    imageData?.width && imageData?.height
      ? { width: imageData.width, height: imageData.height }
      : undefined;

  // Without metadata there is no box to overlay, so the spinner has to occupy
  // space itself until the image knows its natural size.
  const spinnerIsStandalone = isFetching || !dimensions;

  const spinner = (
    <div
      className={`image-block__loading${
        spinnerIsStandalone ? " image-block__loading--standalone" : ""
      }`}
      role="status"
      aria-label="Loading image"
    >
      <span className="image-block__spinner" aria-hidden="true" />
    </div>
  );

  return (
    <>
      <div
        className={className ? `image-block ${className}` : "image-block"}
        style={style}
      >
        {isFetching ? (
          spinner
        ) : (
          <>
            <img
              src={src}
              alt={alt}
              width={dimensions?.width}
              height={dimensions?.height}
              onLoad={() => setLoadedSrc(src)}
              onError={() => setFailedSrc(src)}
              style={
                isImageLoading
                  ? {
                      opacity: 0,
                      position: dimensions ? undefined : "absolute",
                    }
                  : undefined
              }
            />
            {isImageLoading && spinner}
          </>
        )}

        {editable && role === "admin" && (
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
            void (async () => {
              try {
                const data = await refreshImageByTag(pageKey);
                setImageData(data);
                onImageUpdated?.();
              } catch (err) {
                console.error(err);
              }
            })();
          }}
          tag={pageKey}
        />
      )}
    </>
  );
}
