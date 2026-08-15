import { useState } from "react";
import { Plus } from "lucide-react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import createExec from "../api/execsApi";
import { create } from "axios";

interface ModalProps {
  onCreated?: () => void;
}

export default function Modal({ onCreated }: ModalProps) {
  const { role } = useAuth();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [displayName, setDisplayName] = useState("");
  const [execRole, setExecRole] = useState("");
  const [roleGroup, setRoleGroup] = useState("");
  const [description, setDescription] = useState("");

  const openModal = (): void => setIsOpen(true);
  const closeModal = (): void => setIsOpen(false);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    try {
      console.log(displayName, execRole, roleGroup, description);
      const created = await createExec(
        "src/images/exec-placeholder.png", // placeholder until ImageBlock done
        displayName,
        execRole,
        roleGroup,
        description
      );
      console.log("Exec created successfully!", created);

      // notify to refresh list
      if (onCreated) onCreated();

      // reset form fields
      setDisplayName("");
      setExecRole("");
      setRoleGroup("");
      setDescription("");
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
              <div className="font-alan-sans  text-sm bg-white rounded-2xl px-12 py-8 justify-center relative border-box min-w-[36vw] h-fit flex flex-col gap-6">
                <h2 className="text-2xl! font-bold">New Executive</h2>
                <form className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">Display Name</h3>
                    <input
                      id="displayName"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Kaco"
                      className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">Executive Role</h3>
                    <input
                      id="execRole"
                      type="text"
                      value={execRole}
                      onChange={(e) => setExecRole(e.target.value)}
                      placeholder="Mascot"
                      className="w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
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
                      <option value="public-relations">Public Relations</option>
                      <option value="marketing">Marketing</option>
                      <option value="aesir-representative">
                        Aesir Representative
                      </option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold">Description</h3>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      cols={50}
                      rows={1}
                      wrap="hard"
                      placeholder="Kaco is the mascot of the Kiwi Asian Club..."
                      className="resize-none w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
                    ></textarea>
                  </div>
                </form>
                <div className="flex justify-center mt-4">
                  <button
                    className="cursor-pointer py-2 px-12 w-fit! h-10 rounded-3xl font-bold text-lg text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
                    type="submit"
                    onClick={() => {
                      handleSubmit(new Event("submit") as any);
                    }}
                  >
                    Create!
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
