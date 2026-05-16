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
}

const KNOWN_TAGS = new Set([
  "Application Development",
  "UI/UX Design",
  "Strategic Consulting",
  "AI Expert",
  "AI Specialist",
  "Security Expert",
  "API & Integrations",
  "Mobile Development",
  "QA & Testing",
  "Other",
]);

const partnerDirectoryRaw = `
Mohammad Aman Ahmadi
Mohammad Aman Ahmadi
Kabul, Afghanistan
fanoosaccounting.com
LinkedIn
Application Development
Through my own business Fanoos Accounting Services team, I have been providing bookkeeping, accounting, QuickBooks, Taxation Advisory, and Capacity Building program over 16 years. Now I providing new technology through LokoAI for my clients.
Languages: English, Arabic
From $1K
$15/hr
Contact
Elian QUESNEL - YoungData.io
Elian QUESNEL - YoungData.io
Montpellier, France
youngdata.io
LinkedIn
Application Development
UI/UX Design
API & Integrations
AI Expert
+1
5 ans d'expertise en software engineering, je transforme vos besoins en solutions techniques livrées dans les délais
Languages: English, French
From $2K
$150/hr
Contact
Stanley Ng
Stanley Ng
Singapore, Singapore
ainativeleadership.com
LinkedIn
Strategic Consulting
AI Expert
Application Development
UI/UX Design
I help companies lead their transformation into AI with training and consultancy services. This includes using AI to design and develop web apps that 10X productivity levels.
Languages: English
From $1K
$150/hr
Contact
SOFTMAGNO LLC | Ariam Balmaseda
SOFTMAGNO LLC | Ariam Balmaseda
Louisville, United States
softmagno.com
LinkedIn
Application Development
AI Expert
API & Integrations
Strategic Consulting
I’m Ariam, founder of SOFTMAGNO LLC, specializing in AI-powered SaaS platforms, automation systems, and advanced full-stack development. We transform complex business challenges into clean, scalable, and intelligent applications designed for real-world performance and long-term growth.
Languages: English, Spanish
From $2.5K
$85/hr
Contact
Blueberrytech
Blueberrytech
Vancouver, Canada
blueberrytech.ca
LinkedIn
Application Development
UI/UX Design
Strategic Consulting
Mobile Development
+5
AI-first technology partner building intelligent web and mobile applications, advanced voice agents, and connected IoT solutions that bridge the physical and digital worlds. We rapidly design, prototype, and scale secure, production-grade systems that help businesses automate operations and improve customer experiences.
Languages: English
From $1K
$150/hr
Contact
AGM Creations
AGM Creations
Florida, United States
eliteexchange.base44.app
Application Development
I specialize in making your ideas come to life. Game creation, app design, website design, you name it. I can help make it happen.
Languages: English
From $1K
$400/hr
Contact
S3 Digital
S3 Digital
Fort Lauderdale, United States
s3digital.online
Application Development
UI/UX Design
AI Expert
API & Integrations
+3
S3 Digital designs and implements AI-powered systems using LokoAI to help businesses automate operations, launch platforms, and scale intelligently. We specialize in turning complex ideas into production-ready solutions with clear strategy and clean execution.
Languages: English, Spanish
$25/hr
Contact
e-Sharp - Digital and Technology Consulting
e-Sharp - Digital and Technology Consulting
Tel Aviv, Israel
e-sharp.co
LinkedIn
Strategic Consulting
AI Expert
Application Development
Driving digital, AI, and e-commerce transformation for B2B and B2C companies through strategic consulting, tech implementation, and business innovation.
Languages: English, Hebrew
$200/hr
Contact
mayan shiloach
mayan shiloach
Lisbon, Portugal
LinkedIn
Application Development
Mobile Development
Problem solving, digital design, marketing, and any digital help needed.
Languages: Hebrew, English
From $200
$15/hr
Contact
Daracle
Daracle
Toronto, Canada
daracles.com
LinkedIn
Strategic Consulting
Application Development
API & Integrations
UI/UX Design
We help companies solve operational issues via customized business digital solutions without breaking the bank. We specialize in integrating real business operational experience with technology to solve practical problems.
Languages: English, French
From $1.5K
$75/hr
Contact
The Coding Boyz
The Coding Boyz
San Antonio, United States
vshare.base44.app
Other
This group is made of multiple people where we make a bunch of apps and games. Our known products include VShare, DrawAPic, and Gamble-F-Ton.
Languages: English
Contact
CoNest
CoNest
Aschaffenburg, Germany
webguru-ag.wixsite.com
Application Development
AI Expert
Strategic Consulting
API & Integrations
Webguru entwickelt moderne Websites und Web-Anwendungen, die nutzerfreundlich sind und messbar mehr Anfragen oder Verkäufe bringen. Wir begleiten dich von der Strategie über Design bis zur Umsetzung.
Languages: German
From $2K
$150/hr
Contact
Marketing Bull
Marketing Bull
Haarlem, Netherlands
marketing-bull.nl
LinkedIn
AI Expert
Other
Strategic Consulting
Application Development
Wij zijn Marketing Bull, een Nederlands marketingbedrijf gespecialiseerd in SEO en GEO-content. Met diverse AI-tools bouwen we ook websites en apps.
Languages: English, Dutch
From $900
$65/hr
Contact
ELO-ES
ELO-ES
Barcelona, Spain
elo.com
LinkedIn
Strategic Consulting
API & Integrations
Security Expert
Application Development
We provide smart solutions for AI powered process automation.
Languages: English, Spanish, Portuguese, German
From $3.5K
$200/hr
Contact
Vasilis Moschos
Vasilis Moschos
Serres, Greece
klikatogr-a71cca8e.base44.app
AI Expert
Application Development
Strategic Consulting
I specialize in digitally transforming businesses by implementing professional online booking and ordering systems that streamline their operations using the LokoAI ecosystem to drive growth and efficiency.
Languages: English
Contact
Webentwicklung Tech
Webentwicklung Tech
Munich, Germany
webentwicklung.tech
Application Development
UI/UX Design
API & Integrations
AI Expert
+4
Wir sind Ihre Digital Partner.
Languages: English, French, German, Arabic, Croatian, Serbian
From $5K
$120/hr
Contact
Megan
Megan
Singapore, Singapore
LinkedIn
Application Development
UI/UX Design
I build LokoAI apps with intention: clean design, clear purpose, and real user experience baked in from the start.
Languages: English
From $50
$20/hr
Contact
A2Z Machine Services
A2Z Machine Services
Karamsad, India
zatpatmachines.com
LinkedIn
Application Development
UI/UX Design
Strategic Consulting
AI Expert
+3
We are an industrial marketplace and service provider for Metal, Plastic and Wood Processing Industry.
Languages: English, German
From $100
$25/hr
Contact
Ennoblir Agency
Ennoblir Agency
Melbourne, Australia
LinkedIn
Application Development
UI/UX Design
Security Expert
API & Integrations
+5
We’re a boutique team of architects and developers who design AI-powered apps, agents and automation using modern, API-first development.
Languages: English, French
From $1.5K
$150/hr
Contact
The Optimal Company
The Optimal Company
Redding, California, United States
go-optimal.com
LinkedIn
Application Development
UI/UX Design
Strategic Consulting
Mobile Development
+4
We build agents, applications, automations and assets for businesses that want to optimize operations and increase sales.
Languages: English
From $3.5K
Contact
mangotech
mangotech
Tel Aviv, Israel
LinkedIn
Application Development
UI/UX Design
API & Integrations
Bring your idea, your PRD, or your design if you already worked on it. We will get your app running in no time and iterate until you are satisfied.
Languages: English, Spanish
From $50
$50/hr
Contact
Shop Innovator
Shop Innovator
Toronto, Canada
shopinnovator.com
LinkedIn
UI/UX Design
API & Integrations
Application Development
Building custom web stores and apps, to make ecommerce simpler and more successful.
Languages: English
From $3K
$100/hr
Contact
Grape Chain
Grape Chain
Houston, United States
grap3.com
API & Integrations
Application Development
UI/UX Design
Security Expert
+1
Powering the future of AI on blockchain.
Languages: English
From $5K
Contact
Industrial marketplace
Industrial marketplace
Vadodara, India
zatpatmachines.com
Application Development
UI/UX Design
Strategic Consulting
API & Integrations
+2
We are an India-based marketplace and experts in developing marketplaces for industry.
Languages: English, German
From $500
$50/hr
Contact
Kainjoo
Kainjoo
Morges, Switzerland
kainjoo.com
LinkedIn
UI/UX Design
Application Development
Strategic Consulting
AI Expert
+4
We're a brand-tech firm transforming regulated industries through emerging tech and channels.
Languages: English, Spanish, German, Romanian, Arabic, Japanese, Italian, French, Russian, Hungarian, Croatian
From $500
$150/hr
Contact
SAFE Software and Integrated Solutions Private Ltd
SAFE Software and Integrated Solutions Private Ltd
Bangalore, India
safenetin.net
LinkedIn
UI/UX Design
Application Development
Strategic Consulting
AI Expert
Prototyping Solutions. From concept to clickable.
Languages: English
$200/hr
Contact
Campoa.io
Campoa.io
Maputo, Mozambique
campoa.io
LinkedIn
Application Development
Strategic Consulting
API & Integrations
AI Expert
+2
I design and implement end-to-end operational systems for organisations that need fast, auditable results.
Languages: English, Portuguese
From $5K
$150/hr
Contact
Ran Levim
Ran Levim
Tel Aviv, Israel
altroai.net
Application Development
AI Expert
API & Integrations
Strategic Consulting
My expertise is in translating business needs into robust, custom software solutions across the full project lifecycle.
Languages: Hebrew, English
From $300
$74/hr
Contact
MARKETING-STRATEGEN
MARKETING-STRATEGEN
Ensdorf, Germany
marketing-strategen.com
LinkedIn
UI/UX Design
Strategic Consulting
QA & Testing
Application Development
+2
Marketing Profis mit großer Erfahrung im Erstellen von Dashboards und Analyseboards.
Languages: English, German
From $150
$100/hr
Contact
Daniel Han
Daniel Han
Shanghai, China
ai.hulu-cloud.com
Application Development
AI Expert
API & Integrations
Mobile Development
+1
We combine expertise in software engineering, AI, and system integration with a creative mindset to design smart, future-ready solutions.
Languages: English, Chinese
From $2K
$100/hr
Contact
Synaptra Ai
Synaptra Ai
Dallas, United States
synaptra.net
AI Expert
Strategic Consulting
Other
We do everything from a sales-forward perspective as business owners ourselves. We can create what your company needs to scale in a way that works for you and your employees.
Languages: English
From $500
$75/hr
Contact
Sushanth L Ram
Sushanth L Ram
Hyderabad, India
affendicate-amplifiers.com
LinkedIn
Application Development
Strategic Consulting
AI Expert
Other
Founder and CEO of Affendicate Amplifiers. We have been building a revolutionary business scaling approach called Hub Centric Systems.
Languages: English
From $500
$150/hr
Contact
AgentShablool
AgentShablool
North East, United States
github.com
UI/UX Design
Application Development
Strategic Consulting
AI Expert
+1
I've been in sales, retail management, and most recently operated my own business leveraging technology to improve productivity and efficiency.
Languages: English, Hebrew
From $100
$35/hr
Contact
AugmentX Solutions Limited
AugmentX Solutions Limited
London, United Kingdom
augmentxsolutions.com
LinkedIn
Application Development
UI/UX Design
AI Expert
API & Integrations
+1
We partner with businesses to build scalable, AI-driven SaaS solutions using the LokoAI platform.
Languages: English
From $1K
$150/hr
Contact
Tastet Lucas
Tastet Lucas
Brisbane, Australia
tastetlucas.com
LinkedIn
API & Integrations
Application Development
AI Expert
Strategic Consulting
I design and build production-ready SaaS and internal tools using LokoAI, with a strong focus on automation, scalability, and clean UX.
Languages: French, English
From $5K
$148/hr
Contact
Altrium Advisory
Altrium Advisory
Sydney, Australia
LinkedIn
Application Development
UI/UX Design
API & Integrations
AI Expert
+3
Altrium Advisory partners with leaders to unlock clarity, elevate decisions, and accelerate transformation.
Languages: English
From $1K
$125/hr
Contact
Paul David
Paul David
Liverpool, United Kingdom
LinkedIn
UI/UX Design
API & Integrations
AI Expert
Application Development
+4
Built 20+ commercial apps with LokoAI. I can help with project delivery, debugging, API integrations, and ongoing technical assistance.
Languages: English
From $100
$50/hr
Contact
`;

