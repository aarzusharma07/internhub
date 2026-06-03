// Mock data for demo/prototype mode - used when backend is not connected
export const MOCK_INTERNSHIPS = [
  { _id: '1', title: 'Frontend Developer Intern', description: 'Build modern React UIs for our SaaS platform. Work with senior engineers on real features shipped to thousands of users.', stipend: 15000, duration: '3 Months', location: 'Bangalore', locationType: 'hybrid', skillsRequired: ['React', 'TypeScript', 'Tailwind CSS'], category: 'Engineering', openings: 3, applicationsCount: 47, deadline: '2024-08-01', isActive: true, companyId: { _id: 'c1', companyName: 'TechNova Labs', logo: '', industry: 'SaaS', location: 'Bangalore' } },
  { _id: '2', title: 'Data Science Intern', description: 'Analyze large datasets, build ML models, and present insights to the product team. Real-world ML experience guaranteed.', stipend: 20000, duration: '6 Months', location: 'Remote', locationType: 'remote', skillsRequired: ['Python', 'Pandas', 'Scikit-learn', 'SQL'], category: 'Data Science', openings: 2, applicationsCount: 89, deadline: '2024-07-15', isActive: true, companyId: { _id: 'c2', companyName: 'DataMind AI', logo: '', industry: 'Artificial Intelligence', location: 'Remote' } },
  { _id: '3', title: 'UI/UX Design Intern', description: 'Design user-centered experiences for mobile and web. Create wireframes, prototypes, and final high-fidelity screens in Figma.', stipend: 12000, duration: '3 Months', location: 'Mumbai', locationType: 'onsite', skillsRequired: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], category: 'Design', openings: 2, applicationsCount: 62, deadline: '2024-08-15', isActive: true, companyId: { _id: 'c3', companyName: 'PixelCraft Studio', logo: '', industry: 'Design Agency', location: 'Mumbai' } },
  { _id: '4', title: 'Backend Engineer Intern', description: 'Develop scalable Node.js APIs, work with MongoDB and Redis. Learn system design from experienced backend engineers.', stipend: 18000, duration: '6 Months', location: 'Hyderabad', locationType: 'hybrid', skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis'], category: 'Engineering', openings: 4, applicationsCount: 54, deadline: '2024-07-30', isActive: true, companyId: { _id: 'c4', companyName: 'CloudStack Inc', logo: '', industry: 'Cloud Computing', location: 'Hyderabad' } },
  { _id: '5', title: 'Product Management Intern', description: 'Own product features end-to-end. Write PRDs, run user interviews, work with design and engineering to ship great products.', stipend: 25000, duration: '6 Months', location: 'Delhi', locationType: 'hybrid', skillsRequired: ['Product Strategy', 'Agile', 'Jira', 'Analytics'], category: 'Product', openings: 1, applicationsCount: 128, deadline: '2024-07-20', isActive: true, companyId: { _id: 'c5', companyName: 'GrowthOS', logo: '', industry: 'Product SaaS', location: 'Delhi' } },
  { _id: '6', title: 'DevOps Intern', description: 'Learn CI/CD pipelines, containerization with Docker & Kubernetes, and cloud deployment on AWS.', stipend: 16000, duration: '3 Months', location: 'Remote', locationType: 'remote', skillsRequired: ['Docker', 'Kubernetes', 'AWS', 'CI/CD'], category: 'Engineering', openings: 2, applicationsCount: 31, deadline: '2024-08-10', isActive: true, companyId: { _id: 'c6', companyName: 'InfraFlow', logo: '', industry: 'DevOps', location: 'Remote' } },
  { _id: '7', title: 'Mobile App Developer Intern', description: 'Build cross-platform mobile apps using React Native. Ship features to 100K+ active users.', stipend: 14000, duration: '4 Months', location: 'Pune', locationType: 'onsite', skillsRequired: ['React Native', 'JavaScript', 'Firebase'], category: 'Engineering', openings: 2, applicationsCount: 43, deadline: '2024-08-20', isActive: true, companyId: { _id: 'c7', companyName: 'AppSphere', logo: '', industry: 'Mobile Tech', location: 'Pune' } },
  { _id: '8', title: 'Content & Growth Intern', description: 'Create SEO content, run social campaigns, analyze growth metrics, and drive user acquisition for our B2B platform.', stipend: 10000, duration: '3 Months', location: 'Remote', locationType: 'remote', skillsRequired: ['Content Writing', 'SEO', 'Analytics', 'Social Media'], category: 'Marketing', openings: 3, applicationsCount: 76, deadline: '2024-09-01', isActive: true, companyId: { _id: 'c8', companyName: 'ScaleUp Media', logo: '', industry: 'Growth Marketing', location: 'Remote' } },
];

