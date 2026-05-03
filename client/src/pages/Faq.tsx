import React, { useState, useEffect } from "react";
import Collapsible from "../components/Collapsible";

import "../style/faq.css";
import "../style/common.css";

interface Faq {
  question: string;
  answer: string;
}

const Faq = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    fetch("/api/faqs")
      .then((res) => res.json())
      .then((data) => setFaqs(data))
      .catch((err) => console.error("Failed to fetch faqs:", err));
  }, []);

  return (
    <div className="faq-container yellow-bg">
      {/** title */}
      <section className="faq-title">F&nbsp;A&nbsp;Q&nbsp;s</section>
      {/** faq items */}
      <section className="faq-list">
        {faqs.map((item, index) => (
          <Collapsible key={index} title={item.question}>
            {item.answer}
          </Collapsible>
        ))}
      </section>
    </div>
  );
};

export default Faq;
