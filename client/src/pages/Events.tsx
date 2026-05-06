import EventCard from "../components/EventCard.tsx";

// Event Data placeholder.
const ICE_KACHANG_EVENT = {
  title: "Ice Kachang",
  time: new Date("2026-04-02T18:00:00"),
  location: "401-318 Engineering Atrium (Level 3)",
  description: "Hot, stressed and over Uni already? Say less... we've got the perfect cooldown for you. Come chill with SSA at our Ice Kachang Night. Sweet, icy, colourful... but there's a twist 👀",
  memberPrice: "$5",
  nonMemberPrice: "$11",
  rsvpUrl: "#",
  imageUrl: ""
};

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
      <EventCard
        imageUrl={ICE_KACHANG_EVENT.imageUrl}
        title={ICE_KACHANG_EVENT.title}
        time={ICE_KACHANG_EVENT.time}
        location={ICE_KACHANG_EVENT.location}
        description={ICE_KACHANG_EVENT.description}
        memberPrice={ICE_KACHANG_EVENT.memberPrice}
        nonMemberPrice={ICE_KACHANG_EVENT.nonMemberPrice}
        rsvpUrl={ICE_KACHANG_EVENT.rsvpUrl}
        role={"admin"} // Hardcoded for now.
      />
    </div>
  );
};

export default Events;
