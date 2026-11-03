"use client";

import { useId, useRef, useState } from "react";

type Option = { code: string; name: string };

/**
 * Small "type to search" state picker. Replaces the browser's built-in
 * dropdown, which on some computers opens a huge list of all 51 states.
 * Keyboard: type to filter, ↑/↓ to move, Enter to choose, Esc to close.
 */
export default function StatePicker({
  options,
  onPick,
  disabled,
  placeholder = "+ Add a state",
}: {
  options: Option[];
  onPick: (code: string) => void;
  disabled?: boolean;
  placeholder?: string;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listId = useId();
  const listRef = useRef<HTMLUListElement>(null);

  const q = query.trim().toLowerCase();
  const matches = options.filter(
    (o) => !q || o.name.toLowerCase().includes(q) || o.code.toLowerCase() === q,
  );

  const choose = (o: Option | undefined) => {
    if (!o) return;
    onPick(o.code);
    setQuery("");
    setOpen(false);
    setActive(0);
  };

  const move = (delta: number) => {
    if (!matches.length) return;
    const next = (active + delta + matches.length) % matches.length;
    setActive(next);
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
  };

  return (
    <div className="picker">
      <input
        type="text"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={open && matches[active] ? `${listId}-${matches[active].code}` : undefined}
        aria-label="Add a state: type to search"
        placeholder={placeholder}
        disabled={disabled}
        value={query}
        autoComplete="off"
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); move(1); }
          else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
          else if (e.key === "Enter") { e.preventDefault(); if (open) choose(matches[active]); }
          else if (e.key === "Escape") { setOpen(false); }
        }}
      />
      {open && !disabled && (
        <ul id={listId} role="listbox" ref={listRef} className="picker-list">
          {matches.length === 0 ? (
            <li className="picker-empty">No state found</li>
          ) : (
            matches.map((o, i) => (
              <li
                key={o.code}
                id={`${listId}-${o.code}`}
                role="option"
                aria-selected={i === active}
                className={i === active ? "is-active" : undefined}
                onMouseDown={(e) => { e.preventDefault(); choose(o); }}
                onMouseEnter={() => setActive(i)}
              >
                {o.name}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
