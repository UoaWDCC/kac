import { useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ImageBlock } from "./ImageBlock/ImageBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  pageKeys: string[];
}

const ImageSlider = ({ pageKeys }: ImageSliderProps) => {
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
    center: { x: "0%", y: "24%", scale: 1.1, zIndex: 4 },
    left: { x: "-90%", y: "-20%", scale: 0.6, zIndex: 3 },
    right: { x: "90%", y: "-20%", scale: 0.6, zIndex: 3 },
  };

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      {pageKeys.map((pageKey, index) => {
        return (
          <motion.div
            key={pageKey}
            initial="center"
            animate={positions[positionIndexes[index]]}
            variants={imageVariants}
            transition={{ duration: 0.5 }}
            style={{ width: "50%", position: "absolute" }}
            className="rounded-xl overflow-hidden"
          >
            <div className="bg-white justify-self-left rounded-2xl px-8 pt-8 pb-2 flex flex-col">
              <div className="self-center">
                <ImageBlock
                  pageKey={pageKey}
                  alt={pageKey}
                  style={{ borderRadius: "0.8rem" }}
                />
              </div>
              <h3 className="mt-4 mb-2 justify-self-start! font-sans text-[1.4rem]">
                {pageKey}
              </h3>
            </div>
          </motion.div>
        );
      })}
      <button
        className="absolute z-20 right-[calc(130%*1.2/2)] top-5/8 w-fit! h-fit! rounded-full p-8"
        onClick={handleBack}
      >
        <ChevronLeft
          size={32}
          className="stroke-blue-medium stroke-3 hover:rotate-34 duration-200 transition"
        />
      </button>
      <button
        style={{}}
        className="absolute z-20 left-[calc(130%*1.2/2)] top-5/8 w-fit! h-fit! rounded-full p-8"
        onClick={handleNext}
      >
        <ChevronRight
          size={32}
          className="stroke-blue-medium stroke-3 hover:-rotate-34 duration-200 transition"
        />
      </button>
    </div>
  );
};

export default ImageSlider;
