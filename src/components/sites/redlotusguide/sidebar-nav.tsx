"use client";

import Image from "next/image";
import { assetPath } from "@/lib/base-path";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";

import { chromeIcons } from "./generated";
import { Glyph } from "./glyph";
import { dict, type Lang } from "./i18n";
import type { NavNode, NavSection } from "./pages-data";

function trailInto(sections: NavSection[], activeRoute: string) {
  const trail = new Set<string>();

  const walk = (nodes: NavNode[], chain: string[]) => {
    for (const node of nodes) {
      if (node.route === activeRoute) chain.forEach((route) => trail.add(route));
      if (node.children.length) walk(node.children, [...chain, node.route]);
    }
  };

  sections.forEach((section) => walk(section.nodes, []));
  return trail;
}

function NavRow({
  node,
  activeRoute,
  expanded,
  onToggle,
  activeRef,
  lang,
}: {
  node: NavNode;
  activeRoute: string;
  expanded: Record<string, boolean>;
  onToggle: (route: string) => void;
  activeRef: RefObject<HTMLAnchorElement | null>;
  lang: Lang;
}) {
  const label = lang === "fr" ? node.titleFr : node.title;
  const hasChildren = node.children.length > 0;
  const open = hasChildren && (expanded[node.route] ?? false);

  return (
    <li>
      <div className="rl-nav-row" data-leaf={hasChildren ? undefined : "true"}>
        <Link
          className="rl-nav-link"
          href={node.route}
          ref={node.route === activeRoute ? activeRef : undefined}
          aria-current={node.route === activeRoute ? "page" : undefined}
        >
          <Glyph icon={node.icon} className="rl-nav-icon" />
          <span className="rl-nav-text">{label}</span>
        </Link>

        {hasChildren ? (
          <button
            type="button"
            className="rl-nav-toggle"
            aria-label={label}
            aria-expanded={open}
            onClick={() => onToggle(node.route)}
          >
            <Glyph icon={chromeIcons.chevron} />
          </button>
        ) : null}
      </div>

      {open ? (
        <ul className="rl-nav-children">
          {node.children.map((child) => (
            <NavRow
              key={child.route}
              node={child}
              activeRoute={activeRoute}
              expanded={expanded}
              onToggle={onToggle}
              activeRef={activeRef}
              lang={lang}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function SidebarNav({
  open,
  activeRoute,
  sections,
  lang,
}: {
  open: boolean;
  activeRoute: string;
  sections: NavSection[];
  lang: Lang;
}) {
  const t = dict[lang];
  const trail = useMemo(() => trailInto(sections, activeRoute), [sections, activeRoute]);
  const [overrides, setOverrides] = useState<Record<string, boolean>>({});
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});
  const activeRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "center" });
  }, [activeRoute]);

  const expanded: Record<string, boolean> = {};
  sections.forEach((section) => {
    const walk = (nodes: NavNode[]) => {
      for (const node of nodes) {
        expanded[node.route] = overrides[node.route] ?? trail.has(node.route);
        if (node.children.length) walk(node.children);
      }
    };
    walk(section.nodes);
  });

  const toggle = (route: string) => {
    setOverrides((current) => ({ ...current, [route]: !(current[route] ?? trail.has(route)) }));
  };

  const toggleGroup = (key: string) => {
    setCollapsedGroups((current) => ({ ...current, [key]: !current[key] }));
  };

  return (
    <aside className="rl-sidebar" data-open={open} aria-label={t.spaceNav}>
      <Link className="rl-sidebar-logo" href="/" aria-label="Accueil">
        <Image
          src={assetPath("/assets/logo.png")}
          alt="France Ranked"
          width={178}
          height={256}
          priority
        />
      </Link>

      <nav className="rl-nav">
        {sections.map((section) => {
          const groupOpen = !collapsedGroups[section.key];
          return (
            <div className="rl-nav-group" key={section.key}>
              <button
                type="button"
                className="rl-nav-group-title"
                aria-expanded={groupOpen}
                onClick={() => toggleGroup(section.key)}
              >
                <span>{lang === "fr" ? section.titleFr : section.title}</span>
              </button>
              {groupOpen ? (
                <ul className="rl-nav-list">
                  {section.nodes.map((node) => (
                    <NavRow
                      key={node.route}
                      node={node}
                      activeRoute={activeRoute}
                      expanded={expanded}
                      onToggle={toggle}
                      activeRef={activeRef}
                      lang={lang}
                    />
                  ))}
                </ul>
              ) : null}
            </div>
          );
        })}
      </nav>

    </aside>
  );
}
