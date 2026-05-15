export interface Integration {
  name: string;
  description: string;
  category: string;
  icon: string;
}

export const integrations: Integration[] = [
  {
    name: "Stripe",
    description: "Sell products or subscriptions and get paid online.",
    category: "Payments",
    icon: "CreditCard"
  },
  {
    name: "Slack",
    description: "Send messages and manage Slack as a user or bot.",
    category: "Communication",
    icon: "MessageSquare"
  },
  {
    name: "Notion",
    description: "Organize and sync knowledge or project data.",
    category: "Productivity",
    icon: "Book"
  },
  {
    name: "Google Sheets",
    description: "Sync and manage spreadsheet data automatically.",
    category: "Google Workspace",
    icon: "Table"
  },
  {
    name: "HubSpot",
    description: "Sync CRM data and automate marketing workflows.",
    category: "CRM",
    icon: "Users"
  },
  {
    name: "GitHub",
    description: "Manage repos, issues, and pull requests.",
    category: "Development",
    icon: "Github"
  },
  {
    name: "Supabase",
    description: "Browse schemas, read data, and view project status.",
    category: "Database",
    icon: "Database"
  },
  {
    name: "Hugging Face",
    description: "AI inference and model repositories integration.",
    category: "AI",
    icon: "Cpu"
  }
];
