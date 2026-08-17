import { getFaqs } from "@/lib/cms";
import { getFaqSchema } from "@/lib/structured-data";
import Icon from "./Icon";

export default async function Faq() {
  const faqs = await getFaqs();
  const faqSchema = getFaqSchema(faqs);

  return (
    <section id="faq">
      {/* Page-specific structured data lives next to the content it
          describes, so it stays in sync if the FAQ list changes. */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="container">
        <div className="section-head">
          <span className="kicker">Common Questions</span>
          <h2>Frequently Asked Questions</h2>
        </div>
        <div className="faq-list">
          {faqs.map((faq) => (
            <details key={faq.question}>
              <summary>
                {faq.question}
                <span className="chev">
                  <Icon name="chevron" size={16} />
                </span>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
