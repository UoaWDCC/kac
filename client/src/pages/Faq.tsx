import React, { useRef, useState} from "react";
import "../style/faq.css";

function AccordionItem({title, children}) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  return (
    <div className = "faq-accordion-item">
      <button 
        className = "faq-accordion-button"
        aria-expanded ={open}
        onClick = {() => setOpen((v) => !v)}
      >
        {title}
        <span className = "faq-accordion-button-text">{open ? "true": "false"}</span>
      </button>

      <div
        ref ={ref}
        className = "faq-accordion-content"
        style = {{
          maxHeight: open && ref.current ? `${ref.current.scrollHeight}px` : "0px",
        }}
        aria-hidden = {!open}
      >
        <div className = "faq-accordion-inner">
          {children}
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
      <AccordionItem title = "question">
        <p> hello </p>
      </AccordionItem>

    </section>
  </div>
  );
};

export default Faq;
