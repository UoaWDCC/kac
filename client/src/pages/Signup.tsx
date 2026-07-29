import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useAuth } from "../auth/useAuth";
import Header from "../main/Header";
import "../style/common.css";
import "../style/signup.css";

import silhouetteMascot from "../images/kaco-silhouette.png";
import mainMascot from "../images/kaco-title.png";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "");

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

const SIGN_UP_METHODS = [
  "Clubs Expo / O-Week",
  "Social Media / Online",
  "Friend / Word of Mouth",
  "KAC Event",
  "Other",
];

const SignUpForm = () => {
  const { user, hasAccount, loading } = useAuth();
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  const initialEmail = user?.emails?.[0]?.value ?? "";

  // Step 1 State
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: initialEmail,
    mobileNumber: "",
    pronouns: "",
    university: "",
    studentId: "",
    upi: "",
    yearOfStudy: "1",
    faculties: [] as string[],
  });

  // Step 2 State
  const [step2Form, setStep2Form] = useState({
    physicalCard: "",
    signUpMethod: "",
  });

  const [isPaymentInfoOpen, setIsPaymentInfoOpen] = useState(false);

  // Validation States
  const [hasSubmittedStep1, setHasSubmittedStep1] = useState(false);
  const [invalidFieldsStep1, setInvalidFieldsStep1] = useState<Record<string, boolean>>({});

  const [hasSubmittedStep2, setHasSubmittedStep2] = useState(false);
  const [invalidFieldsStep2, setInvalidFieldsStep2] = useState<Record<string, boolean>>({});

  const [isFacultyDropdownOpen, setIsFacultyDropdownOpen] = useState(false);
  const facultyDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading) {
      if (!user || hasAccount) {
        navigate("/");
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
    if (!name) return;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (invalidFieldsStep1[name]) {
      setInvalidFieldsStep1((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleStep2Change = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!name) return;
    setStep2Form((prev) => ({ ...prev, [name]: value }));
    if (invalidFieldsStep2[name]) {
      setInvalidFieldsStep2((prev) => ({ ...prev, [name]: false }));
    }
  };

  const handleFacultyToggle = (faculty: string) => {
    setForm((prev) => {
      const currentFaculties = prev.faculties || [];
      const updated = currentFaculties.includes(faculty)
        ? currentFaculties.filter((f) => f !== faculty)
        : [...currentFaculties, faculty];
      return { ...prev, faculties: updated };
    });
    if (invalidFieldsStep1.faculties) {
      setInvalidFieldsStep1((prev) => ({ ...prev, faculties: false }));
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

    setInvalidFieldsStep1(missing);
    setHasSubmittedStep1(true);

    if (Object.keys(missing).length > 0) {
      return;
    }

    // Step 1 Passed -> Proceed to Step 2
    setCurrentStep(2);
  };

  const handleContinueStep2 = (e: React.MouseEvent) => {
    e.preventDefault();

    const missing: Record<string, boolean> = {};
    if (!step2Form.physicalCard) missing.physicalCard = true;
    if (!step2Form.signUpMethod) missing.signUpMethod = true;

    setInvalidFieldsStep2(missing);
    setHasSubmittedStep2(true);

    if (Object.keys(missing).length > 0) {
      return;
    }

    if (!stripe || !elements) {
      console.warn("Stripe or elements not loaded yet");
    }

    // If payment info section is not opened, auto-open it
    if (!isPaymentInfoOpen) {
      setIsPaymentInfoOpen(true);
    }

    // Step 2 Validation Passed -> Proceed to Step 3 in future
    console.log("Step 2 validation succeeded", { form, step2Form });
  };


  if (loading) return <p style={{ padding: "2rem" }}>Loading...</p>;

  const hasStep1Errors = hasSubmittedStep1 && Object.keys(invalidFieldsStep1).length > 0;
  const hasStep2Errors = hasSubmittedStep2 && Object.keys(invalidFieldsStep2).length > 0;

  const stripeElementOptions = {
    style: {
      base: {
        fontSize: "15px",
        fontFamily: "'Alan Sans', sans-serif",
        color: "#2d3748",
        "::placeholder": {
          color: "#a0aec0",
        },
      },
      invalid: {
        color: "#e53e3e",
      },
    },
  };

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

        {/* Card Form */}
        <div className="signup-card-side">
          <div className="signup-card">
            {/* Back button for Step 2 & 3 */}
            {currentStep > 1 && (
              <button
                type="button"
                className="signup-back-btn"
                onClick={() => setCurrentStep((prev) => (prev - 1) as 1 | 2)}
              >
                &lt; Back
              </button>
            )}

            {/* 3-Step Stepper Header */}
            <div className="signup-stepper">
              <div className={`signup-step-item ${currentStep === 1 ? "active" : ""}`}>
                <div className="signup-step-circle">1</div>
                <span className="signup-step-label">About you</span>
              </div>
              <div className={`signup-step-item ${currentStep === 2 ? "active" : ""}`}>
                <div className="signup-step-circle">2</div>
                <span className="signup-step-label">Payment info</span>
              </div>
              <div className={`signup-step-item ${currentStep === 3 ? "active" : ""}`}>
                <div className="signup-step-circle">3</div>
                <span className="signup-step-label">Submit</span>
              </div>
            </div>

            {/* Global Error Warning Banner */}
            {((currentStep === 1 && hasStep1Errors) || (currentStep === 2 && hasStep2Errors)) && (
              <div className="signup-global-error">
                <span className="signup-error-icon-badge">!</span>
                <span>Please fill out all required sections</span>
              </div>
            )}

            {/* STEP 1 VIEW */}
            {currentStep === 1 && (
              <>
                <div className="signup-form-grid">
                  {/* First Name */}
                  <div className="signup-field-group">
                    <div className="signup-field-header">
                      <div className="signup-field-label-wrapper">
                        <span className="signup-field-label">First Name</span>
                        {invalidFieldsStep1.firstName && (
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
                        {invalidFieldsStep1.lastName && (
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
                        {invalidFieldsStep1.email && (
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
                      value={form.email || initialEmail}
                      onChange={handleChange}
                    />

                  </div>

                  {/* Phone Number */}
                  <div className="signup-field-group">
                    <div className="signup-field-header">
                      <div className="signup-field-label-wrapper">
                        <span className="signup-field-label">Phone Number</span>
                        {invalidFieldsStep1.mobileNumber && (
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
                        {invalidFieldsStep1.pronouns && (
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
                        {invalidFieldsStep1.university && (
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
                        {invalidFieldsStep1.upi && (
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
                        {invalidFieldsStep1.studentId && (
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
                        {invalidFieldsStep1.faculties && (
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

                <div className="signup-actions">
                  <button
                    type="button"
                    className="signup-continue-btn"
                    onClick={handleContinueStep1}
                  >
                    Continue &gt;
                  </button>
                </div>
              </>
            )}

            {/* STEP 2 VIEW */}
            {currentStep === 2 && (
              <>
                <div className="signup-form-grid">
                  {/* Physical KAC Card */}
                  <div className="signup-field-group">
                    <div className="signup-field-header">
                      <div className="signup-field-label-wrapper">
                        <span className="signup-field-label">Physical KAC Card</span>
                        {invalidFieldsStep2.physicalCard && (
                          <span className="signup-field-error-badge">!</span>
                        )}
                      </div>
                      <span className="signup-required-badge">Required</span>
                    </div>
                    <p className="signup-field-subtext">
                      Do you already have a physcial KAC card?
                    </p>
                    <select
                      name="physicalCard"
                      className="signup-select"
                      value={step2Form.physicalCard}
                      onChange={handleStep2Change}
                    >
                      <option value="" disabled>
                        Please select yes or no
                      </option>
                      <option value="Yes">Yes</option>
                      <option value="No">No</option>
                    </select>
                  </div>

                  {/* Sign Up Method */}
                  <div className="signup-field-group">
                    <div className="signup-field-header">
                      <div className="signup-field-label-wrapper">
                        <span className="signup-field-label">Sign Up Method</span>
                        {invalidFieldsStep2.signUpMethod && (
                          <span className="signup-field-error-badge">!</span>
                        )}
                      </div>
                      <span className="signup-required-badge">Required</span>
                    </div>
                    <p className="signup-field-subtext">
                      How did you sign up to KAC?
                    </p>
                    <select
                      name="signUpMethod"
                      className="signup-select"
                      value={step2Form.signUpMethod}
                      onChange={handleStep2Change}
                    >
                      <option value="" disabled>
                        Please select what fits best
                      </option>
                      {SIGN_UP_METHODS.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Payment Information Section */}
                  <div className="signup-field-group full-width">
                    <div className="signup-field-header">
                      <div className="signup-field-label-wrapper">
                        <span className="signup-field-label">Payment Information</span>
                      </div>
                      <span className="signup-required-badge">Required</span>
                    </div>

                    <div
                      className="signup-accordion-trigger"
                      onClick={() => setIsPaymentInfoOpen(!isPaymentInfoOpen)}
                    >
                      <span>Please enter your card details</span>
                      <span className="signup-chevron-icon">
                        {isPaymentInfoOpen ? "▲" : "▼"}
                      </span>
                    </div>

                    {isPaymentInfoOpen && (
                      <div className="signup-card-details-box">
                        {/* Card Number */}
                        <div className="signup-field-group">
                          <span className="signup-field-label">Card Number</span>
                          <div className="signup-stripe-element-wrapper">
                            <CardNumberElement options={stripeElementOptions} />
                          </div>
                        </div>

                        {/* Expiry Date & CVC / CVV */}
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
                      </div>
                    )}

                    <div className="signup-total-text">Total: $5.00</div>
                  </div>
                </div>

                <div className="signup-actions">
                  <button
                    type="button"
                    className="signup-continue-btn"
                    onClick={handleContinueStep2}
                  >
                    Continue &gt;
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUp = () => (
  <Elements stripe={stripePromise}>
    <SignUpForm />
  </Elements>
);

export default SignUp;

