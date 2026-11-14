export const sourceOrigin = "https://itzicehere.gitbook.io";

export const currentPath = "/redlotusguide";

export const coverImage = "/sites/redlotusguide/cover.png";

export const site = {
  title: "RedLotus Guide",
  emoji: "🪷",
  pageTitle: "Introduction",
  breadcrumb: {
    title: "ScreenSharing Introducttion and Principles",
    path: "/redlotusguide/screensharing-introducttion-and-principles",
  },
};

export type NavItem = {
  title: string;
  /** Path as published on the source site. */
  path: string;
  children?: NavItem[];
};

export type NavGroup = {
  title: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    title: "ScreenSharing Introducttion and Principles",
    items: [
      {
        title: "Introduction",
        path: "/redlotusguide",
        children: [
          {
            title: "What is a Hack Check (Screenshare)?",
            path: "/redlotusguide/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses/what-is-a-hack-check",
          },
          {
            title: "The Goal: Demonstrating Cheat Usage",
            path: "/redlotusguide/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses/the-goal-demonstrating-cheat-usage",
          },
          {
            title: "The Staffer's Perspective and the Learning Process",
            path: "/redlotusguide/screensharing-introducttion-and-principles/first-section-an-introduction-to-hack-checks-and-bypasses/the-staffers-perspective-and-the-learning-process",
          },
        ],
      },
      {
        title: "Red Lotus Principles",
        path: "/redlotusguide/screensharing-introducttion-and-principles/second-section-red-lotus-principles",
      },
    ],
  },
  {
    title: "ScreenSharing General Knowledge",
    items: [
      {
        title: "Windows Fundamentals",
        path: "/redlotusguide/screensharing-general-knowledge/third-section-windows-fundamentals",
      },
      {
        title: "Common Windows Artifacts and Their Basic Analysis",
        path: "/redlotusguide/screensharing-general-knowledge/fourth-section-common-windows-artifacts-and-their-basic-analysis",
      },
      {
        title: "Manual SS Techniques (Basic and Intermediate)",
        path: "/redlotusguide/screensharing-general-knowledge/seventh-section-manual-ss-techniques",
      },
      {
        title: "More Artifact Analysis for ScreenSharing",
        path: "/redlotusguide/screensharing-general-knowledge/ninth-section-more-artifact-analysis-for-screensharing",
      },
      {
        title: "Common Bypass Techniques in ScreenSharing",
        path: "/redlotusguide/screensharing-general-knowledge/eighth-section-common-bypass-techniques-in-screensharing",
      },
      {
        title: "Ban Evasion and Alt Account Detection",
        path: "/redlotusguide/screensharing-general-knowledge/ban-evasion-and-alt-account-detection",
      },
    ],
  },
  {
    title: "ScreenSharing Minecraft Knowledge",
    items: [
      {
        title: "Minecraft Architecture and Analysis",
        path: "/redlotusguide/screensharing-minecraft-knowledge/fifth-section-specific-context-minecraft",
      },
      {
        title: "Mouse, Macro, and Input Analysis",
        path: "/redlotusguide/screensharing-minecraft-knowledge/sixth-section-mouse-macro-and-input-analysis-in-screensharing",
      },
    ],
  },
  {
    title: "Advanced Explanation of Artifacts",
    items: [
      { title: "Program Execution", path: "/redlotusguide/advanced-explanation-of-artifacts/program-execution" },
      { title: "File System Activity", path: "/redlotusguide/advanced-explanation-of-artifacts/file-system-activity" },
      { title: "User Activity and Knowledge", path: "/redlotusguide/advanced-explanation-of-artifacts/user-activity-and-knowledge" },
      {
        title: "System Configuration and Persistence",
        path: "/redlotusguide/advanced-explanation-of-artifacts/system-configuration-and-persistence",
      },
    ],
  },
  {
    title: "ScreenShare Tools",
    items: [
      { title: "RedLotus Tools", path: "/redlotusguide/screenshare-tools/redlotus-tools" },
      { title: "Spok's Tools", path: "/redlotusguide/screenshare-tools/spoks-tools" },
      { title: "Rancio's Tools", path: "/redlotusguide/screenshare-tools/rancios-tools" },
      { title: "Echo's Tools", path: "/redlotusguide/screenshare-tools/echos-tools" },
      {
        title: "Specific PowerShell Scripts",
        path: "/redlotusguide/screenshare-tools/specific-powershell-scripts",
      },
    ],
  },
];

export const tableOfContents = [
  { id: "socials", title: "Socials" },
  { id: "partners", title: "Our Partners" },
];
