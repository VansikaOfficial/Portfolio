export interface ServiceItem {
  title: string;
  description: string;
  icon: string; // lucide icon name via react-icons/lu
  deliverables: string[];
}

export const services: ServiceItem[] = [
  {
    title: 'Data Analysis & Reporting',
    description:
      'Turning raw, messy data into clear dashboards and reports that help teams make faster, better-informed decisions.',
    icon: 'LuBarChart3',
    deliverables: ['Exploratory data analysis', 'Interactive dashboards', 'Automated reporting pipelines'],
  },
  {
    title: 'Machine Learning Systems',
    description:
      'Designing and shipping ML models — from problem framing and feature engineering to deployment and monitoring.',
    icon: 'LuBrainCircuit',
    deliverables: ['Predictive modeling', 'Model evaluation & tuning', 'Production deployment (API/batch)'],
  },
  {
    title: 'Data Engineering & Pipelines',
    description:
      'Building reliable ETL/ELT pipelines that keep data clean, fresh, and ready for analysis or modeling.',
    icon: 'LuWorkflow',
    deliverables: ['ETL pipeline design', 'Data warehouse modeling', 'Workflow orchestration'],
  },
  {
    title: 'AI Product Consulting',
    description:
      'Advising teams on where AI genuinely adds value, and how to integrate it responsibly and cost-effectively.',
    icon: 'LuSparkles',
    deliverables: ['Feasibility assessment', 'Architecture recommendations', 'Proof-of-concept builds'],
  },
];
