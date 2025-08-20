// src/seeding/mongo-seed.ts
import { faker } from '@faker-js/faker';
import { MongoClient } from 'mongodb';
import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'global_expansion_management';

async function seed() {
  // 1️⃣ Connect to MySQL via mysql2 (no TypeORM needed)
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  const [rows] = await connection.execute('SELECT id FROM project');
  const projectIds = (rows as any[]).map((r) => r.id);
  await connection.end();

  if (projectIds.length === 0) {
    console.warn('⚠️ No projects found in MySQL. Exiting seed.');
    return;
  }

  // 2️⃣ Connect to MongoDB
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  // Optional: clear existing docs
  await db.collection('researchdocuments').deleteMany({});

  // 3️⃣ Generate 50 fake research documents linked to real project IDs
  const docs = Array.from({ length: 50 }).map(() => ({
    projectId: faker.helpers.arrayElement(projectIds),
    title: faker.lorem.sentence(),
    content: faker.lorem.paragraphs({ min: 1, max: 3 }),
    tags: faker.helpers.arrayElements(['AI', 'ML', 'Blockchain', 'Web3', 'Health', 'Finance']),
    createdAt: new Date(),
    updatedAt: new Date(),
  }));

  await db.collection('researchdocuments').insertMany(docs);

  console.log('✅ ResearchDocument seeding done!');
  await client.close();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
