'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };

    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <Link className="wordmark" href="/" aria-label="Anthony Rosenberger, home">
        Anthony Rosenberger
      </Link>

      <nav className="desktop-nav" aria-label="Main navigation">
        <Link href="/#nonprofits">Nonprofits</Link>
        <Link className="nav-page-link" href="/credibility">Credibility</Link>
        <a className="nav-cta" href="mailto:anthony.smartflow@gmail.com">
          Discuss a project
        </a>
      </nav>

      <div className="mobile-header-actions">
        <a className="nav-cta" href="mailto:anthony.smartflow@gmail.com">
          Discuss a project
        </a>
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {menuOpen ? (
        <nav className="mobile-menu" id="mobile-menu" aria-label="Mobile navigation">
          <Link href="/#nonprofits" onClick={closeMenu}>Nonprofits</Link>
          <Link href="/credibility" onClick={closeMenu}>Credibility</Link>
        </nav>
      ) : null}
    </header>
  );
}
