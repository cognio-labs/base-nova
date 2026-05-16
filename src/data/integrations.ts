export interface Integration {
  name: string;
  description: string;
  category: string;
  icon: string;
  domain?: string;
  color?: string;
}

export const integrations: Integration[] = [
  {
    name: "Stripe",
    description: "Sell products or subscriptions and get paid online.",
    category: "Connectors",
    icon: "CreditCard",
    domain: "stripe.com",
    color: "#635bff"
  },
  {
    name: "Salesforce",
    description: "Automate and sync CRM records seamlessly.",
    category: "Connectors",
    icon: "Users",
    domain: "salesforce.com",
    color: "#00a1e0"
  },
  {
    name: "Slack",
    description: "Connect your workspace for real-time notifications.",
    category: "Connectors",
    icon: "MessageSquare",
    domain: "slack.com",
    color: "#4a154b"
  },
  {
    name: "Notion",
    description: "Organize and sync knowledge or project data.",
    category: "Connectors",
    icon: "Book",
    domain: "notion.so",
    color: "#000000"
  },
  {
    name: "Google Calendar",
    description: "Manage your schedule and calendar events.",
    category: "Connectors",
    icon: "Calendar",
    domain: "calendar.google.com",
    color: "#4285f4"
  },
  {
    name: "Google Drive",
    description: "Export and back up app-generated files.",
    category: "Connectors",
    icon: "HardDrive",
    domain: "drive.google.com",
    color: "#34a853"
  },
  {
    name: "Gmail",
    description: "Automate email sending and inbox management.",
    category: "Connectors",
    icon: "Mail",
    domain: "mail.google.com",
    color: "#ea4335"
  },
  {
    name: "HubSpot",
    description: "Sync CRM data and automate marketing flows.",
    category: "Connectors",
    icon: "Target",
    domain: "hubspot.com",
    color: "#ff7a59"
  },
  {
    name: "GitHub",
    description: "Manage repos, issues, and pull requests.",
    category: "Connectors",
    icon: "Github",
    domain: "github.com",
    color: "#24292e"
  },
  {
    name: "Discord",
    description: "Notify channels and integrate with your community.",
    category: "Connectors",
    icon: "MessageCircle",
    domain: "discord.com",
    color: "#5865f2"
  },
  {
    name: "Airtable",
    description: "Flexible databases and spreadsheets for teams.",
    category: "Connectors",
    icon: "Grid",
    domain: "airtable.com",
    color: "#18bfff"
  },
  {
    name: "Supabase",
    description: "Open source Firebase alternative with Postgres.",
    category: "Connectors",
    icon: "Database",
    domain: "supabase.com",
    color: "#3ecf8e"
  }
];