function cleanUrl(value: string) {
  if (!value) return undefined;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

function parsePartners(raw: string): Partner[] {
  const blocks = raw
    .split(/\nContact\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  return blocks.map((block) => {
    const lines = block
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const name = lines.shift() || "Unnamed Partner";
    if (lines[0] === name) lines.shift();

    const location = lines.shift() || "";
    let website: string | undefined;
    let linkedin: string | undefined;
    const tags: string[] = [];
    const descriptionParts: string[] = [];
    let languages: string[] = [];
    let startingFrom: string | undefined;
    let hourlyRate: string | undefined;

    for (const line of lines) {
      if (line === "LinkedIn") {
        linkedin = "https://linkedin.com";
        continue;
      }

      if (!website && line.includes(".") && !line.includes(" ") && !line.startsWith("Languages:")) {
        website = cleanUrl(line);
        continue;
      }

      if (KNOWN_TAGS.has(line)) {
        tags.push(line);
        continue;
      }

      if (line.startsWith("+")) {
        continue;
      }

      if (line.startsWith("Languages:")) {
        languages = line
          .replace("Languages:", "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean);
        continue;
      }

      if (line.startsWith("From ")) {
        startingFrom = line.replace("From ", "");
        continue;
      }

      if (/^\$[\d.,Kk]+(?:\/hr)?$/i.test(line)) {
        hourlyRate = line;
        continue;
      }

      descriptionParts.push(line);
    }

    return {
      name,
      location,
      website,
      linkedin,
      tags,
      description: descriptionParts.join(" "),
      languages,
      startingFrom,
      hourlyRate,
    };
  });
}

export const partners: Partner[] = parsePartners(partnerDirectoryRaw);
