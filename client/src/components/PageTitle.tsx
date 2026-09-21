import { ImageBlock } from "./image_block/ImageBlock";
import "../style/page-title.css";

const PageTitle = ({ title }: { title: string }) => {
  return (
    <div className="page-title-container">
      <section className="page-title-section">
        <div className="page-title-inner">
          <div className="page-title-image">
            <ImageBlock
              pageKey="title"
              alt="Club Mascot"
              editable={false}
            />
          </div>
          <h1 className="page-title-heading">{title}</h1>
        </div>
      </section>
    </div>
  );
};

export default PageTitle;
