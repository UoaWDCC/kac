import { useState } from "react";
import { useAuth } from "../../auth/useAuth";
import RichTextEditor from "../RichTextEditor";
import { purifyHtml } from "../../util/htmlFormat";

interface PastExecsProps {
  content: string;
  onChange: (content: string) => void;
  onSave: () => Promise<void>;
}

const PastExecsEditor = ({
  content,
  onChange,
  onSave,
}: Readonly<PastExecsProps>) => {
  const { role } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <section className="exec-role-section">
      <div className="past-execs-card">
        <h2 className="exec-role-title font-monospace">OUR PAST EXECS:</h2>

        {editing ? (
          <>
            <RichTextEditor value={content} onChange={onChange} />

            <button
              type="button"
              className="past-execs-edit-button"
              onClick={async () => {
                try {
                  await onSave();
                  setEditing(false);
                } catch (error) {
                  console.error(
                    "Failed to save past executives content: ",
                    error
                  );
                }
              }}
            >
              Save
            </button>
          </>
        ) : (
          <>
            <div
              className="past-execs-content"
              dangerouslySetInnerHTML={{ __html: purifyHtml(content) }}
            />

            {role === "admin" && (
              <button
                type="button"
                className="past-execs-edit-button"
                onClick={() => setEditing(true)}
              >
                Edit
              </button>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default PastExecsEditor;
