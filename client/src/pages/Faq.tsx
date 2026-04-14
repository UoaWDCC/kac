import React, {useState} from "react";
import "../style/faq.css";
import faqs from "../api/faqs.json";

function AccordionItem({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className = "faq-accordion-item">
      <button 
        className = "faq-accordion-button"
        aria-expanded ={open}
        onClick = {() => setOpen((v) => !v)}
      >
        {title}
        <span className={`faq-accordion-button-state${open ? " open" : ""}`} aria-hidden="true">
          ⌵
        </span>
      </button>

      <div
        className = "faq-accordion-content"
        aria-hidden = {!open}
      >
        <div
          className = {`faq-accordion-content${open ? " open" : ""}`}
        >
          <div className="faq-accordion-inner">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

const Faq = () => {
  return (
  <div className="faq-container">
    {/** title */}
    <section
      className="faq-title"
    >
      F&nbsp;A&nbsp;Q&nbsp;s
    </section>

    {/** faq items */}
    <section
    className = "faq-list"
    >
      {faqs.map((item, index) => (
        <AccordionItem key = {index} title = {item.question}>
          {item.answer}
        </AccordionItem>
      ))}

    </section>
  </div>
  );
};

export default Faq;
