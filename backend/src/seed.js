require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Expert = require('./models/Expert');
const Booking = require('./models/Booking');

function generateSlots(daysAhead = 7) {
  const slots = [];
  const times = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00',
  ];

  for (let d = 1; d <= daysAhead; d++) {
    const date = new Date();
    date.setDate(date.getDate() + d);
    const dateStr = date.toISOString().split('T')[0];

    const shuffled = [...times].sort(() => 0.5 - Math.random());
    const selectedTimes = shuffled.slice(0, 6 + Math.floor(Math.random() * 6));
    selectedTimes.sort();

    selectedTimes.forEach(time => {
      slots.push({ date: dateStr, time, isBooked: false });
    });
  }

  return slots;
}

const experts = [
  { name: 'Dr. Sarah Chen', category: 'Technology', experience: 12, rating: 4.9, bio: 'AI/ML researcher with 12 years of experience at leading tech companies. Specializes in deep learning, NLP, and building production ML systems.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SarahChen' },
  { name: 'James Mitchell', category: 'Business', experience: 15, rating: 4.8, bio: 'Serial entrepreneur and business strategist who has founded 3 successful startups. Expert in go-to-market strategy and fundraising.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=JamesMitchell' },
  { name: 'Dr. Priya Sharma', category: 'Health', experience: 18, rating: 4.7, bio: 'Board-certified physician and wellness consultant specializing in holistic health, stress management, and corporate wellness programs.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=PriyaSharma' },
  { name: 'Robert Kim', category: 'Education', experience: 10, rating: 4.6, bio: 'Education technology specialist and curriculum designer. Helped 500+ students achieve their academic goals.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=RobertKim' },
  { name: 'Elena Rodriguez', category: 'Finance', experience: 14, rating: 4.9, bio: 'CFA charterholder and financial planning expert. Specializes in portfolio management and retirement planning.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElenaRodriguez' },
  { name: 'Marcus Thompson', category: 'Design', experience: 9, rating: 4.5, bio: 'Award-winning UI/UX designer with experience at Airbnb and Figma. Passionate about design systems and accessibility.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MarcusThompson' },
  { name: 'Lisa Wang', category: 'Technology', experience: 8, rating: 4.7, bio: 'Full-stack architect specializing in cloud-native applications, microservices, and DevOps. AWS Solutions Architect certified.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=LisaWang' },
  { name: 'David Okafor', category: 'Business', experience: 20, rating: 4.8, bio: 'Management consultant and executive coach with Fortune 500 experience. Specializes in leadership development.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DavidOkafor' },
  { name: 'Dr. Anna Petrov', category: 'Health', experience: 16, rating: 4.6, bio: 'Clinical psychologist and mental health advocate. Expert in cognitive behavioral therapy and mindfulness.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=AnnaPetrov' },
  { name: 'Kevin Nakamura', category: 'Finance', experience: 11, rating: 4.4, bio: 'Fintech entrepreneur and quantitative analyst. Expert in algorithmic trading and blockchain technology.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=KevinNakamura' },
  { name: 'Sophie Laurent', category: 'Design', experience: 13, rating: 4.8, bio: 'Brand identity specialist and creative director. Has designed visual identities for 100+ startups and established brands.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=SophieLaurent' },
  { name: 'Prof. Michael Adams', category: 'Education', experience: 22, rating: 4.9, bio: 'Professor of Computer Science and online education pioneer. Created courses taken by 2M+ students globally.', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=MichaelAdams' },
];

async function seed() {
  try {
    await connectDB();
    console.log('Clearing existing data...');
    await Expert.deleteMany({});
    await Booking.deleteMany({});

    console.log('Seeding experts...');
    const expertsWithSlots = experts.map(expert => ({
      ...expert,
      availableSlots: generateSlots(7),
    }));

    await Expert.insertMany(expertsWithSlots);
    console.log(`Seeded ${experts.length} experts with time slots!`);
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
}

seed();
