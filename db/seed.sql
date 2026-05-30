-- db/seed.sql

-- Clear existing data if necessary (optional, but good for idempotency)
DELETE FROM stations;
DELETE FROM categories;
-- Reset auto-increment counters
DELETE FROM sqlite_sequence WHERE name='stations' OR name='categories';

-- Insert Categories
INSERT INTO categories (name, slug) VALUES 
('LoFi', 'lofi'),
('Chillhop', 'chillhop'),
('Ambient', 'ambient');

-- Insert Stations
-- Category IDs: 1 = LoFi, 2 = Chillhop, 3 = Ambient
-- We use reliable SomaFM public streams as safe placeholders for development
INSERT INTO stations (name, description, stream_url, cover_image_url, category_id, is_featured) VALUES 
('Hush Beats', 'The signature Hush Cafe sound. Smooth, continuous beats to help you focus and relax.', 'https://ice1.somafm.com/defcon-128-mp3', NULL, 1, 1),
('Night Cafe', 'Late night vibes. Downtempo rhythms perfect for after-hours coding sessions.', 'https://ice1.somafm.com/groovesalad-128-mp3', NULL, 1, 0),
('Rainy Study', 'Mellow beats mixed with atmospheric sounds. Create your own cozy study environment.', 'https://ice1.somafm.com/dronezone-128-mp3', NULL, 3, 1),
('Midnight Loops', 'Endless atmospheric loops for uninterrupted concentration.', 'https://ice1.somafm.com/deepspaceone-128-mp3', NULL, 2, 0),
('Coffee & Coding', 'Smooth electronic chillhop to keep your energy steady throughout the workday.', 'https://ice1.somafm.com/spacestation-128-mp3', NULL, 2, 0);
