import { storage } from './storage';

async function seedDatabase() {
  try {
    console.log('Starting database seeding...');
    await storage.seed();
    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    process.exit(0);
  }
}

seedDatabase();