import { useState } from "react";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

import "../style/common.css";
import "../style/contact.css";

import { sendContact } from "../api/contactApi";
import { useAuth } from "../auth/useAuth";
import kaco from "../images/kaco-title.png";

/**
  Contact Page
 
  Four mutually exclusive view states for the Contact Us card UI:
    idle    - empty form
    sending - form stays visible, submit button spins and locks/disables
    error   - form stays visible with the message preserved, banner above button
    sent    - form is swapped for the confirmation panel
*/

type Status = "idle" | "sending" | "sent" | "error";

const Contact = () => {
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setSubmitError] = useState<string | null>(null);

  const contactName = name || user?.displayName || "";
  const contactEmail = email || user?.emails?.[0]?.value || "";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "sending") return;

    const contactData = {
      name: contactName.trim(),
      email: contactEmail.trim(),
      message: message.trim(),
    };

    if (!contactData.name || !contactData.email || !contactData.message) {
      setSubmitError("Please fill in every field before sending.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setSubmitError(null);

    try {
      await sendContact(contactData);

      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch (error) {
      console.error(error);

      // api/index.ts rejects with a plain string, not an Error object.
      setSubmitError(
        typeof error === "string"
          ? error
          : "We couldn't send your message. Please try again."
      );
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-yellow-light">
      <title>Kiwi Asian Club - Contact</title>

      <section className="section">
        <h1 className="page-title pl-24">Contact Us</h1>

        <div className="flex flex-row items-center pl-24 pr-36 pb-24">
          <img
            src={kaco}
            alt="KAC Mascot"
            className="w-[34rem] shrink-0 relative z-10 -mr-10"
          />

          <div className="bg-white rounded-4xl shadow-[8px_8px] shadow-yellow-medium px-16 py-12 flex-1 grid">
            <div
              className={`col-start-1 row-start-1 font-alan-sans flex flex-col items-center justify-center gap-16 ${
                status === "sent" ? "" : "invisible pointer-events-none"
              }`}
            >
              <p className="text-lg font-bold text-blue-medium text-center">
                Thank you for getting in touch with us!
                <br />
                Our team will get back to you as soon as we can.
              </p>
              <Link to="/" className="pill-button">
                Back Home &gt;
              </Link>
            </div>

            <form
              onSubmit={handleSubmit}
              className={`col-start-1 row-start-1 flex flex-col gap-10 font-alan-sans ${
                status === "sent" ? "invisible pointer-events-none" : ""
              }`}
            >
              <p className="text-lg font-bold text-blue-medium text-center pb-4">
                Feel free to let us know any questions you have.
                <br />
                We will get back to you as soon as we can!
              </p>

              <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col">
                  <div className="contact-field-header">
                    <label htmlFor="contact-name" className="text-lg font-bold">
                      Your Name
                    </label>
                    <span className="contact-required-chip">Required</span>
                  </div>
                  <input
                    type="text"
                    id="contact-name"
                    required
                    value={contactName}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name Here"
                    className="contact-underline-input"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="contact-field-header">
                    <label
                      htmlFor="contact-email"
                      className="text-lg font-bold"
                    >
                      Email Address
                    </label>
                    <span className="contact-required-chip">Required</span>
                  </div>
                  <input
                    type="email"
                    id="contact-email"
                    required
                    value={contactEmail}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Here"
                    className="contact-underline-input"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="contact-field-header">
                  <label
                    htmlFor="contact-message"
                    className="text-lg font-bold"
                  >
                    Your Message
                  </label>
                  <span className="contact-required-chip">Required</span>
                </div>
                <textarea
                  id="contact-message"
                  required
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className="contact-underline-input"
                />
              </div>

              <div className="flex flex-col items-center">
                <p
                  id="contact-error"
                  className="form-error mb-4"
                  aria-live="polite"
                >
                  {error}
                </p>

                <button
                  type="submit"
                  disabled={status === "sending"}
                  className="pill-button"
                >
                  {status === "sending" ? (
                    <span className="flex gap-2 items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span>Submit &gt;</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