export const MOCK_APPLICATIONS = [
  { _id: 'a1', status: 'shortlisted', appliedDate: '2024-06-15', internshipId: MOCK_INTERNSHIPS[0] },
  { _id: 'a2', status: 'interview_scheduled', appliedDate: '2024-06-10', interviewDate: '2024-07-05', internshipId: MOCK_INTERNSHIPS[1] },
  { _id: 'a3', status: 'applied', appliedDate: '2024-06-20', internshipId: MOCK_INTERNSHIPS[2] },
  { _id: 'a4', status: 'offered', appliedDate: '2024-05-28', internshipId: MOCK_INTERNSHIPS[4] },
];

export const MOCK_NOTIFICATIONS = [
  { _id: 'n1', title: 'You have been Shortlisted! 🎉', message: 'TechNova Labs shortlisted you for Frontend Developer Intern', type: 'shortlist', isRead: false, createdAt: '2024-06-20' },
  { _id: 'n2', title: 'Interview Scheduled 📅', message: 'Interview for Data Science Intern on July 5th at 11:00 AM', type: 'interview', isRead: false, createdAt: '2024-06-18' },
  { _id: 'n3', title: 'Application Submitted ✅', message: 'Your application to PixelCraft Studio was submitted', type: 'application', isRead: true, createdAt: '2024-06-20' },
  { _id: 'n4', title: 'Offer Released! 🏆', message: 'GrowthOS has released an offer for you!', type: 'offer', isRead: true, createdAt: '2024-06-15' },
];

export const MOCK_STATS = {
  totalUsers: 1284,
  totalStudents: 1089,
  totalRecruiters: 187,
  totalInternships: 342,
  totalApplications: 4821,
  pendingCompanies: 8,
};

export const MOCK_APPLICANTS = [
  { _id: 'ap1', status: 'applied', appliedDate: '2024-06-18', recruiterScore: null, studentId: { userId: { name: 'Priya Sharma', email: 'priya@email.com' }, skills: ['React', 'TypeScript'], college: 'IIT Delhi', profileStrength: 85, badges: ['Resume Ready', 'Skilled'] }, internshipId: { title: 'Frontend Developer Intern' } },
  { _id: 'ap2', status: 'shortlisted', appliedDate: '2024-06-15', recruiterScore: 8, studentId: { userId: { name: 'Arjun Mehta', email: 'arjun@email.com' }, skills: ['React', 'JavaScript', 'CSS'], college: 'BITS Pilani', profileStrength: 92, badges: ['Resume Ready', 'Skilled', 'Verified Student'] }, internshipId: { title: 'Frontend Developer Intern' } },
  { _id: 'ap3', status: 'interview_scheduled', appliedDate: '2024-06-12', recruiterScore: 9, studentId: { userId: { name: 'Sneha Reddy', email: 'sneha@email.com' }, skills: ['React', 'Next.js', 'TypeScript'], college: 'NIT Warangal', profileStrength: 96, badges: ['Resume Ready', 'Skilled', 'Verified Student', 'LinkedIn Connected'] }, internshipId: { title: 'Frontend Developer Intern' } },
  { _id: 'ap4', status: 'applied', appliedDate: '2024-06-20', recruiterScore: null, studentId: { userId: { name: 'Karan Patel', email: 'karan@email.com' }, skills: ['JavaScript', 'Vue.js'], college: 'VIT Vellore', profileStrength: 70, badges: ['Resume Ready'] }, internshipId: { title: 'Frontend Developer Intern' } },
];

export const MOCK_ANALYTICS = {
  applicationsByStatus: [
    { _id: 'applied', count: 2104 },
    { _id: 'shortlisted', count: 893 },
    { _id: 'interview_scheduled', count: 412 },
    { _id: 'offered', count: 198 },
    { _id: 'rejected', count: 1102 },
    { _id: 'completed', count: 112 },
  ],
  internshipsByCategory: [
    { _id: 'Engineering', count: 142 },
    { _id: 'Design', count: 67 },
    { _id: 'Data Science', count: 54 },
    { _id: 'Product', count: 38 },
    { _id: 'Marketing', count: 41 },
  ],
  monthlyRegistrations: [
    { month: 'Jan', students: 89, recruiters: 12 },
    { month: 'Feb', students: 124, recruiters: 18 },
    { month: 'Mar', students: 178, recruiters: 24 },
    { month: 'Apr', students: 201, recruiters: 31 },
    { month: 'May', students: 243, recruiters: 38 },
    { month: 'Jun', students: 254, recruiters: 44 },
  ],
};

export const CATEGORIES = ['Engineering', 'Design', 'Data Science', 'Product', 'Marketing', 'Finance', 'Operations', 'HR'];
export const SKILLS_LIST = ['React', 'Node.js', 'Python', 'Java', 'TypeScript', 'Figma', 'SQL', 'AWS', 'Docker', 'MongoDB', 'Machine Learning', 'Product Management'];
