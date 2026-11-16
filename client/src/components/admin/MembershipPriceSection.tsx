import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { DollarSign } from "lucide-react";
import {
  getMembershipPrice,
  updateMembershipPrice,
} from "../../api/membershipPriceApi";
import { formatMembershipPrice } from "../../util/membership";

const inputClass =
  "h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-950 outline-none transition focus:border-blue-medium focus:ring-2 focus:ring-yellow-dark/40 disabled:cursor-not-allowed disabled:bg-slate-50";

const primaryButtonClass = "admin-modal-save-button";

const getErrorMessage = (error: unknown) => {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  return "Something went wrong.";
};

const dollarsToCents = (value: string): number | null => {
  const trimmed = value.trim();

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) return null;

  const [dollars, cents = ""] = trimmed.split(".");
  const amountCents = Number(dollars) * 100 + Number(cents.padEnd(2, "0"));

  return Number.isSafeInteger(amountCents) && amountCents > 0
    ? amountCents
    : null;
};

export default function MembershipPriceSection() {
  const [amountCents, setAmountCents] = useState<number | null>(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;

    getMembershipPrice()
      .then((price) => {
        if (!active) return;
        setAmountCents(price.amountCents);
        setDraft((price.amountCents / 100).toFixed(2));
      })
      .catch((requestError: unknown) => {
        if (active) setError(getErrorMessage(requestError));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isConfirming) return;

    const resetConfirmation = (event: Event) => {
      if (
        event.target instanceof Node &&
        !submitButtonRef.current?.contains(event.target)
      ) {
        setIsConfirming(false);
      }
    };

    document.addEventListener("pointerdown", resetConfirmation);
    document.addEventListener("focusin", resetConfirmation);

    return () => {
      document.removeEventListener("pointerdown", resetConfirmation);
      document.removeEventListener("focusin", resetConfirmation);
    };
  }, [isConfirming]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextAmountCents = dollarsToCents(draft);

    if (nextAmountCents === null) {
      setError(
        "Enter a dollar amount greater than zero with up to 2 decimals."
      );
      return;
    }

    setError(null);

    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    setIsSaving(true);

    try {
      const price = await updateMembershipPrice(nextAmountCents);
      setAmountCents(price.amountCents);
      setDraft((price.amountCents / 100).toFixed(2));
      setIsConfirming(false);
      toast.success("Membership price updated.");
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
          <DollarSign aria-hidden="true" className="h-6 w-6" />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-slate-500">
            Current price
          </p>
          <p className="mt-1 text-3xl font-bold leading-none text-slate-950">
            {isLoading && amountCents === null
              ? "Loading…"
              : amountCents === null
                ? "—"
                : formatMembershipPrice(amountCents)}
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
            htmlFor="membership-price"
          >
            New membership price (NZD)
          </label>

          <div className="relative">
            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500">
              $
            </span>
            <input
              className={`${inputClass} pl-7`}
              disabled={isLoading || isSaving}
              id="membership-price"
              inputMode="decimal"
              onChange={(event) => {
                setDraft(event.target.value);
                setIsConfirming(false);
                setError(null);
              }}
              placeholder="5.00"
              value={draft}
            />
          </div>
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
            className={primaryButtonClass}
            disabled={isLoading || isSaving}
            ref={submitButtonRef}
            type="submit"
          >
            {isSaving ? "Updating…" : isConfirming ? "Confirm?" : "Submit"}
          </button>
        </div>
      </form>
    </section>
  );
}
