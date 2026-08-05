import { useEffect, useState } from "react";
import SponsorCard from "../components/SponsorCard";
import { getSponsors } from "../api/sponsorsApi";

interface Sponsor {
  name: string;
  deal: string;
  address: string;
  category: "cbd" | "newmarket" | "other";
  code?: string;
}

type Tab = "all" | "cbd" | "newmarket" | "other";

const Sponsors = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");

  useEffect(() => {
    getSponsors()
      .then((data) => setSponsors(data))
      .catch((err) => console.error("Error loading sponsors:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Loading Sponsors...
      </div>
    );
  }
  const sorted = [...sponsors].sort((a, b) => a.name.localeCompare(b.name));
  const filtered = sorted.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "all" || s.category === activeTab;
    return matchesSearch && matchesTab;
  });

  const cbd = filtered.filter((s) => s.category === "cbd");
  const newmarket = filtered.filter((s) => s.category === "newmarket");
  const other = filtered.filter((s) => s.category === "other");

  const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "2rem",
    padding: "2rem",
  } as const;

  const tabs: { label: string; value: Tab }[] = [
    { label: "All", value: "all" },
    { label: "Auckland CBD", value: "cbd" },
    { label: "New Market", value: "newmarket" },
    { label: "Other", value: "other" },
  ];

  const marqueeSponsors = [...sorted, ...sorted];

  const centeredContent = {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 2rem",
  };

  return (
    <div style={{ backgroundColor: "var(--color-yellow-light)" }}>
      {/* HERO - centered */}
      <div style={{ ...centeredContent }}>
        <section style={{ padding: "6rem 0 2rem 0" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <img
              src="src/images/kacoSponsorHeader.png"
              alt="Mascot"
              style={{
                position: "absolute",
                left: "-95px",
                bottom: "20px",
                width: "200px",
                zIndex: 2,
              }}
            />
            <h1
              style={{
                fontWeight: "bold",
                margin: 0,
                fontSize: "6rem",
                paddingLeft: "2rem",
              }}
            >
              OUR SPONSORS
            </h1>
          </div>
        </section>
      </div>

      {/* MARQUEE + OVERLAPPING MEMBERSHIP CARD */}
      <div style={{ position: "relative", marginTop: "1.5rem" }}>
        {/* MARQUEE - full width */}
        <div
          style={{
            overflow: "hidden",
            backgroundColor: "var(--color-yellow-light)",
            padding: "1rem 0",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "2rem",
              width: "max-content",
              animation: "marquee 400s linear infinite",
            }}
          >
            {marqueeSponsors.map((s, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: "#ffffff",
                  borderRadius: "15px",
                  width: "120px",
                  height: "120px",
                  boxShadow: "5px 5px 0px var(--color-yellow-medium)",
                  flexShrink: 0,
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* MEMBERSHIP CARD - overlapping in center */}
        <img
          src="src/images/membership_card.png"
          alt="Membership Card"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "130px",
            zIndex: 2,
            border: "3px solid var(--color-blue-medium)",
            borderRadius: "12px",
          }}
        />
      </div>

      {/* MARQUEE ANIMATION */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>

      {/* MEMBERSHIP BLURB */}
      <section style={{ padding: "6rem 2rem 2rem 2rem", textAlign: "center" }}>
        <div style={centeredContent}>
          <p style={{ fontWeight: "normal", fontSize: "1rem" }}>
            Present your 2026 KAC membership card to our sponsors and receive
            these amazing deals!
          </p>
        </div>
      </section>

      {/* REST OF CONTENT - centered */}
      <div style={{ ...centeredContent, textAlign: "center" }}>
        {/* SEARCH BAR */}
        <section style={{ padding: "2rem 2rem" }}>
          <input
            type="text"
            placeholder="Search for your favourite sponsors..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "80%",
              padding: "0.75rem 1rem",
              borderRadius: "999px",
              border: "1px solid var(--color-grey-medium)",
              fontSize: "1rem",
            }}
          />
        </section>

        {/* TABS */}
        <section
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0",
            paddingTop: "1.5rem",
            paddingBottom: "2rem",
          }}
        >
          <div
            style={{
              display: "flex",
              backgroundColor: "var(--color-yellow-medium)",
              borderRadius: "999px",
              padding: "0.25rem",
              gap: "0.25rem",
            }}
          >
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: "0.35rem 1.75rem",
                  borderRadius: "999px",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  whiteSpace: "nowrap",
                  backgroundColor:
                    activeTab === tab.value
                      ? "var(--color-yellow-dark)"
                      : "var(--color-yellow-medium)",
                  fontWeight: activeTab === tab.value ? "bold" : "normal",
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* CBD */}
        {(activeTab === "all" || activeTab === "cbd") && cbd.length > 0 && (
          <section>
            <h2
              style={{
                marginTop: "2rem",
                textAlign: "left",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-yellow-dark)",
                fontSize: "2rem",
              }}
            >
              Auckland CBD
            </h2>
            <div style={gridStyle}>
              {cbd.map((s, index) => (
                <SponsorCard
                  key={index}
                  name={s.name}
                  description={s.deal}
                  location={s.address}
                />
              ))}
            </div>
          </section>
        )}

        {/* NEWMARKET */}
        {(activeTab === "all" || activeTab === "newmarket") &&
          newmarket.length > 0 && (
            <section>
              <h2
                style={{
                  marginTop: "2rem",
                  textAlign: "left",
                  paddingBottom: "0.5rem",
                  borderBottom: "2px solid var(--color-yellow-dark)",
                  fontSize: "2rem",
                }}
              >
                New Market
              </h2>
              <div style={gridStyle}>
                {newmarket.map((s, index) => (
                  <SponsorCard
                    key={index}
                    name={s.name}
                    description={s.deal}
                    location={s.address}
                  />
                ))}
              </div>
            </section>
          )}

        {/* OTHER */}
        {(activeTab === "all" || activeTab === "other") && other.length > 0 && (
          <section>
            <h2
              style={{
                marginTop: "2rem",
                textAlign: "left",
                paddingBottom: "0.5rem",
                borderBottom: "2px solid var(--color-yellow-dark)",
                fontSize: "2rem",
              }}
            >
              Other
            </h2>
            <div style={gridStyle}>
              {other.map((s, index) => (
                <SponsorCard
                  key={index}
                  name={s.name}
                  description={s.deal + (s.code ? ` (Code: ${s.code})` : "")}
                  location={s.address}
                />
              ))}
            </div>
          </section>
        )}

        {/* NO RESULTS */}
        {filtered.length === 0 && (
          <p style={{ padding: "2rem" }}>No sponsors found.</p>
        )}
      </div>
    </div>
  );
};

export default Sponsors;
