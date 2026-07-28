import "../style/common.css";
import "../style/past-event-detail.css";

const PastEventDetail = () => {
  return (
    <div className="medium-content past-event-page">
      <p className="past-event-subtitle">2026 Semester 1 Mid Sem Break</p>
      <h1 className="past-event-title">AFDA 2026</h1>

      <div className="past-event-grid">
        {Array.from({ length: 24 }).map((_, index) => (
          <button
            key={index}
            type="button"
            className="past-event-tile"
            aria-label={`Open photo ${index + 1}`}
          />
        ))}
      </div>

      <button type="button" className="button past-event-more-button">
        More Photos
      </button>
    </div>
  );
};

export default PastEventDetail;