import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ImageBlock } from "./ImageBlock/ImageBlock";

interface ImageSliderProps {
  pageKeys: string[];
  role: "admin" | "user";
}

const ImageSlider = ({ pageKeys, role }: ImageSliderProps) => {
  const [positionIndexes, setPositionIndexes] = useState<number[]>(
    pageKeys.map((_, i) => i)
  );

  const total = pageKeys.length;

  const handleNext = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map((prevIndex) => (prevIndex + 1) % total)
    );
  };

  const handleBack = () => {
    setPositionIndexes((prevIndexes) =>
      prevIndexes.map((prevIndex) => (prevIndex + total - 1) % total)
    );
  };

  const positions: string[] = ["center", "left", "right"];

  const imageVariants: Variants = {
    center: { x: "-2%", y: "20%", scale: 1.2, zIndex: 4 },
    left: { x: "-80%", y: "-20%", scale: 0.8, zIndex: 3 },
    right: { x: "75%", y: "-20%", scale: 0.8, zIndex: 3 },
  };

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <h3 className="absolute z-20 top-[20%] left-1/2 -translate-x-1/2 font-monospace text-[2rem] 2xl:text-[2.6rem] font-medium">
        Our Recent Events
      </h3>
      {pageKeys.map((pageKey, index) => {
        return (
          <motion.div
            key={pageKey}
            initial="center"
            animate={positions[positionIndexes[index]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
            style={{ width: "40%", position: "absolute" }}
            className="rounded-xl overflow-hidden"
          >
            <ImageBlock pageKey={pageKey} role={role} alt={pageKey} />
          </motion.div>
        );
      })}
      <div className="flex flex-row gap-32 absolute z-20 bottom-16 2xl:bottom-24 left-1/2 -translate-x-1/2">
        <button className="button" onClick={handleBack}>
          Back
        </button>
        <button className="button" onClick={handleNext}>
          Next
        </button>
      </div>
    </div>
  );
};

export default ImageSlider;
