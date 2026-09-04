import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SiteHeader from '../SiteHeader';

export const metadata: Metadata = {
  title: 'Credibility | Anthony Rosenberger',
  description:
    'Academic achievement, founder experience, and the lessons behind Anthony Rosenberger’s work.',
  alternates: {
    canonical: '/credibility',
  },
  openGraph: {
    title: 'Credibility | Anthony Rosenberger',
    description:
      'Academic achievement, founder experience, and the lessons behind the work.',
    url: '/credibility',
  },
};

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function CredibilityPage() {
  return (
    <main className="credibility-page">
      <SiteHeader />

      <section className="credibility-hero" aria-labelledby="credibility-title">
        <div className="section-shell credibility-hero-inner">
          <p className="kicker">Credibility</p>
          <h1 id="credibility-title">The experience behind the work.</h1>
          <p>
            Credibility is more than a finished website. It comes from discipline,
            taking responsibility, building real things, and learning when an idea
            does not work.
          </p>
        </div>
      </section>

      <section className="credential-section section-shell" aria-labelledby="academic-title">
        <div className="credential-copy">
          <p className="section-label">Academic achievement</p>
          <h2 id="academic-title">Performance in the classroom and in competition.</h2>
          <p>
            Named to the 2025–2026 Atlantic Coast Conference Academic Honor Roll
            while competing as a Division I athlete at Boston College.
          </p>
        </div>
        <figure className="credential-proof">
          <Image
            src="/credibility/acc-academic-honor-roll.jpg"
            alt="Atlantic Coast Conference Academic Honor Roll certificate presented to Anthony Rosenberger of Boston College for the 2025–2026 academic year"
            width={1290}
            height={990}
            priority
          />
          <figcaption>Atlantic Coast Conference Academic Honor Roll · 2025–2026</figcaption>
        </figure>
      </section>

      <section className="founder-story" aria-labelledby="founder-title">
        <div className="section-shell">
          <header className="founder-heading">
            <div>
              <p className="section-label">Founder experience</p>
              <h2 id="founder-title">A failed idea—and one of my most valuable lessons.</h2>
            </div>
            <span className="founder-status">First company</span>
          </header>

          <a
            className="athlete-passage-shot"
            href="https://athletepassage.com/"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit the Athlete Passage website"
          >
            <Image
              src="/credibility/athlete-passage-home.png"
              alt="Athlete Passage homepage showing its college-athlete recruiting mentorship offer"
              width={1440}
              height={1000}
            />
            <span>Visit Athlete Passage <ExternalArrow /></span>
          </a>

          <div className="founder-details">
            <div className="founder-narrative">
              <p>
                Athlete Passage was my first real company. I built it to connect high
                school recruits with current college athletes for one-on-one recruiting
                guidance.
              </p>
              <p>
                The idea ultimately failed as a business. But taking it from an idea to
                a real company taught me how to form an LLC, onboard people, create
                working systems, and handle the responsibility that comes with building
                something others depend on.
              </p>
              <p>
                That experience now shapes how I work with clients: keep the offer clear,
                make onboarding simple, communicate honestly, and build around what the
                organization actually needs.
              </p>
            </div>
            <div className="founder-lessons" aria-label="Lessons from Athlete Passage">
              <p>What I learned</p>
              <ul>
                <li>How to form and operate an LLC</li>
                <li>How to onboard people clearly</li>
                <li>How to create repeatable business systems</li>
                <li>How to learn from an idea that did not succeed</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="credibility-cta" aria-labelledby="credibility-cta-title">
        <div className="section-shell">
          <p className="section-label">Put the lessons to work</p>
          <h2 id="credibility-cta-title">Need a thoughtful partner for your website?</h2>
          <a className="button button-light" href="mailto:anthony.smartflow@gmail.com">
            Discuss a project
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <span>Anthony Rosenberger</span>
        <span>Website design &amp; development</span>
        <Link href="/">Return home →</Link>
      </footer>
    </main>
  );
}
