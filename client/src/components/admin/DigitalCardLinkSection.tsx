import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link2 } from "lucide-react";
import { getContent, updateContent } from "../../api/contentApi";
import { DIGITAL_CARD_LINK_CONTENT_ID } from "../../constants/content";

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40 disabled:cursor-not-allowed disabled:bg-slate-50";

const submitButtonClass = "admin-modal-save-button";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

const isValidLink = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export default function DigitalCardLinkSection() {
  const [link, setLink] = useState("");
  const [savedLink, setSavedLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    getContent(DIGITAL_CARD_LINK_CONTENT_ID)
      .then((content) => {
        if (!active) return;
        const currentLink =
          typeof content?.content === "string" ? content.content : "";
        setLink(currentLink);
        setSavedLink(currentLink || null);
      })
      .catch((requestError: unknown) => {
        if (active && requestError !== "Content not found") {
          setError(getErrorMessage(requestError));
        }
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextLink = link.trim();

    if (!isValidLink(nextLink)) {
      setError("Enter a valid http or https link.");
      return;
    }

    setError(null);
    setIsSaving(true);

    try {
      await updateContent(DIGITAL_CARD_LINK_CONTENT_ID, nextLink);
      setLink(nextLink);
      setSavedLink(nextLink);
      toast.success("Digital card link updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
      <div className="flex min-w-0 items-start gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-md bg-yellow-light text-blue-medium ring-1 ring-yellow-dark/40">
          <Link2 aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
            Current link
          </p>
          <p className="mt-1 min-w-0 break-all text-sm font-semibold text-slate-950">
            {isLoading ? (
              "Loading…"
            ) : savedLink ? (
              <a
                className="text-blue-medium underline underline-offset-2"
                href={savedLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                {savedLink}
              </a>
            ) : (
              "No link set"
            )}
          </p>
        </div>
      </div>

      <form
        className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        <div className="grid gap-2">
          <label
            className="text-sm font-semibold text-slate-700"
            htmlFor="digital-card-link"
          >
            Digital card link
          </label>
          <input
            className={inputClass}
            disabled={isLoading || isSaving}
            id="digital-card-link"
            onChange={(event) => {
              setLink(event.target.value);
              setError(null);
            }}
            placeholder="https://example.com/digital-card"
            type="url"
            value={link}
          />
        </div>

        {error ? (
          <p
            className="!m-0 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <div>
          <button
            className={submitButtonClass}
            disabled={isLoading || isSaving}
            type="submit"
          >
            {isSaving ? "Saving…" : "Save link"}
          </button>
        </div>
      </form>
    </section>
  );
}
