import SponsorCard from "../components/SponsorCard";

const Sponsors = () => {
  return (
    <div
      style={{
        textAlign: "center",
        backgroundColor: "#faf3d1",
      }}
    >
      {/* HERO SECTION */}
      <section>
        <h1>Sponsors</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <a href="#CBD">CBD Sponsors</a>
          <a href="#Newmarket">Newmarket Sponsors</a>
          <a href="#Other">Other Sponsors</a>
        </div>
      </section>

      {/* MEMBERSHIP BLURB */}
      <section
        style={{
          backgroundColor: "#ffffff",
        }}
      >
        <img src="/path/to/membership-card.jpg" alt="Membership Card" />
        <h2>
          Present your 2026 KAC membership card to our sponsors and receive
          these amazing deals!
        </h2>
      </section>

      {/* CBD SPONSOR SECTION */}
      <section id="CBD">
        <h2>CBD Sponsors</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <SponsorCard
            name="Sponsor 1"
            description="Description for Sponsor 1"
            location="Location 1"
          />
          <SponsorCard
            name="Sponsor 2"
            description="Description for Sponsor 2"
            location="Location 2"
          />
          <SponsorCard
            name="Sponsor 3"
            description="Description for Sponsor 3"
            location="Location 3"
          />
        </div>
      </section>

      {/* NEWMARKET SPONSOR SECTION */}
      <section id="Newmarket">
        <h2>Newmarket Sponsors</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <SponsorCard
            name="Sponsor 1"
            description="Description for Sponsor 1"
            location="Location 1"
          />
          <SponsorCard
            name="Sponsor 2"
            description="Description for Sponsor 2"
            location="Location 2"
          />
          <SponsorCard
            name="Sponsor 3"
            description="Description for Sponsor 3"
            location="Location 3"
          />
        </div>
      </section>

      {/* OTHER SPONSOR SECTION */}
      <section id="Other">
        <h2>Other Sponsors</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <SponsorCard
            name="Sponsor 1"
            description="Description for Sponsor 1"
            location="Location 1"
          />
          <SponsorCard
            name="Sponsor 2"
            description="Description for Sponsor 2"
            location="Location 2"
          />
          <SponsorCard
            name="Sponsor 3"
            description="Description for Sponsor 3"
            location="Location 3"
          />
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
