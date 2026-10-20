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
        <h1 className="page-title !mb-4 lg:!mb-6 lg:pl-[clamp(1rem,4vw,6rem)]">
          Contact Us
        </h1>

        <div className="flex flex-col items-center pb-12 lg:flex-row lg:pl-[clamp(1rem,4vw,6rem)] lg:pr-[clamp(1rem,6vw,9rem)] lg:pb-24">
          <img
            src={kaco}
            alt="KAC Mascot"
            className="w-[82%] max-w-[22rem] shrink-0 relative z-0 -mb-25 lg:w-[clamp(17rem,34vw,37rem)] lg:max-w-none lg:mb-0 lg:z-10 lg:-mr-[clamp(1rem,2.5vw,2.5rem)]"
          />

          <div className="relative z-10 bg-white rounded-2xl px-10 py-8 shadow-[8px_8px] shadow-yellow-medium lg:px-[clamp(1.5rem,3.5vw,4rem)] lg:py-12 flex-1 grid lg:rounded-4xl lg:z-0">
            <div
              className={`col-start-1 row-start-1 font-alan-sans flex flex-col items-center justify-center gap-8 lg:gap-16 ${
                status === "sent" ? "" : "invisible pointer-events-none"
              }`}
            >
              <p className="!text-base lg:!text-lg font-bold text-blue-medium text-center text-balance">
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
              className={`col-start-1 row-start-1 flex flex-col gap-8 font-alan-sans lg:gap-10 ${
                status === "sent" ? "invisible pointer-events-none" : ""
              }`}
            >
              <p className="!text-base lg:!text-lg font-bold text-blue-medium text-center text-balance lg:pb-4">
                Feel free to let us know any questions you have.
                <br />
                We will get back to you as soon as we can!
              </p>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-[clamp(1.5rem,4vw,5rem)]">
                <div className="flex flex-col">
                  <div className="contact-field-header">
                    <label
                      htmlFor="contact-name"
                      className="!text-base lg:!text-lg font-bold"
                    >
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
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="contact-field-header">
                    <label
                      htmlFor="contact-email"
                      className="text-base font-bold lg:text-lg"
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
                    placeholder="Email Here"
                    className="contact-underline-input"
                    autoComplete="email"
                    inputMode="email"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="contact-field-header">
                  <label
                    htmlFor="contact-message"
                    className="text-base font-bold lg:text-lg"
                  >
                    Your Message
                  </label>
                  <span className="contact-required-chip">Required</span>
                </div>
                <div className="contact-underline-input contact-textarea-shell">
                  <textarea
                    id="contact-message"
                    required
                    rows={1}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your message"
                  />
                </div>
              </div>

              <div className="flex flex-col items-center">
                <p
                  id="contact-error"
                  className="form-error mb-1 lg:mb-4"
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
