import React, { useState, useEffect } from "react";
import Collapsible from "../components/Collapsible";
import api from "../api";

import "../style/faq.css";
import "../style/common.css";
import { getContent } from "../api/contentApi";

interface Faq {
  question: string;
  answer: string;
}

function parseFaq(content: string): Faq[] {
  const lines = content.split("\n");
  const faqs: Faq[] = [];
  let current: Faq | null = null;

  for (const line of lines) {
    if (line.startsWith("#")) {
      if (current) faqs.push(current);
      current = { question: line.slice(1).trim(), answer: "" };
    } else if (current) {
      current.answer += (current.answer ? "\n" : "") + line;
    } else {
      // We've found an answer line without a question
      // This is unexpected, but we'll try to handle it gracefully
      current = { question: "Untitled Question", answer: line };
    }
  }

  if (current) faqs.push(current);
  return faqs;
}

const Faq = () => {
  const [faqs, setFaqs] = useState<Faq[]>([]);

  useEffect(() => {
    getContent("faqs").then((data) => {
      const parsedFaqs = parseFaq(data.content);
      setFaqs(parsedFaqs);
    });
  }, []);

  return (
    <div className="faq-container bg-yellow-light">
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
