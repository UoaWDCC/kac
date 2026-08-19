import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import toast from "react-hot-toast";

import "../style/faq.css";
import "../style/common.css";
import RichTextEditor from "../components/RichTextEditor";
import {
  getContent,
  updateContent,
  createContent,
  deleteContent,
} from "../api/contentApi";
import mockFaqs from "../placeholders/faqs.json";
import { useAuth } from "../auth/useAuth";

interface Faq {
  question: string;
  answer: string;
}

function parseLegacyFaq(content: string): Faq[] {
  const lines = content.split("\n");
  const faqs: Faq[] = [];
  let current: Faq | null = null;

  for (const line of lines) {
    if (line.startsWith("#")) {
      if (current) faqs.push(current);
      current = { question: line.slice(1).trim(), answer: "" };
    } else if (current) {
      current.answer += (current.answer ? "\n" : "") + line;
    } else {
      // We've found an answer line without a question
      // This is unexpected, but we'll try to handle it gracefully
      current = { question: "Untitled Question", answer: line };
    }
  }

  if (current) faqs.push(current);
  return faqs;
}

function isFaqArray(value: unknown): value is Faq[] {
  if (!Array.isArray(value)) return false;
  return value.every(
    (entry) =>
      entry !== null &&
      typeof entry === "object" &&
      typeof (entry as Faq).question === "string" &&
      typeof (entry as Faq).answer === "string"
  );
}

function parseFaqContent(content: string): Faq[] {
  const trimmed = content.trim();

  if (trimmed.startsWith("[")) {
    try {
      const parsed: unknown = JSON.parse(trimmed);
      if (isFaqArray(parsed)) {
        return parsed;
      }
    } catch {
      // Fallback to legacy format parser.
    }
  }

  return parseLegacyFaq(content);
}

function serializeFaqContent(faqs: Faq[]): string {
  return JSON.stringify(faqs, null, 2);
}

