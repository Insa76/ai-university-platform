const { Pool } = require('pg');
const redis = require('redis');

// Conexiones
const oldDb = new Pool({
  connectionString: process.env.OLD_DATABASE_URL
});

const newDb = new Pool({
  connectionString: process.env.NEW_DATABASE_URL
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

async function migrateUsers() {
  console.log('🔄 Migrating users...');
  
  const { rows: users } = await oldDb.query('SELECT * FROM users');
  
  for (const user of users) {
    await newDb.query(
      `INSERT INTO users (id, name, email, password, role, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        user.id,
        user.name,
        user.email,
        user.password,
        user.role || 'student',
        user.is_active,
        user.created_at,
        user.updated_at
      ]
    );
  }
  
  console.log(`✅ Migrated ${users.length} users`);
}

async function migrateCourses() {
  console.log('🔄 Migrating courses...');
  
  const { rows: courses } = await oldDb.query('SELECT * FROM courses');
  
  for (const course of courses) {
    await newDb.query(
      `INSERT INTO courses (id, title, description, duration, credits, difficulty, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        course.id,
        course.title,
        course.description,
        course.duration,
        course.credits,
        course.difficulty,
        course.is_active,
        course.created_at,
        course.updated_at
      ]
    );
  }
  
  console.log(`✅ Migrated ${courses.length} courses`);
}

async function main() {
  try {
    await redisClient.connect();
    console.log('✅ Connected to Redis');
    
    await migrateUsers();
    await migrateCourses();
    
    console.log('🎉 Migration completed successfully!');
    
    await oldDb.end();
    await newDb.end();
    await redisClient.quit();
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { migrateUsers, migrateCourses };