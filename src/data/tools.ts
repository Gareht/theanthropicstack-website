export interface Tool {
  name: string;
  category: string;
  /** Branded redirect for referral links, direct URL otherwise. */
  href: string;
  summary: string;
  note: string;
  /**
   * Set only on referral links. Rendered next to the link, never further away.
   * Lead with what the reader gets, then state the commission plainly.
   */
  disclosure?: string;
}

export const tools: Tool[] = [
  {
    name: "Claude Code",
    category: "Agents",
    href: "https://claude.com/claude-code",
    summary: "Anthropic's coding agent, in the terminal and the editor.",
    note: "Most of what appears in The Build is written, tested and broken here first.",
  },
  {
    name: "Railway",
    category: "Infrastructure",
    href: "/railway",
    summary: "Deploys apps, databases and workers straight from a repository.",
    note: "Where the side projects live. Postgres, cron and background workers without the console archaeology.",
    disclosure:
      "You get $20 in credits to start. It is a referral link, so I earn a small cut if you stay.",
  },
  {
    name: "Astro",
    category: "Web",
    href: "https://astro.build",
    summary: "Static site framework that ships almost no JavaScript.",
    note: "This page is built with it. The whole site is a handful of components.",
  },
  {
    name: "Tailwind CSS",
    category: "Web",
    href: "https://tailwindcss.com",
    summary: "Utility-first styling with the design tokens in one file.",
    note: "Palette, type scale and easing curves all live in a single theme block.",
  },
  {
    name: "Substack",
    category: "Publishing",
    href: "https://substack.com",
    summary: "Where the newsletter is written and delivered.",
    note: "Boring on purpose. Writing is the hard part, not the mail server.",
  },
];
