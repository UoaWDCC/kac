import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
/* STEP 2 & 3 IMPORTS COMMENTED OUT FOR NOW
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import api from "../api/index";
*/
import { useAuth } from "../auth/useAuth";
import Header from "../main/Header";
import "../style/common.css";
import "../style/signup.css";

import silhouetteMascot from "../images/kaco-silhouette.png";
import mainMascot from "../images/kaco-title.png";

/* STEP 2 & 3 STRIPE INITIALIZATION COMMENTED OUT FOR NOW
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
*/

const UNIVERSITIES = [
  "The University of Auckland",
  "Auckland University of Technology",
  "None",
  "Other",
];

const FACULTIES = [
  "Arts",
  "Business School",
  "Creative Arts and Industries",
  "Education and Social Work",
  "Engineering",
  "Law",
  "Medical and Health Sciences",
  "Science",
  "Other",
];

const SignUpForm = () => {
  const { user, hasAccount, loading } = useAuth();
  const navigate = useNavigate();

  /* STEP 2 & 3 STRIPE HOOKS COMMENTED OUT FOR NOW
  const stripe = useStripe();
  const elements = useElements();
  */

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    pronouns: "",
    university: "",
    studentId: "",
    upi: "",
    yearOfStudy: "1",
    faculties: [] as string[],
  });

  const [hasSubmittedAttempt, setHasSubmittedAttempt] = useState(false);
  const [invalidFields, setInvalidFields] = useState<Record<string, boolean>>({});
  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const facultyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!user) navigate("/");
      else if (hasAccount) navigate("/");
      else if (user.emails?.[0]?.value) {
        setForm((prev) => ({
          ...prev,
          email: user.emails[0].value,
        }));
      }
    }
  }, [user, hasAccount, loading, navigate]);

  // Click outside to close multi-select faculty dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        facultyDropdownRef.current &&
        !facultyDropdownRef.current.contains(event.target as Node)
      ) {
        setIsFacultyDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (invalidFields[name]) {
      setInvalidFields((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFacultyToggle = (faculty: string) => {
    setForm((prev) => {
      const updated = prev.faculties.includes(faculty)
        ? prev.faculties.filter((f) => f !== faculty)
        : [...prev.faculties, faculty];
      return { ...prev, faculties: updated };
    });
    if (invalidFields.faculties) {
      setInvalidFields((prev) => ({ ...prev, faculties: false }));
    }
  };

  const handleContinueStep1 = (e: React.MouseEvent) => {
    e.preventDefault();

    const missing: Record<string, boolean> = {};
    if (!form.firstName.trim()) missing.firstName = true;
    if (!form.lastName.trim()) missing.lastName = true;
    if (!form.email.trim()) missing.email = true;
    if (!form.mobileNumber.trim()) missing.mobileNumber = true;
    if (!form.pronouns.trim()) missing.pronouns = true;
    if (!form.university.trim()) missing.university = true;
    if (!form.upi.trim()) missing.upi = true;
    if (!form.studentId.trim()) missing.studentId = true;
    if (form.faculties.length === 0) missing.faculties = true;

    setInvalidFields(missing);
    setHasSubmittedAttempt(true);

    if (Object.keys(missing).length > 0) {
      return;
    }

    // Step 1 Validation Passed — proceeds to Step 2 in full implementation
    console.log("Step 1 validation succeeded", form);
  };

  /* STEP 2 & 3 SUBMIT LOGIC COMMENTED OUT FOR NOW
  const handleSubmitFinal = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) return;

    try {
      const { data } = await api.post("/payments/create-payment-intent", {
        type: "membership",
      });

      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardElement } }
      );

      if (stripeError || !paymentIntent || paymentIntent.status !== "succeeded") {
        return;
      }

      await api.post("/users/signup", {
        ...form,
        yearOfStudy: Number(form.yearOfStudy),
        paymentIntentId: paymentIntent.id,
      });

      await refresh();
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };
  */

  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  const hasErrors = hasSubmittedAttempt && Object.keys(invalidFields).length > 0;

  return (
    <div className="signup-page-wrapper">
      <Header />

      <div className="signup-content-container">
        {/* Silhouette mascot positioned -495px left, 107px top */}
        <img
          src={silhouetteMascot}
          alt="KAC Silhouette Mascot"
          className="signup-silhouette-mascot"
        />

        {/* Main Mascot positioned 1142px left, 982px top, rotated 12deg */}
        <img
          src={mainMascot}
          alt="KAC Main Mascot"
          className="signup-title-mascot"
        />

        {/* Hero Title */}
        <div className="signup-hero-side">
          <h1 className="signup-hero-title">
            JOIN THE
            <br />
            KAC FAM
            <br />
            TODAY!
          </h1>
        </div>

        {/* Step 1 Card Form */}
        <div className="signup-card-side">
          <div className="signup-card">
            {/* 3-Step Stepper Header */}
            <div className="signup-stepper">
              <div className="signup-step-item active">
                <div className="signup-step-circle">1</div>
                <span className="signup-step-label">About you</span>
              </div>
              <div className="signup-step-item">
                <div className="signup-step-circle">2</div>
                <span className="signup-step-label">Payment info</span>
              </div>
              <div className="signup-step-item">
                <div className="signup-step-circle">3</div>
                <span className="signup-step-label">Submit</span>
              </div>
            </div>

            {/* Global Error Warning Banner */}
            {hasErrors && (
              <div className="signup-global-error">
                <span className="signup-error-icon-badge">!</span>
                <span>Please fill out all required sections</span>
              </div>
            )}

            {/* Step 1 Form Fields */}
            <div className="signup-form-grid">
              {/* First Name */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">First Name</span>
                    {invalidFields.firstName && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <input
                  type="text"
                  name="firstName"
                  className="signup-input"
                  placeholder="Your first name here"
                  value={form.firstName}
                  onChange={handleChange}
                />
              </div>

              {/* Last Name */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Last Name</span>
                    {invalidFields.lastName && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <input
                  type="text"
                  name="lastName"
                  className="signup-input"
                  placeholder="Your last name here"
                  value={form.lastName}
                  onChange={handleChange}
                />
              </div>

              {/* Email Address */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Email Address</span>
                    {invalidFields.email && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <input
                  type="email"
                  name="email"
                  className="signup-input"
                  placeholder="Your email address here"
                  value={form.email}
                  onChange={handleChange}
                />
              </div>

              {/* Phone Number */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Phone Number</span>
                    {invalidFields.mobileNumber && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <input
                  type="tel"
                  name="mobileNumber"
                  className="signup-input"
                  placeholder="Your phone number here"
                  value={form.mobileNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Pronouns */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Pronouns</span>
                    {invalidFields.pronouns && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <input
                  type="text"
                  name="pronouns"
                  className="signup-input"
                  placeholder="Your pronouns here"
                  value={form.pronouns}
                  onChange={handleChange}
                />
              </div>

              {/* University Dropdown */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">University</span>
                    {invalidFields.university && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <select
                  name="university"
                  className="signup-select"
                  value={form.university}
                  onChange={handleChange}
                >
                  <option value="" disabled>
                    Please select your university
                  </option>
                  {UNIVERSITIES.map((uni) => (
                    <option key={uni} value={uni}>
                      {uni}
                    </option>
                  ))}
                </select>
              </div>

              {/* Student Username / UPI */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Student Username / UPI</span>
                    {invalidFields.upi && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <p className="signup-field-subtext">
                  E.g. UOA UPI Format: abcd123. Enter "N/A" if not applicable
                </p>
                <input
                  type="text"
                  name="upi"
                  className="signup-input"
                  placeholder="Your student username / UPI here"
                  value={form.upi}
                  onChange={handleChange}
                />
              </div>

              {/* Student ID Number */}
              <div className="signup-field-group">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Student ID Number</span>
                    {invalidFields.studentId && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>
                <p className="signup-field-subtext">
                  E.g. 123456789. If not applicable, please enter "N/A"
                </p>
                <input
                  type="text"
                  name="studentId"
                  className="signup-input"
                  placeholder="Your student ID number here"
                  value={form.studentId}
                  onChange={handleChange}
                />
              </div>

              {/* Faculty Dropdown (Multi-Select) */}
              <div className="signup-field-group full-width">
                <div className="signup-field-header">
                  <div className="signup-field-label-wrapper">
                    <span className="signup-field-label">Faculty</span>
                    {invalidFields.faculties && (
                      <span className="signup-field-error-badge">!</span>
                    )}
                  </div>
                  <span className="signup-required-badge">Required</span>
                </div>

                <div
                  className="signup-multi-select-container"
                  ref={facultyDropdownRef}
                >
                  <div
                    className="signup-multi-select-trigger"
                    onClick={() => setIsFacultyDropdownOpen(!isFacultyDropdownOpen)}
                  >
                    {form.faculties.length > 0 ? (
                      <span className="signup-multi-select-values">
                        {form.faculties.join(", ")}
                      </span>
                    ) : (
                      <span className="signup-multi-select-placeholder">
                        Please select your faculty
                      </span>
                    )}
                    <span className="signup-chevron-icon">
                      {isFacultyDropdownOpen ? "▲" : "▼"}
                    </span>
                  </div>

                  {isFacultyDropdownOpen && (
                    <div className="signup-multi-select-dropdown">
                      {FACULTIES.map((faculty) => (
                        <label
                          key={faculty}
                          className="signup-multi-select-option"
                        >
                          <input
                            type="checkbox"
                            checked={form.faculties.includes(faculty)}
                            onChange={() => handleFacultyToggle(faculty)}
                          />
                          <span>{faculty}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="signup-actions">
              <button
                type="button"
                className="signup-continue-btn"
                onClick={handleContinueStep1}
              >
                Continue &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* STEP 2 & 3 STRIPE WRAPPER COMMENTED OUT FOR NOW
const SignUp = () => (
  <Elements stripe={stripePromise}>
    <SignUpForm />
  </Elements>
);
*/

export default SignUpForm;

