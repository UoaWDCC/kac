import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import { createExec } from "../api/execsApi";

interface ModalProps {
  onCreated?: () => void;
}

export default function Modal({ onCreated }: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState("");
  const [execRole, setExecRole] = useState("");
  const [roleGroup, setRoleGroup] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [degree, setDegree] = useState("");
  const [mbti, setMBTI] = useState("");
  const [fact, setFact] = useState("");
  const [sponsor, setSponsor] = useState("");
  const [greenFlag, setGreenFlag] = useState("");
  const [redFlag, setRedFlag] = useState("");
  const [emojis, setEmojis] = useState("");

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async () => {
    try {
      console.log(displayName, execRole, roleGroup);
      const imageURL = "src/images/exec-placeholder.png";
      const created = await createExec({
        imageURL,
        displayName,
        execRole,
        roleGroup,
        ethnicity,
        degree,
        mbti,
        fact,
        sponsor,
        greenFlag,
        redFlag,
        emojis,
      });
      console.log("Exec created successfully!", created);

      // notify to refresh list
      if (onCreated) onCreated();

      // reset form fields
      setDisplayName("");
      setExecRole("");
      setRoleGroup("");
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    }
    closeModal();
  };

  return (
    <div>
      {role === "admin" && (
        <div className="add-exec-container my-16">
          <button className="add-exec-button" type="button" onClick={openModal}>
            <Plus className="dynamic-size-icon" />
            <p>New Executive</p>
          </button>

          {isOpen && (
            <div
              className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000"
              onClick={handleOverlayClick}
            >
              <div className="font-alan-sans text-sm bg-white rounded-2xl pr-6 pt-8 justify-center relative border-box min-w-[48vw] h-fit max-h-[90vh] flex flex-col gap-6">
                <div className="overflow-y-auto pl-12 pr-6">
                  <h2 className="text-2xl! font-bold pb-6">Edit Executive</h2>
                  <form className="flex flex-col gap-8">
                    <div className="flex flex-row gap-10">
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Display Name</h3>
                        <input
                          id="displayName"
                          type="text"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>

                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Executive Role</h3>
                        <input
                          id="execRole"
                          type="text"
                          value={execRole}
                          onChange={(e) => setExecRole(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Role Group</h3>
                        <select
                          id="roleGroup"
                          value={roleGroup}
                          onChange={(e) => setRoleGroup(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        >
                          <option value="" className="text-gray-500">
                            -- Please choose a group --
                          </option>
                          <option value="president">President</option>
                          <option value="admin">Admin</option>
                          <option value="events">Events</option>
                          <option value="public-relations">
                            Public Relations
                          </option>
                          <option value="marketing">Marketing</option>
                          <option value="aesir-representative">
                            Aesir Representative
                          </option>
                        </select>
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Ethnicity</h3>
                        <input
                          id="ethnicity"
                          type="text"
                          value={ethnicity}
                          onChange={(e) => setEthnicity(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <h3 className="text-lg font-bold">Degree</h3>
                      <input
                        id="degree"
                        type="text"
                        value={degree}
                        onChange={(e) => setDegree(e.target.value)}
                        className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Fun Fact</h3>
                        <input
                          id="fact"
                          type="text"
                          value={fact}
                          onChange={(e) => setFact(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">MBTI</h3>
                        <input
                          id="mbti"
                          type="text"
                          value={mbti}
                          onChange={(e) => setMBTI(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1 w-full">
                      <h3 className="text-lg font-bold">
                        Favourite KAC Sponsor
                      </h3>
                      <input
                        id="sponsor"
                        type="text"
                        value={sponsor}
                        onChange={(e) => setSponsor(e.target.value)}
                        className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                    <div className="flex flex-row gap-10">
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Red Flag</h3>
                        <input
                          id="redFlag"
                          type="text"
                          value={redFlag}
                          onChange={(e) => setRedFlag(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1 w-full">
                        <h3 className="text-lg font-bold">Green Flag</h3>
                        <input
                          id="greenFlag"
                          type="text"
                          value={greenFlag}
                          onChange={(e) => setGreenFlag(e.target.value)}
                          className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold">Favourite Emojis</h3>
                      <input
                        id="emojis"
                        type="text"
                        value={emojis}
                        onChange={(e) => setEmojis(e.target.value)}
                        className="w-fit py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                      />
                    </div>
                  </form>
                </div>
                <div className="flex justify-center pb-8">
                  <button
                    className="cursor-pointer px-12 w-fit! h-10 rounded-3xl font-bold text-lg text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                    type="button"
                    onClick={handleSubmit}
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
