import { useEffect, useState } from "react";

import "../style/common.css";
import "../style/about.css";

import { useAuth } from "../auth/useAuth";
import { editExec } from "../api/execsApi";

interface Executive {
  id?: string;
  imageURL?: string;
  displayName?: string;
  execRole?: string;
  roleGroup?: string;
  description?: string;
}

interface ModalProps {
  exec: Executive | null;
  onClose: () => void;
  onEdited?: () => void;
}

export default function Modal({
  exec,
  onClose,
  onEdited,
}: Readonly<ModalProps>) {
  const { role } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [execRole, setExecRole] = useState("");
  const [roleGroup, setRoleGroup] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (!exec) return;
    setDisplayName(exec.displayName ?? "");
    setExecRole(exec.execRole ?? "");
    setRoleGroup(exec.roleGroup ?? "");
    setDescription(exec.description ?? "");
  }, [exec]);

  const closeModal = (): void => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  const handleSubmit = async () => {
    if (!exec) return;

    try {
      if (!exec?.id) return;

      const edited = await editExec(
        exec.id,
        exec.imageURL || "src/images/exec-placeholder.png",
        displayName,
        execRole,
        roleGroup,
        description
      );
      console.log("Exec updated successfully!", edited);

      if (onEdited) onEdited();
    } catch (error) {
      console.error("Error occurred while submitting the form:", error);
    }

    closeModal();
  };

  if (!exec || role !== "admin") {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-1000"
      onClick={handleOverlayClick}
    >
      <div className="font-alan-sans text-sm bg-white rounded-2xl px-12 py-8 justify-center relative border-box min-w-[36vw] h-fit flex flex-col gap-6">
        <h2 className="text-2xl! font-bold">Edit Executive</h2>
        <form className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h3 className="text-lg font-bold">Display Name</h3>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
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
              <option value="aesir-representative">Aesir Representative</option>
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
              className="resize-none w-full py-2 border-t-0 border-l-0 border-r-0 border-b-yellow-dark border-2 outline-none"
            ></textarea>
          </div>
        </form>

        <div className="flex justify-center mt-4">
          <button
            className="cursor-pointer py-2 px-12 w-fit! h-10 rounded-3xl font-bold text-lg text-blue-medium hover:text-yellow-light bg-yellow-dark! hover:bg-blue-medium! duration-200 shadow-[2px_4px] shadow-yellow-medium hover:shadow-gray-400"
            type="button"
            onClick={handleSubmit}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
