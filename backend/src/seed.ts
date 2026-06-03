import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Student from './models/Student';
import Company from './models/Company';
import Internship from './models/Internship';
import Application from './models/Application';
import Notification from './models/Notification';

dotenv.config();

const MOCK_INTERNSHIPS_DATA = [
  { title: 'Frontend Developer Intern', description: 'Build modern React UIs for our SaaS platform. Work with senior engineers on real features shipped to thousands of users.', stipend: 15000, duration: '3 Months', location: 'Bangalore', locationType: 'hybrid' as const, skillsRequired: ['React', 'TypeScript', 'Tailwind CSS'], category: 'Engineering', openings: 3, applicationsCount: 4, deadline: new Date('2026-08-01') },
  { title: 'Data Science Intern', description: 'Analyze large datasets, build ML models, and present insights to the product team. Real-world ML experience guaranteed.', stipend: 20000, duration: '6 Months', location: 'Remote', locationType: 'remote' as const, skillsRequired: ['Python', 'Pandas', 'Scikit-learn', 'SQL'], category: 'Data Science', openings: 2, applicationsCount: 0, deadline: new Date('2026-07-15') },
  { title: 'UI/UX Design Intern', description: 'Design user-centered experiences for mobile and web. Create wireframes, prototypes, and final high-fidelity screens in Figma.', stipend: 12000, duration: '3 Months', location: 'Mumbai', locationType: 'onsite' as const, skillsRequired: ['Figma', 'User Research', 'Prototyping', 'Design Systems'], category: 'Design', openings: 2, applicationsCount: 0, deadline: new Date('2026-08-15') },
  { title: 'Backend Engineer Intern', description: 'Develop scalable Node.js APIs, work with MongoDB and Redis. Learn system design from experienced backend engineers.', stipend: 18000, duration: '6 Months', location: 'Hyderabad', locationType: 'hybrid' as const, skillsRequired: ['Node.js', 'Express', 'MongoDB', 'Redis'], category: 'Engineering', openings: 4, applicationsCount: 0, deadline: new Date('2026-07-30') },
  { title: 'Product Management Intern', description: 'Own product features end-to-end. Write PRDs, run user interviews, work with design and engineering to ship great products.', stipend: 25000, duration: '6 Months', location: 'Delhi', locationType: 'hybrid' as const, skillsRequired: ['Product Strategy', 'Agile', 'Jira', 'Analytics'], category: 'Product', openings: 1, applicationsCount: 0, deadline: new Date('2026-07-20') }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI not defined in .env file');
    process.exit(1);
  }

  try {
    console.log(`Connecting to MongoDB at: ${uri}`);
    await mongoose.connect(uri);
    console.log('Connected to MongoDB. Clearing database...');

    // Clear collections
    await User.deleteMany({});
    await Student.deleteMany({});
    await Company.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});
    await Notification.deleteMany({});

    console.log('Database cleared. Seeding default users...');

    // 1. Create Users
    // Hashed passwords
    const studentPassword = await bcrypt.hash('password123', 12);
    const recruiterPassword = await bcrypt.hash('password123', 12);
    const adminPassword = await bcrypt.hash('password123', 12);

    const uStudent = await User.create({
      name: 'Priya Sharma',
      email: 'priya@demo.com',
      password: studentPassword,
      role: 'student',
      status: 'active'
    });

    const uRecruiter = await User.create({
      name: 'Rahul Mehta',
      email: 'hr@demo.com',
      password: recruiterPassword,
      role: 'recruiter',
      status: 'active'
    });

    const uAdmin = await User.create({
      name: 'Platform Admin',
      email: 'admin@demo.com',
      password: adminPassword,
      role: 'admin',
      status: 'active'
    });

    console.log('Users created. Seeding Student & Recruiter profiles...');

    // 2. Student Profile
    const studentProfile = await Student.create({
      userId: uStudent._id,
      phone: '9876543210',
      college: 'IIT Delhi',
      degree: 'B.Tech CS',
      year: '3rd Year',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js'],
      bio: 'Passionate developer interested in frontend, UI/UX, and cloud platforms.',
      profileStrength: 85,
      badges: ['Resume Ready', 'Skilled', 'Verified Student']
    });

    // 3. Company Profile
    const companyProfile = await Company.create({
      userId: uRecruiter._id,
      companyName: 'TechNova Labs',
      industry: 'Software & SaaS',
      description: 'Building the next generation of visual collaboration tools for remote teams.',
      website: 'https://technova.io',
      location: 'Bangalore, India',
      size: '50-100 employees',
      isApproved: true
    });

    // Create a pending recruiter user and company for testing the Admin dashboard
    const pendingRecruiterPassword = await bcrypt.hash('password123', 12);
    const uPendingRecruiter = await User.create({
      name: 'Alex Vance',
      email: 'careers@datamind.ai',
      password: pendingRecruiterPassword,
      role: 'recruiter',
      status: 'pending'
    });

    await Company.create({
      userId: uPendingRecruiter._id,
      companyName: 'DataMind AI',
      industry: 'Artificial Intelligence',
      description: 'Empowering enterprises with predictive AI workflows and large language models.',
      website: 'https://datamind.ai',
      location: 'Remote',
      size: '10-50 employees',
      isApproved: false
    });

    console.log('Profiles created. Seeding Internships...');

    // 4. Seeding Internships
    const internships = [];
    for (const data of MOCK_INTERNSHIPS_DATA) {
      const is = await Internship.create({
        ...data,
        companyId: companyProfile._id
      });
      internships.push(is);
    }

    console.log('Internships seeded. Seeding sample applications...');

    // Create student users for other applications
    const uStudent2 = await User.create({
      name: 'Arjun Mehta',
      email: 'arjun@email.com',
      password: studentPassword,
      role: 'student',
      status: 'active'
    });
    const studentProfile2 = await Student.create({
      userId: uStudent2._id,
      college: 'BITS Pilani',
      degree: 'B.E. EEE',
      year: '4th Year',
      skills: ['React', 'JavaScript', 'CSS'],
      profileStrength: 90,
      badges: ['Resume Ready', 'Skilled', 'Verified Student']
    });

    const uStudent3 = await User.create({
      name: 'Sneha Reddy',
      email: 'sneha@email.com',
      password: studentPassword,
      role: 'student',
      status: 'active'
    });
    const studentProfile3 = await Student.create({
      userId: uStudent3._id,
      college: 'NIT Warangal',
      degree: 'B.Tech IT',
      year: '3rd Year',
      skills: ['React', 'Next.js', 'TypeScript'],
      profileStrength: 95,
      badges: ['Resume Ready', 'Skilled', 'Verified Student', 'LinkedIn Connected']
    });

    // 5. Seeding Applications (for the first internship: Frontend Developer Intern)
    const firstInternship = internships[0];

    // Priya's Application
    await Application.create({
      studentId: studentProfile._id,
      internshipId: firstInternship._id,
      status: 'applied',
      appliedDate: new Date('2026-06-01')
    });

    // Arjun's Application (Shortlisted)
    await Application.create({
      studentId: studentProfile2._id,
      internshipId: firstInternship._id,
      status: 'shortlisted',
      recruiterScore: 8,
      recruiterNotes: 'Solid understanding of core JS. Dynamic developer.',
      appliedDate: new Date('2026-05-28')
    });

    // Sneha's Application (Interview Scheduled)
    await Application.create({
      studentId: studentProfile3._id,
      internshipId: firstInternship._id,
      status: 'interview_scheduled',
      recruiterScore: 9,
      interviewDate: new Date('2026-07-05T11:00:00'),
      recruiterNotes: 'Very strong portfolio. Next.js and TypeScript experience matches perfectly.',
      appliedDate: new Date('2026-05-25')
    });

    // 6. Seeding Notifications
    await Notification.create({
      userId: uStudent._id,
      title: 'Application Submitted ✅',
      message: 'Your application to TechNova Labs for Frontend Developer Intern was submitted successfully.',
      type: 'application',
      isRead: false
    });

    await Notification.create({
      userId: uStudent2._id,
      title: 'You have been Shortlisted! 🎉',
      message: 'TechNova Labs shortlisted you for Frontend Developer Intern.',
      type: 'shortlist',
      isRead: false
    });

    await Notification.create({
      userId: uStudent3._id,
      title: 'Interview Scheduled 📅',
      message: 'Interview for Frontend Developer Intern is scheduled for July 5th at 11:00 AM.',
      type: 'interview',
      isRead: false
    });

    console.log('🎉 Seeding successfully completed!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding database:', err);
    process.exit(1);
  }
}

seed();
