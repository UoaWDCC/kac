import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";

import api from "../api";
import { fetchCurrentMember, updateCurrentMember } from "../api/usersApi";
import { useAuth } from "../auth/useAuth";
import {
  getMemberInputProps,
  normalizeMemberProfile,
  getMemberValidationErrors,
} from "../util/memberValidation";
import { getMembershipYear } from "../util/membership";
import "../style/common.css";
import "../style/signup.css";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? ""
);

const stripeElementOptions = {
  style: {
    base: {
      fontSize: "15px",
      fontFamily: "'Alan Sans', sans-serif",
      color: "#2d3748",
      "::placeholder": { color: "#a0aec0" },
    },
    invalid: { color: "#e53e3e" },
  },
};

const RenewForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { role, loading, refresh } = useAuth();

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobileNumber: "",
    pronouns: "",
    university: "",
    studentId: "",
    upi: "",
    yearOfStudy: "",
  });

  // Renewal is annual, so details drift - year of study in particular. Prefill
  // what we have and let them correct it on the way through.
  useEffect(() => {
    let active = true;

    fetchCurrentMember()
      .then((member) => {
        if (!active || !member) return;
        setForm({
          firstName: member.firstName ?? "",
          lastName: member.lastName ?? "",
          mobileNumber: member.mobileNumber ?? "",
          pronouns: member.pronouns ?? "",
          university: member.university ?? "",
          studentId: member.studentId ?? "",
          upi: member.upi ?? "",
          yearOfStudy:
            member.yearOfStudy === null || member.yearOfStudy === undefined
              ? ""
              : String(member.yearOfStudy),
        });
      })
      .catch(() => {
        // Not fatal - they can still renew, the fields just start empty.
      })
      .finally(() => {
        if (active) setProfileLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));

  const membershipYear = getMembershipYear();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card details are not ready yet. Please try again.");
      return;
    }

    const normalizedForm = normalizeMemberProfile(form);
    const validationErrors = getMemberValidationErrors(normalizedForm, {
      requireYearOfStudy: true,
    });

    if (validationErrors.length > 0) {
      setError(validationErrors.join(" "));
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      // Save details first - if this fails we have not taken their money yet.
      await updateCurrentMember({
        faculties: undefined,
        firstName: normalizedForm.firstName,
        lastName: normalizedForm.lastName,
        mobileNumber: normalizedForm.mobileNumber,
        pronouns: normalizedForm.pronouns,
        studentId: normalizedForm.studentId,
        university: normalizedForm.university,
        upi: normalizedForm.upi,
        yearOfStudy: Number(normalizedForm.yearOfStudy || 1),
      });

      // Same intent the signup flow uses - the server stamps the googleUid into
      // the PaymentIntent metadata, and the Stripe webhook rolls the membership
      // year forward once the payment settles.
      const { data } = await api.post("/payments/create-payment-intent", {
        type: "membership",
      });

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(data.clientSecret, {
          payment_method: { card: cardNumberElement },
        });

      if (stripeError) {
        setError(stripeError.message ?? "Payment failed. Please try again.");
        return;
      }

      if (!paymentIntent || paymentIntent.status !== "succeeded") {
        setError("Payment has not been completed yet.");
        return;
      }

      // The webhook does the write, so re-read the session to pick up the new
      // role rather than assuming it locally.
      await refresh();
      navigate("/profile");
    } catch (err) {
      console.error("Membership renewal failed:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="narrow-content">Loading...</p>;
  }

  if (role === "member" || role === "admin") {
    return (
      <div className="narrow-content" style={{ padding: "4rem 2rem" }}>
        <h2>You're all set</h2>
        <p>Your {membershipYear} membership is already active.</p>
      </div>
    );
  }

  // Renewal is only for people who already have an account. A guest has nothing
  // to renew, and create-payment-intent would 401 on them anyway.
  if (role === "guest") {
    return (
      <div className="narrow-content" style={{ padding: "4rem 2rem" }}>
        <h2>Sign in to renew</h2>
        <p className="font-alan-sans">
          Renewing is for existing members. If you haven't joined yet, sign up
          for a {membershipYear} membership.
        </p>
        {/* The anchor is inline, so it sits flush against the paragraph with no
            gap of its own - the wrapper supplies the spacing and alignment. */}
        <div className="mt-8 text-right">
          <a className="button" href="/api/auth/google">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="narrow-content" style={{ padding: "4rem 2rem" }}>
      <h2>Renew your membership</h2>
      <p className="font-alan-sans">
        Your membership has expired. Renew for {membershipYear} to keep your
        sponsor discounts and member access to events.
      </p>

      <form onSubmit={handleSubmit}>
        <h3>Your details</h3>
        <p className="font-alan-sans">
          Check these are still right — year of study in particular.
        </p>

        <div className="signup-form-grid">
          {(
            [
              ["firstName", "First Name"],
              ["lastName", "Last Name"],
              ["mobileNumber", "Mobile Number"],
              ["pronouns", "Pronouns"],
              ["university", "University"],
              ["yearOfStudy", "Year of Study"],
              ["studentId", "Student ID"],
              ["upi", "UPI"],
            ] as const
          ).map(([field, label]) => (
            <div className="signup-field-group" key={field}>
              <span className="signup-field-label">{label}</span>
              <input
                className="signup-input"
                disabled={profileLoading}
                onChange={(event) => updateField(field, event.target.value)}
                value={form[field]}
                {...getMemberInputProps(field)}
              />
            </div>
          ))}
        </div>

        <h3>Payment</h3>

        <div className="signup-field-group">
          <span className="signup-field-label">Card Number</span>
          <div className="signup-stripe-element-wrapper">
            <CardNumberElement options={stripeElementOptions} />
          </div>
        </div>

        <div className="signup-form-grid">
          <div className="signup-field-group">
            <span className="signup-field-label">Expiry Date</span>
            <div className="signup-stripe-element-wrapper">
              <CardExpiryElement options={stripeElementOptions} />
            </div>
          </div>

          <div className="signup-field-group">
            <span className="signup-field-label">CVC / CVV</span>
            <div className="signup-stripe-element-wrapper">
              <CardCvcElement options={stripeElementOptions} />
            </div>
          </div>
        </div>

        <div className="signup-total-text">Total: $5.00</div>

        {error && (
          <p role="alert" style={{ color: "#e53e3e" }}>
            {error}
          </p>
        )}

        <div className="signup-actions">
          <button
            className="signup-continue-btn"
            disabled={!stripe || submitting || profileLoading}
            // about.css sets an unlayered `button { width: 100% }` that beats
            // .signup-continue-btn, which declares no width - without this the
            // pill stretches the full container.
            style={{ width: "auto" }}
            type="submit"
          >
            {submitting ? "Processing..." : `Renew for ${membershipYear}`}
          </button>
        </div>
      </form>
    </div>
  );
};

const RenewMembership = () => (
  <Elements stripe={stripePromise}>
    <RenewForm />
  </Elements>
);

export default RenewMembership;