function escapeHtml(text: string): string {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderAnswerHtml(answer: string): string {
  const containsHtml = /<[^>]+>/.test(answer);
  if (containsHtml) return answer;
  return escapeHtml(answer).replaceAll("\n", "<br />");
}

const Faq = () => {
  const { role } = useAuth();
  const isAdmin = role === "admin";
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [openIndexes, setOpenIndexes] = useState<number[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draftQuestion, setDraftQuestion] = useState("");
  const [draftAnswer, setDraftAnswer] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    getContent("faqs")
      .then((data) => {
        if (!isMounted) return;
        const parsedFaqs = parseFaqContent(data.content);
        setFaqs(parsedFaqs);
      })
      .catch(() => {
        if (!isMounted) return;
        if (import.meta.env.DEV) {
          setFaqs(mockFaqs);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const resetEditor = () => {
    setEditingIndex(null);
    setDraftQuestion("");
    setDraftAnswer("");
  };

  const saveFaqs = async (nextFaqs: Faq[]) => {
    const content = serializeFaqContent(nextFaqs);

    try {
      await updateContent("faqs", content);
    } catch (error) {
      if (error === "Content not found") {
        await createContent({ _id: "faqs", content });
      } else {
        throw error;
      }
    }

    setFaqs(nextFaqs);
  };

  const handleStartAdd = () => {
    setEditingIndex(-1);
    setDraftQuestion("");
    setDraftAnswer("<p></p>");
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setDraftQuestion(faqs[index].question);
    setDraftAnswer(faqs[index].answer);
  };

  const handleSave = async () => {
    const question = draftQuestion.trim();
    if (!question) {
      toast.error("Question is required.");
      return;
    }

    const updatedFaq = { question, answer: draftAnswer };
    const nextFaqs =
      editingIndex === -1
        ? [...faqs, updatedFaq]
        : faqs.map((item, index) =>
            index === editingIndex ? updatedFaq : item
          );

    setIsSaving(true);
    try {
      await saveFaqs(nextFaqs);
      toast.success(editingIndex === -1 ? "FAQ added." : "FAQ updated.");
      resetEditor();
    } catch {
      toast.error("Failed to save FAQ.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const nextFaqs = faqs.filter((_, faqIndex) => faqIndex !== index);

    setIsSaving(true);
    try {
      if (nextFaqs.length === 0) {
        await deleteContent("faqs");
      } else {
        await saveFaqs(nextFaqs);
      }
      toast.success("FAQ deleted.");

      if (editingIndex === index) {
        resetEditor();
      } else if (editingIndex !== null && editingIndex > index) {
        setEditingIndex(editingIndex - 1);
      }
      setOpenIndexes([]);
    } catch {
      toast.error("Failed to delete FAQ.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="faq-container">
      <section className="faq-title-wrap">
        <h1 className="faq-title">OUR FAQs</h1>
        <img
          className="faq-title-image"
          src="src/images/kaco-title.png"
          alt="Club mascot"
        />
      </section>
      {isAdmin ? (
        <section className="faq-admin-panel" aria-label="FAQ admin controls">
          <div className="faq-admin-panel-header">
            <h2 className="faq-admin-title">Manage FAQs</h2>
            <button
              className="faq-admin-button"
              type="button"
              onClick={handleStartAdd}
              disabled={isSaving}
            >
              Add FAQ
            </button>
          </div>
          {editingIndex !== null ? (
            <div className="faq-admin-form">
              <label className="faq-admin-label" htmlFor="faq-question-input">
                Question
              </label>
              <input
                id="faq-question-input"
                className="faq-admin-input"
                type="text"
                value={draftQuestion}
                onChange={(event) => setDraftQuestion(event.target.value)}
                placeholder="Enter question"
              />
              <label className="faq-admin-label">Answer</label>
              <RichTextEditor value={draftAnswer} onChange={setDraftAnswer} />
              <div className="faq-admin-actions">
                <button
                  className="faq-admin-button"
                  type="button"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {editingIndex === -1 ? "Create" : "Save"}
                </button>
                <button
                  className="faq-admin-button faq-admin-button-secondary"
                  type="button"
                  onClick={resetEditor}
                  disabled={isSaving}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
      <section className="faq-list" aria-label="Frequently asked questions">
        {faqs.map((item, index) => {
          const isOpen = openIndexes.includes(index);
          const answerId = `faq-answer-${index}`;

          return (
            <article className="faq-item" key={index}>
              <div className="faq-item-trigger">
                <button
                  className="faq-item-toggle"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() =>
                    setOpenIndexes((current) =>
                      isOpen
                        ? current.filter((item) => item != index)
                        : [...current, index]
                    )
                  }
                >
                  <span className="faq-item-question">{item.question}</span>
                </button>
                <span className="faq-item-right-controls">
                  {isAdmin ? (
                    <span className="faq-item-admin-actions">
                      <button
                        className="faq-item-admin-button"
                        type="button"
                        onClick={() => handleStartEdit(index)}
                        disabled={isSaving}
                      >
                        Edit
                      </button>
                      <button
                        className="faq-item-admin-button faq-item-admin-button-delete"
                        type="button"
                        onClick={() => handleDelete(index)}
                        disabled={isSaving}
                      >
                        Delete
                      </button>
                    </span>
                  ) : null}
                  <button
                    className="faq-item-icon-button"
                    type="button"
                    aria-label={isOpen ? "Collapse answer" : "Expand answer"}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                    onClick={() =>
                      setOpenIndexes((current) =>
                        isOpen
                          ? current.filter((item) => item != index)
                          : [...current, index]
                      )
                    }
                  >
                    {isOpen ? (
                      <ChevronUp aria-hidden="true" />
                    ) : (
                      <ChevronDown aria-hidden="true" />
                    )}
                  </button>
                </span>
              </div>
              {isOpen ? (
                <div
                  className="faq-item-answer"
                  id={answerId}
                  dangerouslySetInnerHTML={{
                    __html: renderAnswerHtml(item.answer),
                  }}
                />
              ) : null}
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default Faq;
