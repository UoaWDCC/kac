import { useEffect, useState } from "react";
import SponsorCard from "../components/SponsorCard";
import sponsorsJsonData from "../placeholders/sponsors.json";

// 1. Define the shape of a single sponsor
interface Sponsor {
  name: string;
  deal: string;
  address: string;
  code?: string;
}

// 2. Define the shape of the whole JSON file
interface SponsorsData {
  cbd_sponsors: Sponsor[];
  newmarket_sponsors: Sponsor[];
  other_sponsors: Sponsor[];
}

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<SponsorsData | null>(null);

  useEffect(() => {
    Promise.resolve(sponsorsJsonData as SponsorsData)
      .then((data) => setSponsors(data))
      .catch((err) => console.error("Error loading sponsors:", err));
  }, []);

  if (!sponsors) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Loading Sponsors...
      </div>
    );
  }

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    padding: "2rem",
  } as const;

  return (
    <div style={{ textAlign: "center", backgroundColor: "#faf3d1" }}>
      {/* HERO SECTION */}
      <section style={{ padding: "2rem 0" }}>
        <h1>Sponsors</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: "2rem" }}>
          <a href="#CBD">CBD Sponsors</a>
          <a href="#Newmarket">Newmarket Sponsors</a>
          <a href="#Other">Other Sponsors</a>
        </div>
      </section>

      {/* MEMBERSHIP BLURB */}
      <section style={{ backgroundColor: "#ffffff", padding: "2rem" }}>
        <img
          src="public/membership_card.png"
          alt="Membership Card"
          style={{ maxWidth: "150px" }}
        />
        <h2>
          Present your 2026 KAC membership card to our sponsors and receive
          these amazing deals!
        </h2>
      </section>

      {/* CBD SPONSOR SECTION */}
      <section id="CBD">
        <h2 style={{ marginTop: "2rem" }}>CBD Sponsors</h2>
        <div style={gridStyle}>
          {sponsors.cbd_sponsors.map((s, index) => (
            <SponsorCard
              key={index}
              name={s.name}
              description={s.deal} // Mapping 'deal' from JSON to 'description' prop
              location={s.address} // Mapping 'address' from JSON to 'location' prop
            />
          ))}
        </div>
      </section>

      {/* NEWMARKET SPONSOR SECTION */}
      <section id="Newmarket">
        <h2 style={{ marginTop: "2rem" }}>Newmarket Sponsors</h2>
        <div style={gridStyle}>
          {sponsors.newmarket_sponsors.map((s, index) => (
            <SponsorCard
              key={index}
              name={s.name}
              description={s.deal}
              location={s.address}
            />
          ))}
        </div>
      </section>

      {/* OTHER SPONSOR SECTION */}
      <section id="Other">
        <h2 style={{ marginTop: "2rem" }}>Other Sponsors</h2>
        <div style={gridStyle}>
          {sponsors.other_sponsors.map((s, index) => (
            <SponsorCard
              key={index}
              name={s.name}
              description={s.deal + (s.code ? ` (Code: ${s.code})` : "")}
              location={s.address}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Sponsors;
