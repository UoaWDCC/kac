import "../style/common.css";
import "../style/about.css";

import { useEffect, useState } from "react";
import ExecCard from "./ExecCard";

interface Executive {
  id: string;
  imageURL: string;
  displayName: string;
  role: string;
  description: string;
  fullName: string;
  ethnicity: string;
  degree: string;
  mbti: string;
  fact: string;
  sponsor: string;
  greenFlag: string;
  redFlag: string;
  emojis: string;
}

const Executives = () => {
  const [execs, setExecs] = useState<Executive[] | null>(null);
  const [loading, setLoading] = useState(true);

  const loadExecs = async () => {
    try {
      setLoading(true);
      const data = await fetch("/api/executives");
      setExecs(await data.json());
    } catch (error) {
      console.error("Error fetching executives data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExecs();
  }, []);

  if (loading) {
    return (
      <div
        className="loading"
        style={{ textAlign: "center", marginTop: "2rem" }}
      >
        Loading executives...
      </div>
    );
  }

  if (!execs) {
    return (
      <div className="error" style={{ textAlign: "center", marginTop: "2rem" }}>
        Failed to load executives.
      </div>
    );
  }

  return (
    <div className="executives-container">
      {execs.map((exec) => {
        return (
          <ExecCard
            key={exec.id}
            imageURL={exec.imageURL}
            displayName={exec.displayName}
            role={exec.role}
            description={exec.description}
            fullName={exec.fullName}
            ethnicity={exec.ethnicity}
            degree={exec.degree}
            mbti={exec.mbti}
            fact={exec.fact}
            sponsor={exec.sponsor}
            greenFlag={exec.greenFlag}
            redFlag={exec.redFlag}
            emojis={exec.emojis}
          />
        );
      })}
    </div>
  );
};

export default Executives;
