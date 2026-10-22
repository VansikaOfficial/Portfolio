export interface AchievementItem {
  title: string;
  description: string;
  year: string;
  icon: string; // lucide icon name via react-icons/lu
}

export const achievements: AchievementItem[] = [
  {
    title: 'Top performer, Data Analytics Bootcamp',
    description: 'Ranked in the top 5% of participants for the capstone data pipeline project.',
    year: '2025',
    icon: 'LuTrophy',
  },
  {
    title: 'Published Kaggle notebook, 500+ upvotes',
    description: 'An end-to-end feature engineering notebook adopted by the community as a reference guide.',
    year: '2025',
    icon: 'LuMedal',
  },
  {
    title: 'Hackathon winner — Best Use of Data',
    description: 'Led a team of four to build a real-time anomaly detection tool in 24 hours.',
    year: '2024',
    icon: 'LuAward',
  },
  {
    title: 'Speaker, University Data Science Meetup',
    description: 'Presented on practical feature engineering techniques to an audience of 150+ students.',
    year: '2024',
    icon: 'LuMic',
  },
];
