import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { renewCurrentMembership } from "../api/usersApi";
import { useAuth } from "../auth/useAuth";
import { getMembershipYear } from "../util/membership";
import "../style/common.css";
import "../style/signup.css";
import "../style/renew.css";

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

  const membershipYear = getMembershipYear();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardNumberElement = elements.getElement(CardNumberElement);
    if (!cardNumberElement) {
      setError("Card details are not ready yet. Please try again.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
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

      // The server re-reads the intent from Stripe before granting the year, so
      // this cannot be forged. The Stripe webhook also applies the renewal, as a
      // backstop for anyone who closes the tab before this call lands.
      await renewCurrentMembership(paymentIntent.id);
      await refresh();
      navigate("/profile");
    } catch (err) {
      console.error("Membership renewal failed:", err);
      setError(
        typeof err === "string"
          ? err
          : "Your payment went through but we could not update your membership. Please contact us."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="narrow-content renew-page">Loading...</p>;
  }

  if (role === "member" || role === "admin") {
    return (
      <div className="narrow-content renew-page">
        <h1 className="renew-title">You&apos;re all set</h1>
        <p className="renew-intro font-alan-sans">
          Your {membershipYear} membership is already active.
        </p>
      </div>
    );
  }

  // Renewal is only for people who already have an account. A guest has nothing
  // to renew, and create-payment-intent would 401 on them anyway.
  if (role === "guest") {
    return (
      <div className="narrow-content renew-page">
        <h1 className="renew-title">Sign in to renew</h1>
        <p className="renew-intro font-alan-sans">
          Renewing is for existing members. If you haven&apos;t joined yet, sign
          up for a {membershipYear} membership.
        </p>
        <div className="mt-8 text-right">
          <a className="button" href="/api/auth/google">
            Sign in
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="narrow-content renew-page">
      <h1 className="renew-title">Renew your membership</h1>
      <p className="renew-intro font-alan-sans">
        Your membership has expired. Renew for {membershipYear} to keep your
        sponsor discounts and member access to events.
      </p>

      <form onSubmit={handleSubmit}>
        <h2 className="renew-section-title">Payment</h2>
        <p className="renew-section-hint font-alan-sans">
          Need to change your details? Update them on your{" "}
          <Link to="/profile">profile</Link>.
        </p>

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

        <div className="renew-total">Total: $5.00</div>

        {error && (
          <p className="renew-error" role="alert">
            {error}
          </p>
        )}

        <div className="signup-actions">
          <button
            className="signup-continue-btn"
            disabled={!stripe || submitting}
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
