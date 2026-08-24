import "../style/common.css";
import "../style/about.css";

import { useMemo, useEffect, useState } from "react";
import { X } from "lucide-react";

import NewExecModal from "./NewExecModal";
import EditExecModal from "./EditExecModal";

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
  const [editingExec, setEditingExec] = useState<Executive | null>(null);

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
                key={exec.id}
                id={exec.id}
                imageURL={exec.imageURL}
                displayName={exec.displayName}
                execRole={exec.execRole}
                onDelete={loadExecs}
                onOpen={() => setSelectedExec(exec)}
                onEdit={() => setEditingExec(exec)}
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

          <div className="relative w-[64vw] h-[80vh] max-h-150 max-w-254 bg-yellow-dark z-1 overflow-hidden flex rounded-4xl shadow-[10px_10px] shadow-yellow-medium">
            <div
              className="absolute right-8 top-10 z-10 flex size-10 items-center justify-center rounded-full text-blue-medium transition hover:scale-120 hover:cursor-pointer"
              onClick={() => setSelectedExec(null)}
              aria-label="Close executive preview"
            >
              <X size={40} strokeWidth={2} />
            </div>

            <div className="flex flex-row gap-8 text-blue-medium items-center w-full p-12">
              <img
                className="flex rounded-4xl h-full max-h-[64vh]"
                src={selectedExec.imageURL || EXEC_IMG}
                alt={selectedExec.displayName}
              />

              <div className="flex flex-col gap-8 2xl:gap-10 px-4 py-2 h-full justify-center">
                <div className="flex flex-col gap-1">
                  <h4 className="font-monospace font-semibold text-[20px] uppercase">
                    {selectedExec.execRole}
                  </h4>
                  <h3 className="text-4xl uppercase">
                    {selectedExec.displayName}
                  </h3>
                </div>
                <div className="flex flex-col gap-2 2xl:gap-8 font-alan-sans">
                  <div>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🌏 Ethnicity:</strong> {selectedExec.ethnicity}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🎓 Degree:</strong> {selectedExec.degree}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🌟 MBTI:</strong> {selectedExec.mbti}
                    </p>
                  </div>

                  <div>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🧩 Fun Fact:</strong> {selectedExec.fact}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>💰 Favourite KAC Sponsor:</strong>{" "}
                      {selectedExec.sponsor}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>✅ Green Flag:</strong> {selectedExec.greenFlag}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🚩 Red Flag:</strong> {selectedExec.redFlag}
                    </p>
                    <p className="text-md! 2xl:text-xl!">
                      <strong>🤩 Fav Emojis:</strong> {selectedExec.emojis}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingExec && (
        <EditExecModal
          exec={editingExec}
          onClose={() => setEditingExec(null)}
          onEdited={loadExecs}
        />
      )}

      <NewExecModal onCreated={loadExecs} />
    </div>
  );
};

export default Executives;
