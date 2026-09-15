
import type { LucideIcon } from 'lucide-react';
import { Brain, Database, Code2, Settings, TrendingUp, Cloud, Briefcase, ShieldCheck, Users, Target, GraduationCap, Award, Lightbulb, Mail, Linkedin, Globe, Instagram, Github, Home, FileText, CloudSun, AppWindow, Rocket } from 'lucide-react'; // Added AppWindow, Rocket

export interface Skill {
  name: string;
  description?: string;
  icon: LucideIcon;
}

export interface Experience {
  role: string;
  company: string;
  period: string;
  tasks: string[];
}

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  details: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  dataAiHint: string;
  liveLink?: string;
  repoLink?: string;
}


export const personalInfo = {
  name: "Nitai Baboolal",
  shortName: "Nitai B.",
  title: "Cloud FinOps Analyst | Analytics Engineer",
  email: "baboolalnitai@gmail.com",
  linkedin: "https://www.linkedin.com/in/nitai-b/",
  website: "https://nitai.pro",
  instagramUrl: "https://www.instagram.com/nitaib1",
  githubUrl: "https://github.com/NitaiB1",
  credlyUrl: "https://www.credly.com/users/nitai-baboolal", // Added Credly URL
  profileImageUrl: "/profile.png",
  profileImageHint: "professional headshot",
  resumeUrl: "/nbaboolal.docx",
};

export const aboutMe = `Driven by a passion for optimizing cloud costs and delivering strategic insights, I am a seasoned Cloud FinOps Analyst with an Analytics Engineering secondment and a Postgraduate Diploma in Industrial Engineering (Data Science) from Stellenbosch University. Throughout my career, I have harnessed advanced analytics, machine learning, and cloud computing to architect and implement cost-effective solutions across AWS, GCP, and Azure environments. At The Shoprite Group, I developed and deployed predictive cost-forecasting models and automated anomaly-detection pipelines using AWS Lambda, Cost Explorer, EventBridge, and SES, resulting in a proactive FinOps framework that improved budget oversight and delivered measurable savings. My tenure at ShopriteX involved leading cross-account Terraform migrations and refactoring Airflow DAGs and AWS Glue jobs, ensuring seamless infrastructure transitions.
I complement my practical experience with robust quantitative research skills as the Chief Quantitative Researcher at NPro Technology, where I design and back-test trading strategies in commodities and foreign-exchange markets. My technical toolkit includes Python, SQL, BigQuery, Athena, PowerBI, and industry-standard machine-learning libraries. Adept at translating complex data findings into actionable business recommendations, I excel in collaborating with multidisciplinary teams to drive operational excellence, enhance financial performance, and align technology solutions with organizational goals. I hold 15 industry certifications.`;

export const skills: Skill[] = [
  { name: "Machine Learning", description: "RandomForests, GradientBoost, Ensemble techniques", icon: Brain },
  { name: "Data Analytics", description: "Automated Data ETL and Visualization", icon: Database },
  { name: "Software Development", description: "Web Development", icon: Code2 },
  { name: "Software Engineering & System Automation", description: "Cost anomaly detection", icon: Settings },
  { name: "Quantitative Analytics", description: "Trading", icon: TrendingUp },
  { name: "Cloud Computing", description: "AWS, GCP, Azure", icon: Cloud },
  { name: "Project Management", icon: Briefcase },
  { name: "Cyber Security", icon: ShieldCheck },
  { name: "Agile Methodologies", icon: Users },
  { name: "Optimization", icon: Target },
];

export const experiences: Experience[] = [
  {
    role: "Cloud Financial Operations Analyst",
    company: "The Shoprite Group of Companies",
    period: "March 2024 - Present",
    tasks: [
      "Implemented Machine Learning Models to forecast business unit costs.",
      "Engineered AWS Lambda solution to query AWS Cost Explorer for cost anomaly detection triggered by Event Bridge and sent using SES.",
      "Developed and deployed custom FinOps automation tools using AWS Lambda for idle instance detection, helping reduce unnecessary compute costs.",
      "Leveraged BigQuery to automate early-warning cost detection, enabling proactive financial interventions and improved budget oversight.",
      "Executed ad-hoc SQL queries via AWS Athena/Big Query to extract actionable insights into team-specific cloud spending patterns.",
      "Built AWS Cost Explorer reports to reduce time taken for Data and Analytics cost reporting.",
      "Monitored daily cloud expenditures and prepared comprehensive weekly and monthly reports for senior management review.",
      "Analysed cloud usage data to collate, prioritize, and recommend optimization strategies, identifying significant potential savings.",
      "Provided expert guidance on cloud cost optimization strategies—including rightsizing and power scheduling—to drive cost reduction initiatives.",
      "Collaborated closely with Engineering teams to implement best practices and actionable cost optimization recommendations.",
      "Prepared detailed quotations for AWS system modifications, supporting informed decision-making and effective budget management.",
    ],
  },
  {
    role: "Chief Quantitative researcher, engineer & founder",
    company: "NPro Technology",
    period: "September 2024 - Present",
    tasks: [
      "Discovering Alpha opportunities within Commodities and Foreign Exchange markets.",
      "Creating trading strategies based on Risk Management profiles.",
      "Development and Back Testing of predictive models.",
    ],
  },
  {
    role: "Junior Financial Operations Analyst",
    company: "OneNebula",
    period: "January 2023 – Feb 2024",
    tasks: [
      "Analysed cloud expense data across both AWS and Azure environments to uncover actionable cost-saving opportunities.",
      "Developed intuitive PowerBI dashboards tailored to client specifications for enhanced visibility into cloud spending.",
      "Delivered clear, data-driven presentations of key findings and cost optimization strategies to clients.",
      "Utilized SQL and Python scripts to find abnormalities within the data.",
      "Provided strategic rightsizing recommendations to optimize resource allocation and reduce unnecessary cloud spending.",
    ],
  },
  {
    role: "Data Analyst",
    company: "Brainnest",
    period: "March 2022 – April 2022",
    tasks: [
      "Conducted analysis on large data sets to identify patterns, trends, emerging behaviors, etc.",
      "Applied advanced statistical data analysis methods.",
      "Collaborated with members of the department and internal customers in ongoing decisions regarding data collections, data analysis and methodology.",
      "Gathered data from multiple sources and cohesively compile and create automated dashboards using SPSS.",
      "Compared results from one group of people with results from one or more other groups (t-test and ANOVA).",
      "Calculating correlation coefficient for finding relationships in the data.",
    ],
  },
];

