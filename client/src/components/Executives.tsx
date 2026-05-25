import "../style/common.css";
import "../style/about.css";

import { useMemo, useEffect, useState } from "react";

import NewExecModal from "./NewExecModal";

import ExecCard from "./ExecCard";
import api from "../api";

interface Executive {
  id: string;
  imageURL: string;
  displayName: string;
  execRole: string;
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
      const res = await api.get("/executives");
      setExecs(res.data);
    } catch (error) {
      console.error("Error fetching executives data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExecs();
  }, []);

  const groupExecs = useMemo(() => {
    const group = new Map<string, Executive[]>();

    if (!execs) return [] as Array<[string, Executive[]]>;

    for (const exec of execs) {
      const role = exec.execRole?.trim() || "Unassigned";
      if (!group.has(role)) group.set(role, []);
      group.get(role)!.push(exec);
    }

    return Array.from(group.entries())
      .sort(([aRole], [bRole]) => aRole.localeCompare(bRole))
      .map(([role, roleExecs]): [string, Executive[]] => [
        role,
        [...roleExecs].sort((a, b) =>
          a.displayName.localeCompare(b.displayName)
        ),
      ]);
  }, [execs]);

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
      {groupExecs.map(([role, roleExecs]) => (
        <section key={role} className="exec-role-section">
          <h2 className="exec-role-title">{role}</h2>

          <div className="exec-role-grid">
            {roleExecs.map((exec) => (
              <ExecCard
                role="admin"
                key={exec.id}
                id={exec.id}
                imageURL={exec.imageURL}
                displayName={exec.displayName}
                execRole={exec.execRole}
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
                onDelete={loadExecs}
              />
            ))}
          </div>
        </section>
      ))}

      <NewExecModal />
    </div>
  );
};

export default Executives;
