'use client';

import { useState } from 'react';

const timelineEvents = [
  {
    year: '2026',
    title: 'Friends of Vineyard Forests',
    summary:
      'Organizers announced Friends of Vineyard Forests and described Correllus as its origin story and first campaign.',
    source: 'Change.org organizer update · April 17, 2026',
  },
  {
    year: '2025',
    title: 'Phased project and public opposition',
    summary:
      'DCR listed 175 acres of eastern white-pine plantation work planned in phases while the community petition remained active.',
    source: 'Mass.gov project listing + Change.org petition',
  },
  {
    year: '2024',
    title: 'State forest policy and planning',
    summary:
      'Massachusetts released new climate-forestry guidance while planning for the Correllus project continued.',
    source: 'Mass.gov · Forests as Climate Solutions',
  },
  {
    year: '2023',
    title: 'Climate forestry report',
    summary:
      'The Climate Forestry Committee completed its report on forest cover and climate-oriented management.',
    source: 'Massachusetts Climate Forestry Committee report',
  },
  {
    year: '2020',
    title: 'Trail work and woodland research',
    summary:
      'Restoration planning and regional woodland research added context to debates over forests, barrens, heathlands, and grasslands.',
    source: 'Mass.gov records + Nature Sustainability (2020)',
  },
  {
    year: '2001',
    title: 'Environmental review required',
    summary:
      'A historical summary says state environmental officials required an Environmental Impact Report after fire-lane work.',
    source: 'FVF historical summary',
  },
  {
    year: '2000',
    title: 'Clearing plan halted',
    summary:
      'A historical summary says a proposed clearing plan was halted amid growing public attention and opposition.',
    source: 'FVF historical summary',
  },
  {
    year: '1998',
    title: 'Historical ecology research',
    summary:
      'Harvard Forest ecologists assessed the site’s vegetation history and ecology in relation to proposed grassland restoration.',
    source: 'Harvard Forest research listing',
  },
];

const services = [
  'Website design',
  'Development',
  'Mobile optimization',
  'Domain connection',
  'Hosting and launch support',
];

function ExternalArrow() {
  return <span aria-hidden="true">↗</span>;
}

