export interface Partner {
  name: string;
  location: string;
  website?: string;
  linkedin?: string;
  tags: string[];
  description: string;
  languages: string[];
  startingFrom?: string;
  hourlyRate?: string;
  avatar: string;
}

export const partners: Partner[] = [
  {
    name: "Bright Business solutions",
    location: "Accra, Ghana",
    tags: ["Application Development", "UI/UX Design", "Security Expert", "Strategic Consulting"],
    description: "We leverage a unique blend of expertise in software engineering, AI, Graphic design, UX/UI design and system integration to architect intelligent, future-proof solutions.",
    languages: ["English", "Spanish", "German"],
    startingFrom: "$500",
    hourlyRate: "$80/hr",
    avatar: "/avatars/man.png"
  },
  {
    name: "Alpha Exotic Tech LLC",
    location: "Bahawalpur, Pakistan",
    website: "alphaexotictech.com",
    tags: ["Application Development", "UI/UX Design", "AI Expert", "QA & Testing"],
    description: "We provide reliable, results-driven digital and technology services focused on delivering real value, transparency, and trust to our clients.",
    languages: ["English", "German", "Italian", "Russian", "Arabic"],
    startingFrom: "$200",
    hourlyRate: "$35/hr",
    avatar: "/avatars/woman.png"
  },
  {
    name: "Sapinetra AI",
    location: "Mumbai, India",
    website: "mealbreakers.com",
    tags: ["Application Development", "AI Expert", "API & Integrations", "QA & Testing"],
    description: "Sapinetra AI is a professional group of software developer with vast experience in IT services and AI project development. Our team is well versed with LokoAI.",
    languages: ["English"],
    startingFrom: "$250",
    avatar: "/avatars/man.png"
  },
  {
    name: "Zyrabit",
    location: "Nuevo Leon, Mexico",
    website: "zyrabit.com",
    tags: ["Application Development", "AI Expert"],
    description: "We create M.V.P for startups. Implement IA Generative logic + RAG + LanChain with your team.",
    languages: ["Spanish", "English"],
    startingFrom: "$5K",
    hourlyRate: "$250/hr",
    avatar: "/avatars/woman.png"
  },
  {
    name: "VISION8 Labs",
    location: "Colombo, Sri Lanka",
    website: "vision8.io",
    tags: ["Application Development", "Mobile Development", "API & Integrations", "Security Expert"],
    description: "Over a decade of experience architecting and delivering enterprise-grade software platforms used at scale across global organizations.",
    languages: ["English"],
    startingFrom: "$500",
    hourlyRate: "$40/hr",
    avatar: "/avatars/man.png"
  }
];
