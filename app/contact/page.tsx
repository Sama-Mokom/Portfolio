import { ContactForm } from "@/components/contact-form";
import { CONTACT_EMAIL, isContactEndpoint } from "@/lib/contact";
import { pageMetadata } from "@/lib/metadata";
import "../secondary.css";

export const metadata = pageMetadata(
  "Contact",
  "Get in touch about software engineering opportunities, frontend and backend projects, or integration work. Based in Cameroon, WAT / UTC+1.",
  "/contact",
);

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return (
    <div className="container secondary-page contact-page">
      <div className="contact-layout">
        <section className="contact-copy" aria-labelledby="contact-title">
          <p className="eyebrow">Get in touch</p>
          <h1 id="contact-title">
            Let’s build
            <br />
            something great.
          </h1>
          <p className="lead">
            I’m open to internship and graduate opportunities, frontend and
            backend projects, and integration work.
          </p>
          <p>
            If you have a useful problem to solve—or a question about something
            I’ve built—I’d like to hear about it.
          </p>
          <dl className="contact-details">
            <div>
              <dt>
                <span aria-hidden="true">↗</span>Email
              </dt>
              <dd>
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
              </dd>
            </div>
            <div>
              <dt>
                <span aria-hidden="true">⌖</span>Location
              </dt>
              <dd>
                Buea, Cameroon
                <br />
                <span>Currently in Yaoundé for my internship.</span>
              </dd>
            </div>
            <div>
              <dt>
                <span aria-hidden="true">◷</span>Timezone
              </dt>
              <dd>West Africa Time · UTC+1</dd>
            </div>
          </dl>
          <div className="contact-socials">
            <a href="https://github.com/Sama-Mokom">
              GitHub <span aria-hidden="true">↗</span>
            </a>
            <a href="https://www.linkedin.com/in/sama-mokom-784161283">
              LinkedIn <span aria-hidden="true">↗</span>
            </a>
          </div>
        </section>
        <ContactForm
          canSend={isContactEndpoint(process.env.CONTACT_FORM_ENDPOINT)}
          initialStatus={status}
        />
      </div>
    </div>
  );
}
