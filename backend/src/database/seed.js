import { db } from '../models/database.js';
import { logger } from '../utils/logger.js';

async function runSeed() {
  logger.info('Running CX Intelligence database seed script...');

  const businesses = await db.findMany('businesses');
  const profiles = await db.findMany('profiles');
  const customers = await db.findMany('customers');
  const tickets = await db.findMany('tickets');
  const articles = await db.findMany('knowledge_articles');
  const products = await db.findMany('products');

  logger.info(`Seeded data status:`);
  logger.info(`- Businesses: ${businesses.length}`);
  logger.info(`- Profiles (Admins/Agents): ${profiles.length}`);
  logger.info(`- Customers: ${customers.length}`);
  logger.info(`- Tickets: ${tickets.length}`);
  logger.info(`- Knowledge Articles: ${articles.length}`);
  logger.info(`- Products: ${products.length}`);
  logger.info('Database seeding completed successfully!');
}

runSeed().catch(err => {
  logger.error('Error during database seed:', err);
  process.exit(1);
});
