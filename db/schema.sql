-- db/schema.sql

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast lookup by slug
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Stations Table
CREATE TABLE IF NOT EXISTS stations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    stream_url TEXT NOT NULL,
    cover_image_url TEXT,
    category_id INTEGER,
    is_featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Index for filtering by category
CREATE INDEX IF NOT EXISTS idx_stations_category_id ON stations(category_id);

-- Index for quickly finding featured stations
CREATE INDEX IF NOT EXISTS idx_stations_is_featured ON stations(is_featured);
