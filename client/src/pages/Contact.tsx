import { useState } from "react";

const Contact = () => {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const contactData = {
      name,
      email,
      message,
    };

    const existing = localStorage.getItem("contactus")
    const contacts = existing ? JSON.parse(existing) : [];

    contacts.push(contactData);

    localStorage.setItem("contactus", JSON.stringify(contacts));

    console.log("Saved: ", contactData);

    setSubmitted(true)

    setName("");
    setEmail("");
    setMessage("");
  };

  return (
    <div>
      <h1 style = {{ textAlign: "center" }}>Contact Us</h1>
    
      <p style = {{ textAlign: "center" }}>
        intro blurb
      </p>

      {submitted ? (
        <h2 style = {{ textAlign: "center", color: "gold" }}>Submitted!</h2>
      ) : (
        <form onSubmit = {handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type = "text"
              value = {name}
              onChange = {(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label>Email:</label>
            <input
              type = "text"
              value = {email}
              onChange = {(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label>Message:</label>
            <input
              type = "text"
              value = {message}
              onChange = {(e) => setMessage(e.target.value)}
            />
          </div>

          <button type = "submit">Submit</button>
        </form>
      )}
    </div>
  );
};

export default Contact;
