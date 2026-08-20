import { useState } from "react";

import "../style/common.css";

import { sendContact } from "../api/contactApi";
import kaco from "../images/kaco-title.png";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // TODO: temp comment out, ui is not ready for testing yet
  
  // const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  //   e.preventDefault();

  //   const contactData = {
  //     name: name.trim(),
  //     email: email.trim(),
  //     message: message.trim(),
  //   };

  //   try {
  //     await sendContact(contactData);

  //     setName("");
  //     setEmail("");
  //     setMessage("");
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  return (
    <div className="min-h-screen bg-yellow-light">
      <title>Kiwi Asian Club - Contact</title>

      <section className="section">
        <h1 className="page-title pl-24">Contact Us</h1>

        <div className="flex flex-row items-center px-24 pb-24">
          <img src={kaco} className="w-[34rem] shrink-0 relative z-10 -mr-10" />

          <div className="bg-white rounded-4xl shadow-[8px_8px] shadow-yellow-medium px-16 py-12 flex-1">
            <form
              // onSubmit={handleSubmit} TODO
              className="flex flex-col gap-8 font-alan-sans"
            >
              <p className="text-lg font-bold text-blue-medium text-center pb-4">
                Feel free to let us know any questions you have.
                <br />
                We will get back to you as soon as we can!
              </p>

              <div className="grid grid-cols-2 gap-20">
                <div className="flex flex-col gap-1">
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

                <div className="flex flex-col gap-1">
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

              <div className="flex flex-col gap-1">
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