export const education: EducationItem[] = [
  {
    degree: "PGDip (Eng) Industrial Engineering (Data Science)",
    institution: "Stellenbosch University",
    period: "2024 - 2025",
    details: [
      "Applied Machine Learning",
      "Optimisation",
      "Big Data",
      "Data Analytics",
    ],
  },
  {
    degree: "Bachelor of Information and Communications Technology",
    institution: "Durban University of Technology",
    period: "2022",
    details: [
      "18 Distinctions",
      "77% & 75% average in second and third year",
      "BankSeta bursary",
    ],
  },
];

export const certifications: Certification[] = [
  { name: "AWS Certified Machine Learning Specialty" },
  { name: "IBM Advanced Deep Learning Specialist" },
  { name: "AWS Certified Cloud Practitioner" },
  { name: "IBM Deep Learning with PyTorch" },
  { name: "IBM Deep Learning with Keras and Tensorflow" },
  { name: "IBM Introduction to Deep Learning and Neural Networks with Keras" },
  { name: "Microsoft Certified Azure Fundamentals" },
  { name: "Microsoft Certified: Security Compliance and Identity Fundamentals" },
  { name: "IBM DevOps, Cloud, and Agile Foundations" },
  { name: "University of California: San Diego Algorithmic Toolbox" },
];

export const projects: Project[] = [
  {
    title: "NRECON — Cyber Reconnaissance & Global Intelligence Platform",
    description: "The premier open-source cyber reconnaissance and intelligence platform. Track 10,000+ aircraft, 2,000 satellites, and worldwide CCTV cameras in real-time on a 3D globe. Built with port scanners, DNS lookups, WHOIS queries, SSL certificate analysis, subdomains, and 20+ live threat telemetry feeds.",
    tags: ["Cybersecurity", "OSINT", "Cloud Run", "Next.js", "Threat Intelligence", "3D Globe"],
    imageUrl: "/nrecon.png",
    dataAiHint: "cyber reconnaissance intelligence globe",
    liveLink: "https://nrecon-220354660616.us-central1.run.app/",
    repoLink: undefined,
  },
  {
    title: "Predictive Cloud Cost Forecasting & Anomaly Detection",
    description: "Engineered ML models and AWS Lambda solutions for proactive cloud cost forecasting and anomaly detection, significantly improving budget oversight for The Shoprite Group.",
    tags: ["AWS", "Machine Learning", "Python", "FinOps", "Lambda", "Cost Explorer"],
    imageUrl: "https://placehold.co/600x401.png",
    dataAiHint: "cloud dashboard",
    liveLink: undefined,
    repoLink: undefined,
  },
  {
    title: "FinOps Automation Tools",
    description: "Developed custom AWS Lambda tools for identifying idle cloud resources, contributing to notable reductions in compute costs.",
    tags: ["AWS", "Python", "Automation", "FinOps", "Lambda"],
    imageUrl: "https://placehold.co/600x402.png",
    dataAiHint: "server optimization",
  },
  {
    title: "Quantitative Trading Strategies",
    description: "Designed, developed, and back-tested predictive models and trading strategies for commodity and foreign exchange markets at NPro Technology.",
    tags: ["Quantitative Finance", "Python", "Machine Learning", "Trading"],
    imageUrl: "https://placehold.co/600x403.png",
    dataAiHint: "financial charts",
  },
];


export const sectionIcons = {
  home: Home,
  about: Users,
  apps: AppWindow,
  skills: Target,
  experience: Briefcase,
  education: GraduationCap,
  certifications: Award,
  projects: Lightbulb,
  contact: Mail,
  resume: FileText, 
  weather: CloudSun,
  astroworld: Rocket,
};

export const getIconForSection = (id: string): LucideIcon => {
  switch (id) {
    case 'hero': 
    case 'home':
      return sectionIcons.home;
    case 'about':
      return sectionIcons.about;
    case 'apps':
      return sectionIcons.apps;
    case 'skills':
      return sectionIcons.skills;
    case 'experience':
      return sectionIcons.experience;
    case 'education':
      return sectionIcons.education;
    case 'certifications':
      return sectionIcons.certifications;
    case 'projects':
      return sectionIcons.projects;
    case 'contact':
      return sectionIcons.contact;
    case 'weather': 
      return sectionIcons.weather;
    case 'astroworld':
      return sectionIcons.astroworld;
    default:
      return Lightbulb; 
  }
};
