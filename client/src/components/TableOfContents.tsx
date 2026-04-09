import { useEffect, useState } from "react";
import { Link } from "wouter";

interface Heading {
  id: string;
  level: number;
  text: string;
}

interface TableOfContentsProps {
  content: string;
}

export function TableOfContents({ content }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // Parse HTML content to extract headings
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, "text/html");
    const headingElements = doc.querySelectorAll("h2, h3, h4");

    const extractedHeadings: Heading[] = [];
    headingElements.forEach((el, index) => {
      const level = parseInt(el.tagName[1]);
      const text = el.textContent || "";
      const id = el.id || `heading-${index}`;

      extractedHeadings.push({
        id,
        level,
        text,
      });
    });

    setHeadings(extractedHeadings);
  }, [content]);

  if (headings.length === 0) return null;

  return (
    <div className="bg-secondary/50 border border-border rounded-lg p-6 my-8">
      <h3 className="text-lg font-bold mb-4">Table of Contents</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ marginLeft: `${(heading.level - 2) * 1.5}rem` }}
          >
            <a
              href={`#${heading.id}`}
              className="text-accent hover:underline transition-colors text-sm"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
