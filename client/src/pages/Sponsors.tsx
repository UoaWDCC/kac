import { useEffect, useState } from "react";
import { motion } from "motion/react";
import SponsorCard from "../components/SponsorCard";
import { getSponsors } from "../api/sponsorsApi";
import "../style/sponsors.css";
import { ImageBlock } from "../components/image_block/ImageBlock";
import PageTitle from "../components/PageTitle";

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

  const tabs: { label: string; value: Tab }[] = [
    { label: "All", value: "all" },
    { label: "Auckland CBD", value: "cbd" },
    { label: "Newmarket", value: "newmarket" },
    { label: "Other", value: "other" },
  ];

  const uniqueSponsors = sorted.filter(
    (s, index, self) => index === self.findIndex((t) => t.name === s.name)
  );
  const marqueeSponsors = [...uniqueSponsors, ...uniqueSponsors];
  return (
    <div className="sponsors-page">
      <PageTitle title="OUR SPONSORS" />

      {/* MARQUEE + OVERLAPPING MEMBERSHIP CARD */}
      <div className="sponsors-marquee-shell">
        <div className="sponsors-marquee-track-wrap">
          <div className="sponsors-marquee-track">
            {marqueeSponsors.map((s, i) => {
              const pageKey =
                "sponsor-" + s.name.toLowerCase().replace(/\s+/g, "-");
              return (
                <div
                  key={i}
                  style={{
                    backgroundColor: "#ffffff",
                    borderRadius: "15px",
                    width: "120px",
                    height: "120px",
                    boxShadow: "5px 5px 0px var(--color-yellow-medium)",
                    flexShrink: 0,
                    padding: "0.5rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <ImageBlock
                    pageKey={pageKey}
                    alt={s.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      borderRadius: "8px",
                    }}
                    editable={true}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* CSS taken from sponsor.css formerly sponsors-membership-card */}
        <ImageBlock
          pageKey="membership-card"
          alt="Membership Card"
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            maxWidth: "130px",
            zIndex: "2",
            border: "3px solid var(--color-blue-medium)",
            borderRadius: "12px",
          }}
          editable={false}
        />
      </div>

      {/* MEMBERSHIP BLURB */}
      <section className="sponsors-blurb">
        <div className="sponsors-centered-content">
          <p>
            Present your 2026 KAC membership card to our sponsors and receive
            these amazing deals!
          </p>
        </div>
      </section>

      {/* REST OF CONTENT - centered */}
      <div className="sponsors-centered-content sponsors-content-shell">
        {/* SEARCH BAR */}
        <section className="sponsors-search-section">
          <div className="sponsors-search-wrap">
            <input
              type="text"
              placeholder="Search for your favourite sponsors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="sponsors-search-input"
            />
            <span className="sponsors-search-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </span>
          </div>
        </section>

        {/* TABS */}
        <section className="sponsors-tabs-section">
          <div className="sponsors-tab-group">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                }}
                className={`sponsors-tab-button ${activeTab === tab.value ? "active" : ""
                  }`}
              >
                <span>{tab.label}</span>
                {activeTab === tab.value && (
                  <motion.span
                    layoutId="sponsor-pill"
                    transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                    className="sponsors-tab-pill"
                    style={{
                      position: "absolute",
                      inset: "2px",
                      borderRadius: "999px",
                      backgroundColor: "var(--color-yellow-dark)",
                      zIndex: 0,
                    }}
                  />
                )}
              </button>
            ))}
          </div>
        </section>

        {/* CBD */}
        {(activeTab === "all" || activeTab === "cbd") && cbd.length > 0 && (
          <section id="cbd">
            <h2 className="sponsors-section-title">Auckland CBD</h2>
            <div className="sponsors-grid">
              {cbd.map((s) => (
                <SponsorCard
                  key={s.name}
                  name={s.name}
                  description={s.deal}
                  location={s.address
                    .replace(/, Auckland CBD$/i, "")
                    .replace(/, Auckland City$/i, "")}
                />
              ))}
            </div>
          </section>
        )}

        {/* NEWMARKET */}
        {(activeTab === "all" || activeTab === "newmarket") &&
          newmarket.length > 0 && (
            <section id="newmarket">
              <h2 className="sponsors-section-title">Newmarket</h2>
              <div className="sponsors-grid">
                {newmarket.map((s) => (
                  <SponsorCard
                    key={s.name}
                    name={s.name}
                    description={s.deal}
                    location={s.address.replace(/, Newmarket$/i, "")}
                  />
                ))}
              </div>
            </section>
          )}

        {/* OTHER */}
        {(activeTab === "all" || activeTab === "other") && other.length > 0 && (
          <section id="other">
            <h2 className="sponsors-section-title">Other</h2>
            <div className="sponsors-grid">
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
          <p className="sponsors-empty-state">No sponsors found.</p>
        )}
      </div>
    </div >
  );
};

export default Sponsors;
