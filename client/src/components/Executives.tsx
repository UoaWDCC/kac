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
  roleGroup?: string;
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

interface RoleGroup {
  id: string;
  label: string;
}

const ROLE_GROUPS: RoleGroup[] = [
  {
    id: "president",
    label: "PRESIDENTS:",
  },
  {
    id: "admin",
    label: "ADMIN:",
  },
  {
    id: "events",
    label: "EVENTS:",
  },
  {
    id: "public-relations",
    label: "PUBLIC RELATIONS:",
  },
  {
    id: "marketing",
    label: "MARKETING:",
  },
  {
    id: "aesir-representative",
    label: "AESIR REPRESENTATIVE:",
  },
  {
    id: "past-exec",
    label: "OUR PAST EXECS:",
  },
];

const normaliseRoleKey = (value?: string) =>
  (value || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, " ");

const EXEC_IMG = "src/images/exec-placeholder.png";

const Executives = () => {
  const [execs, setExecs] = useState<Executive[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedExec, setSelectedExec] = useState<Executive | null>(null);

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

  const groupedExecs = useMemo(() => {
    if (!execs) return [] as Array<[RoleGroup, Executive[]]>;

    const groupedMap = new Map<string, Executive[]>();

    for (const exec of execs) {
      const normalisedRoleGroup = normaliseRoleKey(exec.roleGroup).replaceAll(
        " ",
        "-"
      );
      const groupId = normalisedRoleGroup || "other";

      if (!groupedMap.has(groupId)) groupedMap.set(groupId, []);
      groupedMap.get(groupId)!.push(exec);
    }

    const predefined = ROLE_GROUPS.map((group): [RoleGroup, Executive[]] => [
      group,
      [...(groupedMap.get(group.id) || [])],
    ]).filter(([, roleExecs]) => roleExecs.length > 0);

    const knownGroupIds = new Set(ROLE_GROUPS.map((group) => group.id));
    const customGroups = Array.from(groupedMap.entries())
      .filter(
        ([groupId, roleExecs]) =>
          !knownGroupIds.has(groupId) && roleExecs.length
      )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([groupId, roleExecs]): [RoleGroup, Executive[]] => [
        {
          id: groupId,
          label: groupId.replace(/[-_]/g, " ").toUpperCase(),
        },
        [...roleExecs],
      ]);

    return [...predefined, ...customGroups];
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
      {groupedExecs.map(([group, roleExecs]) => (
        <section key={group.id} className="exec-role-section">
          <h2 className="exec-role-title font-monospace">{group.label}</h2>

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
                onOpen={() => setSelectedExec(exec)}
              />
            ))}
          </div>
        </section>
      ))}

      {selectedExec && (
        <div className="modal-overlay exec-preview-overlay">
          <button
            type="button"
            className="exec-preview-dismiss"
            onClick={() => setSelectedExec(null)}
            aria-label="Close executive preview"
          />

          <div className="exec-preview-modal">
            <button
              type="button"
              className="exec-preview-close"
              onClick={() => setSelectedExec(null)}
              aria-label="Close executive preview"
            >
              ×
            </button>

            <div className="exec-preview-layout">
              <section className="exec-preview-image-section">
                <img
                  className="exec-preview-image"
                  src={selectedExec.imageURL || EXEC_IMG}
                  alt={selectedExec.displayName}
                />
              </section>

              <section className="exec-preview-copy-section">
                <p className="exec-preview-role">{selectedExec.execRole}</p>
                <h3 className="exec-preview-name">
                  {selectedExec.displayName}
                </h3>
                <p className="exec-preview-description">
                  {selectedExec.description}
                </p>
              </section>
            </div>
          </div>
        </div>
      )}

      <NewExecModal />
    </div>
  );
};

export default Executives;
