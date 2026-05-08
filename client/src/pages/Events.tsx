import EventCard from "../components/EventCard.tsx";
import eventsData from "../placeholders/events.json";

const PAGE_TITLE = "Upcoming Events";

const Events = () => {
  return (
    <div
      className="section yellow-bg"
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        className="title-text"
        style={{ textAlign: "center", marginBottom: "40px" }}
      >
        {PAGE_TITLE}
      </h1>
      {eventsData.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          imageUrl={event.imageUrl}
          title={event.title}
          time={new Date(event.time)}
          location={event.location}
          description={event.description}
          memberPrice={event.memberPrice}
          nonMemberPrice={event.nonMemberPrice}
          role="admin" // Hardcoded for dev preview
          status={event.status as "open" | "waitlist" | "ended"}
        />
      ))}
    </div>
  );
};

export default Events;
