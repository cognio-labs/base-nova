export interface Integration {
  name: string;
  description: string;
  category: string;
  icon: string;
  domain?: string;
}

export const integrations: Integration[] = [
  {
    name: "Stripe",
    description: "Sell products or subscriptions and get paid online.",
    category: "Connectors",
    icon: "CreditCard",
    domain: "stripe.com"
  },
  {
    name: "Salesforce",
    description: "Automate and sync CRM records.",
    category: "Connectors",
    icon: "Users",
    domain: "salesforce.com"
  },
  {
    name: "Slack User",
    description: "Send messages and manage Slack as a user.",
    category: "Connectors",
    icon: "MessageSquare",
    domain: "slack.com"
  },
  {
    name: "Slack Bot",
    description: "Post as a branded bot in your Slack workspace.",
    category: "Connectors",
    icon: "Bot",
    domain: "slack.com"
  },
  {
    name: "Notion",
    description: "Organize and sync knowledge or project data.",
    category: "Connectors",
    icon: "Book",
    domain: "notion.so"
  },
  {
    name: "Google Calendar",
    description: "Manage your schedule and calendar events.",
    category: "Connectors",
    icon: "Calendar",
    domain: "calendar.google.com"
  },
  {
    name: "Google Drive",
    description: "Export and back up app-generated files.",
    category: "Connectors",
    icon: "HardDrive",
    domain: "drive.google.com"
  },
  {
    name: "Gmail",
    description: "Automate email sending and inbox management.",
    category: "Connectors",
    icon: "Mail",
    domain: "mail.google.com"
  },
  {
    name: "Google Sheets",
    description: "Sync and manage spreadsheet data.",
    category: "Connectors",
    icon: "Table",
    domain: "docs.google.com/spreadsheets"
  },
  {
    name: "Google Slides",
    description: "Generate and manage presentations.",
    category: "Connectors",
    icon: "Presentation",
    domain: "docs.google.com/presentation"
  },
  {
    name: "Google Docs",
    description: "Manage and automate document creation.",
    category: "Connectors",
    icon: "FileText",
    domain: "docs.google.com"
  },
  {
    name: "Google BigQuery",
    description: "Query and sync analytics data.",
    category: "Connectors",
    icon: "Database",
    domain: "cloud.google.com/bigquery"
  },
  {
    name: "Google Tasks",
    description: "Manage to-do lists and tasks.",
    category: "Connectors",
    icon: "CheckSquare",
    domain: "tasks.google.com"
  },
  {
    name: "Google Meet",
    description: "Video conferences and meetings.",
    category: "Connectors",
    icon: "Video",
    domain: "meet.google.com"
  },
  {
    name: "HubSpot",
    description: "Sync CRM data and automate marketing.",
    category: "Connectors",
    icon: "Target",
    domain: "hubspot.com"
  },
  {
    name: "LinkedIn",
    description: "Share updates and access professional profiles.",
    category: "Connectors",
    icon: "Linkedin",
    domain: "linkedin.com"
  },
  {
    name: "TikTok",
    description: "Track your profile stats and browse your videos.",
    category: "Connectors",
    icon: "Music",
    domain: "tiktok.com"
  },
  {
    name: "Instagram Business",
    description: "Publish content and manage comments on your Business account.",
    category: "Connectors",
    icon: "Instagram",
    domain: "instagram.com"
  },
  {
    name: "Discord",
    description: "Notify channels and integrate with your Discord community.",
    category: "Connectors",
    icon: "MessageCircle",
    domain: "discord.com"
  },
  {
    name: "Wix",
    description: "Access Wix site data and business tools.",
    category: "Connectors",
    icon: "Globe",
    domain: "wix.com"
  },
  {
    name: "GitHub",
    description: "Manage repos, issues, and pull requests.",
    category: "Connectors",
    icon: "Github",
    domain: "github.com"
  },
  {
    name: "GitLab",
    description: "Manage projects, MRs, and CI/CD pipelines.",
    category: "Connectors",
    icon: "Gitlab",
    domain: "gitlab.com"
  },
  {
    name: "BambooHR",
    description: "Employee directory and HR management.",
    category: "Connectors",
    icon: "Briefcase",
    domain: "bamboohr.com"
  },
  {
    name: "Wrike",
    description: "Project planning and team coordination.",
    category: "Connectors",
    icon: "ClipboardCheck",
    domain: "wrike.com"
  },
  {
    name: "Box",
    description: "Secure cloud content management.",
    category: "Connectors",
    icon: "Box",
    domain: "box.com"
  },
  {
    name: "ClickUp",
    description: "Organize projects and track team work.",
    category: "Connectors",
    icon: "Layers",
    domain: "clickup.com"
  },
  {
    name: "Google Analytics",
    description: "Track website traffic and user insights.",
    category: "Connectors",
    icon: "BarChart",
    domain: "analytics.google.com"
  },
  {
    name: "Outlook",
    description: "Email and calendar.",
    category: "Connectors",
    icon: "Mail",
    domain: "outlook.live.com"
  },
  {
    name: "Linear",
    description: "Issue tracking and project management.",
    category: "Connectors",
    icon: "Trello",
    domain: "linear.app"
  },
  {
    name: "Dropbox",
    description: "Store and sync files in the cloud.",
    category: "Connectors",
    icon: "Folder",
    domain: "dropbox.com"
  },
  {
    name: "Google Search Console",
    description: "SEO and search analytics.",
    category: "Connectors",
    icon: "Search",
    domain: "search.google.com"
  },
  {
    name: "Google Classroom",
    description: "Education and course management.",
    category: "Connectors",
    icon: "GraduationCap",
    domain: "classroom.google.com"
  },
  {
    name: "Airtable",
    description: "Flexible databases and spreadsheets.",
    category: "Connectors",
    icon: "Grid",
    domain: "airtable.com"
  },
  {
    name: "Splitwise",
    description: "Expense splitting and group bills.",
    category: "Connectors",
    icon: "DollarSign",
    domain: "splitwise.com"
  },
  {
    name: "Microsoft Teams",
    description: "Team chat, channels, and meetings.",
    category: "Connectors",
    icon: "Users",
    domain: "teams.microsoft.com"
  },
  {
    name: "Microsoft SharePoint",
    description: "Document management and collaboration.",
    category: "Connectors",
    icon: "FileSpreadsheet",
    domain: "sharepoint.com"
  },
  {
    name: "Microsoft OneDrive",
    description: "Cloud file storage.",
    category: "Connectors",
    icon: "Cloud",
    domain: "onedrive.live.com"
  },
  {
    name: "Typeform",
    description: "Forms, surveys, and data collection.",
    category: "Connectors",
    icon: "FormInput",
    domain: "typeform.com"
  },
  {
    name: "Hugging Face",
    description: "AI inference and model repos.",
    category: "Connectors",
    icon: "Cpu",
    domain: "huggingface.co"
  },
  {
    name: "Calendly",
    description: "Automated appointment scheduling.",
    category: "Connectors",
    icon: "CalendarDays",
    domain: "calendly.com"
  },
  {
    name: "Contentful",
    description: "Headless CMS and content management.",
    category: "Connectors",
    icon: "FileCode",
    domain: "contentful.com"
  },
  {
    name: "Supabase",
    description: "Browse schemas, read data, and view project status (read-only).",
    category: "Connectors",
    icon: "Database",
    domain: "supabase.com"
  }
];
