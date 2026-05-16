export interface Integration {
  name: string;
  description: string;
  category: string;
  icon: string;
  domain: string;
  color: string;
}

export const integrations: Integration[] = [
  {
    name: "Stripe",
    description: "Sell products or subscriptions and get paid online.",
    category: "Finance",
    icon: "CreditCard",
    domain: "stripe.com",
    color: "#635bff"
  },
  {
    name: "Salesforce",
    description: "Automate and sync CRM records seamlessly.",
    category: "CRM",
    icon: "Users",
    domain: "salesforce.com",
    color: "#00a1e0"
  },
  {
    name: "Slack",
    description: "Connect your workspace for real-time notifications.",
    category: "Communication",
    icon: "MessageSquare",
    domain: "slack.com",
    color: "#4a154b"
  },
  {
    name: "Notion",
    description: "Organize and sync knowledge or project data.",
    category: "Productivity",
    icon: "Book",
    domain: "notion.so",
    color: "#000000"
  },
  {
    name: "Google Calendar",
    description: "Manage your schedule and calendar events.",
    category: "Productivity",
    icon: "Calendar",
    domain: "calendar.google.com",
    color: "#4285f4"
  },
  {
    name: "Google Drive",
    description: "Export and back up app-generated files.",
    category: "Storage",
    icon: "HardDrive",
    domain: "drive.google.com",
    color: "#34a853"
  },
  {
    name: "Gmail",
    description: "Automate email sending and inbox management.",
    category: "Communication",
    icon: "Mail",
    domain: "mail.google.com",
    color: "#ea4335"
  },
  {
    name: "Google Sheets",
    description: "Sync and manage spreadsheet data automatically.",
    category: "Productivity",
    icon: "FileSpreadsheet",
    domain: "sheets.google.com",
    color: "#0f9d58"
  },
  {
    name: "Google Docs",
    description: "Generate and automate document creation.",
    category: "Productivity",
    icon: "FileText",
    domain: "docs.google.com",
    color: "#4285f4"
  },
  {
    name: "HubSpot",
    description: "Sync CRM data and automate marketing flows.",
    category: "CRM",
    icon: "Target",
    domain: "hubspot.com",
    color: "#ff7a59"
  },
  {
    name: "LinkedIn",
    description: "Share updates and access professional profiles.",
    category: "Social",
    icon: "Linkedin",
    domain: "linkedin.com",
    color: "#0a66c2"
  },
  {
    name: "GitHub",
    description: "Manage repos, issues, and pull requests.",
    category: "Development",
    icon: "Github",
    domain: "github.com",
    color: "#24292e"
  },
  {
    name: "Discord",
    description: "Notify channels and integrate with your community.",
    category: "Communication",
    icon: "MessageCircle",
    domain: "discord.com",
    color: "#5865f2"
  },
  {
    name: "Instagram",
    description: "Publish content and manage comments on your account.",
    category: "Social",
    icon: "Instagram",
    domain: "instagram.com",
    color: "#e4405f"
  },
  {
    name: "TikTok",
    description: "Track your profile stats and browse your videos.",
    category: "Social",
    icon: "Video",
    domain: "tiktok.com",
    color: "#000000"
  },
  {
    name: "Wix",
    description: "Access Wix site data and business tools.",
    category: "CMS",
    icon: "Globe",
    domain: "wix.com",
    color: "#000000"
  },
  {
    name: "GitLab",
    description: "Manage projects, MRs, and CI/CD pipelines.",
    category: "Development",
    icon: "Gitlab",
    domain: "gitlab.com",
    color: "#fc6d26"
  },
  {
    name: "BambooHR",
    description: "Employee directory and HR management sync.",
    category: "HR",
    icon: "Heart",
    domain: "bamboohr.com",
    color: "#61a60e"
  },
  {
    name: "Wrike",
    description: "Project planning and team coordination.",
    category: "Productivity",
    icon: "CheckSquare",
    domain: "wrike.com",
    color: "#08d1ad"
  },
  {
    name: "Box",
    description: "Secure cloud content management and storage.",
    category: "Storage",
    icon: "Box",
    domain: "box.com",
    color: "#0061d5"
  },
  {
    name: "ClickUp",
    description: "Organize projects and track team work.",
    category: "Productivity",
    icon: "Layout",
    domain: "clickup.com",
    color: "#7b68ee"
  },
  {
    name: "Google Analytics",
    description: "Track website traffic and user insights.",
    category: "Analytics",
    icon: "BarChart",
    domain: "analytics.google.com",
    color: "#f4b400"
  },
  {
    name: "Outlook",
    description: "Sync email and calendar from Microsoft 365.",
    category: "Communication",
    icon: "Mail",
    domain: "outlook.com",
    color: "#0078d4"
  },
  {
    name: "Linear",
    description: "Issue tracking and high-performance project management.",
    category: "Productivity",
    icon: "Activity",
    domain: "linear.app",
    color: "#5e6ad2"
  },
  {
    name: "Dropbox",
    description: "Store and sync files in the cloud securely.",
    category: "Storage",
    icon: "Folder",
    domain: "dropbox.com",
    color: "#0061ff"
  },
  {
    name: "Airtable",
    description: "Flexible databases and spreadsheets for teams.",
    category: "Productivity",
    icon: "Grid",
    domain: "airtable.com",
    color: "#18bfff"
  },
  {
    name: "Microsoft Teams",
    description: "Team chat, channels, and video meetings.",
    category: "Communication",
    icon: "Video",
    domain: "teams.microsoft.com",
    color: "#6264a7"
  },
  {
    name: "Typeform",
    description: "Forms, surveys, and data collection tools.",
    category: "Marketing",
    icon: "FormInput",
    domain: "typeform.com",
    color: "#262627"
  },
  {
    name: "Calendly",
    description: "Automated appointment scheduling workflows.",
    category: "Productivity",
    icon: "Clock",
    domain: "calendly.com",
    color: "#006bff"
  },
  {
    name: "Contentful",
    description: "Headless CMS and content management.",
    category: "CMS",
    icon: "FileCode",
    domain: "contentful.com",
    color: "#24b47e"
  },
  {
    name: "Supabase",
    description: "Open source Firebase alternative with Postgres.",
    category: "Development",
    icon: "Database",
    domain: "supabase.com",
    color: "#3ecf8e"
  },
  {
    name: "Hugging Face",
    description: "AI inference and machine learning model repos.",
    category: "AI",
    icon: "Brain",
    domain: "huggingface.co",
    color: "#ff9d00"
  }
];
