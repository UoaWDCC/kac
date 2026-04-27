import Collapsible from "../components/Collapsible";

import "../style/faq.css";
import "../style/common.css"
import faqs from "../placeholders/faqs.json";

const Faq = () => {
  return (
  <div className="faq-container yellow-bg">
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
        <Collapsible key={index} title={item.question}>
          {item.answer}
        </Collapsible>
      ))}

    </section>
  </div>
  );
};

export default Faq;
