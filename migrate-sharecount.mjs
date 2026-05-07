import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('://')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'blog',
});

try {
  await connection.execute('ALTER TABLE articles ADD COLUMN shareCount int DEFAULT 0');
  console.log('✓ shareCount column added successfully');
} catch (error) {
  if (error.code === 'ER_DUP_FIELDNAME') {
    console.log('✓ shareCount column already exists');
  } else {
    console.error('Error:', error.message);
  }
}

await connection.end();
