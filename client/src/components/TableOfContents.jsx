import React, { useMemo } from 'react';

export default function TableOfContents({ content }) {
  const headings = useMemo(() => {
    if (!content) return [];
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const elements = doc.querySelectorAll('h2, h3');
    const items = [];

    elements.forEach((el, index) => {
      const text = el.textContent || '';
      const id = el.id || `section-${index}`;
      items.push({
        id,
        text,
        level: el.tagName.toLowerCase()
      });
    });

    return items;
  }, [content]);

  if (headings.length === 0) return null;

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <nav className="sticky-toc">
      <div className="toc-title">Table of Contents</div>
      <ul className="toc-list">
        {headings.map((h, i) => (
          <li
            key={i}
            style={{ paddingLeft: h.level === 'h3' ? '14px' : '0' }}
          >
            <a
              href={`#${h.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollToHeading(h.id);
              }}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
