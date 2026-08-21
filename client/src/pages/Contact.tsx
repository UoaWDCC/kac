import { useState } from "react";

import "../style/common.css";

import { sendContact } from "../api/contactApi";
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
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const isSending = status === "sending";

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSending) return;

    const contactData = {
      name: name.trim(),
      email: email.trim(),
      message: message.trim(),
    };

    if (!contactData.name || !contactData.email || !contactData.message) {
      setError("Please fill in every field before sending.");
      setStatus("error");
      return;
    }

    setStatus("sending");
    setError(null);

    try {
      await sendContact(contactData);

      setName("");
      setEmail("");
      setMessage("");
      setStatus("sent");
    } catch (error) {
      console.error(error);

      // api/index.ts rejects with a plain string, not an Error object.
      setError(
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
          <img src={kaco} className="w-[34rem] shrink-0 relative z-10 -mr-10" />

          <div className="bg-white rounded-4xl shadow-[8px_8px] shadow-yellow-medium px-16 py-12 flex-1">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-10 font-alan-sans"
            >
              <p className="text-lg font-bold text-blue-medium text-center pb-4">
                Feel free to let us know any questions you have.
                <br />
                We will get back to you as soon as we can!
              </p>

              <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col">
                  <div className="field-header">
                    <label htmlFor="contact-name" className="text-lg font-bold">
                      Your Name
                    </label>
                    <span className="required-chip">Required</span>
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name Here"
                    className="underline-input"
                  />
                </div>

                <div className="flex flex-col">
                  <div className="field-header">
                    <label
                      htmlFor="contact-email"
                      className="text-lg font-bold"
                    >
                      Email Address
                    </label>
                    <span className="required-chip">Required</span>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Here"
                    className="underline-input"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <div className="field-header">
                  <label
                    htmlFor="contact-message"
                    className="text-lg font-bold"
                  >
                    Your Message
                  </label>
                  <span className="required-chip">Required</span>
                </div>
                <textarea
                  rows={1}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message"
                  className="underline-input"
                />
              </div>

              <div className="flex justify-center mt-4">
                <button type="submit" className="pill-button">
                  Submit &gt;
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
