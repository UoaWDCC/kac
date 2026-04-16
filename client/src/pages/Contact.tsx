import { useState } from "react";
import "../style/common.css";
import "../style/contact.css";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
    };

    console.log("Saved: ", contactData);

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div className="contact-page">
      <h1 className="contact-title">CONTACT US</h1>

      <p className="contact-intro">
        Sign up using the form below or let us know any questions you have!
      </p>

      <form className="contact-form" onSubmit={handleSubmit}>
        <div>
          <input
            type="text"
            value={name}
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <input
            type="text"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <textarea
            value={message}
            placeholder="Write your message"
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>

        <button className="contact-button" type="submit">
          Send
        </button>
      </form>
    </div>
  );
};

export default Contact;
