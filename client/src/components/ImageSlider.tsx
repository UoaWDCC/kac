import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ImageBlock } from "./image_block/ImageBlock";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageSliderProps {
  pageKeys: string[];
}

const ImageSlider = ({ pageKeys }: ImageSliderProps) => {
  const [positionIndexes, setPositionIndexes] = useState<number[]>(
    pageKeys.map((_, i) => i)
  );

  const total = pageKeys.length;

  // The desktop carousel drops the centre slide well below the midline so it
  // clears the heading floating above it. On mobile there is nothing overhead
  // and far less room, so the stack sits much closer to centre.
  const [isCompact, setIsCompact] = useState(
    () => globalThis.matchMedia("(max-width: 63.999rem)").matches
  );

  useEffect(() => {
    const compact = globalThis.matchMedia("(max-width: 63.999rem)");
    const handleChange = (event: MediaQueryListEvent) => {
      setIsCompact(event.matches);
    };

    compact.addEventListener("change", handleChange);
    return () => compact.removeEventListener("change", handleChange);
  }, []);

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

  // Bring one slide to the centre position - used by the mobile dot controls.
  const handleSelect = (target: number) => {
    setPositionIndexes(pageKeys.map((_, i) => (i - target + total) % total));
  };

  const activeIndex = positionIndexes.indexOf(0);

  const positions: string[] = ["center", "left", "right"];

  const imageVariants: Variants = {
    center: { x: "0%", y: isCompact ? "0%" : "24%", scale: 1.1, zIndex: 4 },
    left: {
      x: isCompact ? "-85%" : "-90%",
      y: isCompact ? "0%" : "-20%",
      scale: isCompact ? 0.7 : 0.6,
      zIndex: 3,
    },
    right: {
      x: isCompact ? "85%" : "90%",
      y: isCompact ? "0%" : "-20%",
      scale: isCompact ? 0.7 : 0.6,
      zIndex: 3,
    },
  };

  return (
    <>
      <div className="flex items-center flex-col justify-center h-[70vw] lg:h-screen">
        {pageKeys.map((pageKey, index) => {
          return (
            <motion.div
              key={pageKey}
              initial="center"
              animate={positions[positionIndexes[index]]}
              variants={imageVariants}
              transition={{ duration: 0.5 }}
              style={{ position: "absolute" }}
              className="w-[68%] lg:w-[50%] rounded-xl overflow-hidden"
              /* Mobile has no chevrons, so the slides are the control: tap a
                 peeking card to bring it forward, or swipe the stack. */
              drag={isCompact ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={(_, info) => {
                if (!isCompact) return;
                if (info.offset.x < -60) handleNext();
                else if (info.offset.x > 60) handleBack();
              }}
              onClick={() => {
                if (isCompact && positionIndexes[index] !== 0) {
                  handleSelect(index);
                }
              }}
            >
              <div className="bg-white justify-self-left rounded-2xl px-4 pt-4 pb-1 lg:px-8 lg:pt-8 lg:pb-2 flex flex-col">
                <div className="self-center">
                  <ImageBlock
                    pageKey={pageKey}
                    alt={pageKey}
                    style={{ borderRadius: "0.8rem" }}
                    editable={true}
                  />
                </div>
                <h3 className="mt-2 mb-1 lg:mt-4 lg:mb-2 justify-self-start! font-sans text-[0.9rem] lg:text-[1.4rem]">
                  {pageKey}
                </h3>
              </div>
            </motion.div>
          );
        })}
        <div className="hidden lg:block absolute z-20 right-[calc(130%*1.2/2)] top-5/8 w-fit! h-fit! rounded-full p-8">
          <ChevronLeft
            size={"3rem"}
            onClick={handleBack}
            className="stroke-blue-medium stroke-3 hover:rotate-34 duration-200 transition cursor-pointer"
          />
        </div>
        <div className="hidden lg:block absolute z-20 left-[calc(130%*1.2/2)] top-5/8 w-fit! h-fit! rounded-full p-8">
          <ChevronRight
            size={"3rem"}
            onClick={handleNext}
            className="stroke-blue-medium stroke-3 hover:-rotate-34 duration-200 transition cursor-pointer"
          />
        </div>
      </div>

      {/** Dot controls replace the chevrons on mobile, where the arrows would sit
       * outside the viewport. Kept in normal flow, below the absolutely
       * positioned cards, so they never land on top of a caption. */}
      <div className="relative z-20 flex justify-center gap-3 lg:hidden">
        {pageKeys.map((pageKey, index) => (
          <button
            key={pageKey}
            aria-current={activeIndex === index}
            aria-label={`Show ${pageKey}`}
            className={`slider-dot${activeIndex === index ? " is-active" : ""}`}
            onClick={() => handleSelect(index)}
            type="button"
          />
        ))}
      </div>
    </>
  );
};

export default ImageSlider;
