import pool from './database';

export async function initDatabase() {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS files (
      id UUID PRIMARY KEY,
      original_filename VARCHAR(255) NOT NULL,
      file_size BIGINT NOT NULL,
      mime_type VARCHAR(100),
      storage_key VARCHAR(255) NOT NULL,
      upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      expiry_date TIMESTAMP,
      download_count INTEGER DEFAULT 0
    );
  `;

  try {
    await pool.query(createTableQuery);
    console.log('Database table initialized successfully');
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
}