export default function Home() {
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [headshotAvailable, setHeadshotAvailable] = useState(true);
  const activeEvent = timelineEvents[activeTimeline];

  const moveTimeline = (direction: number) => {
    setActiveTimeline((current) =>
      (current + direction + timelineEvents.length) % timelineEvents.length,
    );
  };

  return (
    <main>
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Anthony Rosenberger, home">
          Anthony Rosenberger
        </a>
        <nav aria-label="Main navigation">
          <a className="nav-scroll-link" href="#nonprofits">Nonprofits</a>
          <a className="nav-page-link" href="/credibility">Credibility</a>
          <a className="nav-cta" href="mailto:anthony.smartflow@gmail.com">Discuss a project</a>
        </nav>
      </header>

      <section className="hero" id="top" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="kicker">Independent designer &amp; developer</p>
          <h1 id="hero-title">
            Modern websites for nonprofits and small businesses.
          </h1>
          <p className="hero-intro">
            I’m Anthony Rosenberger. I help organizations turn complex ideas into clear,
            responsive websites built to earn trust and move people to act.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#work">View selected work</a>
            <a className="text-link" href="mailto:anthony.smartflow@gmail.com">Discuss a project <ExternalArrow /></a>
          </div>
        </div>
        <aside className="hero-note" aria-label="Portfolio approach">
          <span>Clear story</span>
          <span>Responsive build</span>
          <span>Launch support</span>
        </aside>
      </section>

      <section className="about section-shell" id="about" aria-labelledby="about-title">
        <div className="portrait-frame">
          {headshotAvailable ? (
            <img
              className="portrait-image"
              src="/projects/Headshot.png"
              alt="Anthony Rosenberger"
              onError={() => setHeadshotAvailable(false)}
            />
          ) : (
            <div className="portrait-placeholder" role="img" aria-label="Headshot to be added">
              <span>AR</span>
              <small>Headshot to add</small>
            </div>
          )}
        </div>
        <div className="about-copy">
          <p className="section-label">Who I am</p>
          <h2 id="about-title">A disciplined approach to every build.</h2>
          <p>
            I’m a junior at Boston College and a Division I college athlete. I bring the
            same preparation, consistency, and attention to detail to every website I
            design and develop.
          </p>
          <a
            className="about-link"
            href="https://www.linkedin.com/in/anthony-rosenberger-68a4a62ab/"
            target="_blank"
            rel="noreferrer"
          >
            Connect on LinkedIn <ExternalArrow />
          </a>
        </div>
      </section>

      <section className="follow-work section-shell" aria-labelledby="follow-work-title">
        <p className="follow-work-mark">HNGR · Build log</p>
        <div className="follow-work-copy">
          <h2 id="follow-work-title">Follow the work</h2>
          <p>
            Follow the process of building HNGR—from early ideas and design experiments
            to the behind-the-scenes work of launching real websites.
          </p>
        </div>
        <a
          className="follow-work-link"
          href="https://www.instagram.com/a.j.does_stuff/"
          target="_blank"
          rel="noreferrer"
        >
          @a.j.does_stuff <ExternalArrow />
        </a>
      </section>

      <section className="nonprofit-focus" id="nonprofits" aria-labelledby="nonprofit-title">
        <div className="nonprofit-inner section-shell">
          <header>
            <p className="section-label">For nonprofits</p>
            <h2 id="nonprofit-title">A straightforward website process for mission-driven organizations.</h2>
          </header>
          <div className="nonprofit-copy">
            <p className="nonprofit-lead">
              I’m developing a focused website service for nonprofits that need clearer
              messaging, modern technology, and dependable launch support.
            </p>
            <p>
              Each project starts with the organization’s mission, audience, goals, and
              budget. From there, I organize the story, design the experience, build it
              for every screen, and support the organization through launch.
            </p>
            <ol className="nonprofit-process" aria-label="Website process for nonprofits">
              <li><span>1</span><strong>Understand</strong><small>Mission, audience, goals, and budget</small></li>
              <li><span>2</span><strong>Organize</strong><small>Story, content, and clear next steps</small></li>
              <li><span>3</span><strong>Build</strong><small>Design, development, and mobile optimization</small></li>
              <li><span>4</span><strong>Launch</strong><small>Domain, hosting, testing, and support</small></li>
            </ol>
            <p className="nonprofit-note">
              I’m developing this work one conversation and project at a time while
              learning how thoughtful design can better support nonprofit communities.
            </p>
          </div>
        </div>
      </section>

      <section className="work section-shell" id="work" aria-labelledby="work-title">
        <header className="section-heading">
          <p className="section-label">Selected work</p>
          <h2 id="work-title">Three websites, three different communication problems.</h2>
        </header>

        <article className="project project-forest">
          <div className="project-topline">
            <div>
              <p className="project-index">Friends of Vineyard Forests</p>
              <h3>Making a long public history understandable.</h3>
            </div>
            <span className="status status-prelaunch">Preparing for launch</span>
          </div>

          <div className="project-visual timeline-visual">
            <img className="botanical botanical-upper" src="/projects/correllus-botanical-upper.png" alt="" />
            <img className="botanical botanical-middle" src="/projects/correllus-botanical-middle.png" alt="" />
            <div className="timeline-content">
              <div className="timeline-heading">
                <div>
                  <span>The Correllus story</span>
                  <strong>How we got here</strong>
                </div>
                <div className="timeline-controls">
                  <button type="button" onClick={() => moveTimeline(-1)} aria-label="Previous timeline event">←</button>
                  <button type="button" onClick={() => moveTimeline(1)} aria-label="Next timeline event">→</button>
                </div>
              </div>
              <div className="timeline-years" role="tablist" aria-label="Correllus timeline years">
                {timelineEvents.map((event, index) => (
                  <button
                    type="button"
                    role="tab"
                    aria-selected={activeTimeline === index}
                    key={event.year}
                    onClick={() => setActiveTimeline(index)}
                  >
                    {event.year}
                  </button>
                ))}
              </div>
              <div className="timeline-event" role="tabpanel" aria-live="polite">
                <span>{activeEvent.year}</span>
                <h4>{activeEvent.title}</h4>
                <p>{activeEvent.summary}</p>
                <small>{activeEvent.source}</small>
              </div>
            </div>
          </div>

          <dl className="project-details">
            <div><dt>The need:</dt><dd>An evidence-led campaign site that could explain a long public history without losing the human stakes.</dd></div>
            <div><dt>My work:</dt><dd>I designed and developed the site and an interactive Correllus timeline connecting research, policy, public process, and organizing.</dd></div>
            <div><dt>Status/result:</dt><dd>Preparing for launch. <a href="https://friends-of-vineyard-forests.vercel.app/campaigns/correllus" target="_blank" rel="noreferrer">View preview <ExternalArrow /></a></dd></div>
          </dl>
        </article>

        <article className="project project-lani">
          <div className="project-topline">
            <div>
              <p className="project-index">Lānaʻi Beach Club</p>
              <h3>A visual storefront grounded in Martha’s Vineyard.</h3>
            </div>
            <span className="status status-live">Live</span>
          </div>

          <div className="project-visual lani-visual">
            <img className="lani-hero-image" src="https://www.lanibeachclub.com/sailboat.webp" alt="Lānaʻi Beach Club homepage sailboat hero" />
            <div className="lani-bar"><span>LANI BEACH CLUB</span><span>SHOP &nbsp; OUR STORY</span></div>
            <div className="lani-copy"><small>Martha’s Vineyard, MA</small><strong>Sustainable Beach Essentials for Every Body</strong></div>
            <div className="lani-tiles" aria-hidden="true">
              <img src="https://www.lanibeachclub.com/store.webp" alt="" />
              <img src="https://www.lanibeachclub.com/model-lani.webp" alt="" />
            </div>
          </div>

          <dl className="project-details">
            <div><dt>The need:</dt><dd>A clear, image-led storefront that made seasonal swimwear and the Vineyard Haven shop easy to discover.</dd></div>
            <div><dt>My work:</dt><dd>I designed and developed a responsive homepage with direct shopping, brand-story, and store-visit paths.</dd></div>
            <div><dt>Status/result:</dt><dd>Live. <a href="https://www.lanibeachclub.com/" target="_blank" rel="noreferrer">Visit website <ExternalArrow /></a></dd></div>
          </dl>
        </article>

        <article className="project project-tpi">
          <div className="project-topline">
            <div>
              <p className="project-index">The Precisionists</p>
              <h3>Clarifying a complex services and employment model.</h3>
            </div>
            <span className="status status-concept">Independent concept</span>
          </div>

          <div className="project-visual tpi-visual">
            <img src="/projects/tpi-home-hero-workplace-collaboration.jpg" alt="The Precisionists homepage concept" />
            <div className="tpi-shade" />
            <div className="tpi-bar"><span>THE PRECISIONISTS</span><span>SERVICES &nbsp; HOW IT WORKS &nbsp; CAREERS</span></div>
            <div className="tpi-copy"><small>Independent website concept</small><strong>Bridging the Neurodiversity Employment Divide.</strong><span>Business services and supported employment, explained through one clear system.</span></div>
          </div>

          <dl className="project-details">
            <div><dt>The need:</dt><dd>A clearer way to explain a model that combines business-service delivery with neurodivergent employment.</dd></div>
            <div><dt>My work:</dt><dd>I created an independent, unofficial redesign concept focused on clearer services, dated evidence, and distinct customer and candidate paths.</dd></div>
            <div><dt>Status/result:</dt><dd>Independent concept—not commissioned or approved by The Precisionists. <a href="https://slalomtpi.vercel.app/" target="_blank" rel="noreferrer">View concept <ExternalArrow /></a></dd></div>
          </dl>
        </article>
      </section>

      <section className="services section-shell" id="services" aria-labelledby="services-title">
        <div className="services-intro">
          <p className="section-label">Services</p>
          <h2 id="services-title">The pieces needed to get a website across the finish line.</h2>
          <p className="services-fit">
            Best suited for nonprofits and small businesses that need a clearer story,
            a modern website, and hands-on launch support.
          </p>
        </div>
        <ul>
          {services.map((service) => <li key={service}>{service}</li>)}
        </ul>
      </section>

      <section className="contact" id="contact" aria-labelledby="contact-title">
        <div className="contact-inner section-shell">
          <p className="section-label">Contact</p>
          <h2 id="contact-title">Have a website in mind?</h2>
          <p>Tell me what you are building, what needs to be clearer, and where you want the project to go.</p>
          <div className="contact-actions" id="contact-details">
            <a className="button button-light" href="mailto:anthony.smartflow@gmail.com">Discuss a project</a>
            <div className="contact-list">
              <span><b>Email</b> <a href="mailto:anthony.smartflow@gmail.com">anthony.smartflow@gmail.com</a></span>
              <span><b>Phone</b> <a href="tel:+12158505807">215-850-5807</a></span>
              <span><b>LinkedIn</b> <a href="https://www.linkedin.com/in/anthony-rosenberger-68a4a62ab/" target="_blank" rel="noreferrer">View profile <ExternalArrow /></a></span>
              <span><b>Instagram</b> <a href="https://www.instagram.com/a.j.does_stuff/" target="_blank" rel="noreferrer">@a.j.does_stuff <ExternalArrow /></a></span>
            </div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>Anthony Rosenberger</span>
        <span>Website design &amp; development</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
