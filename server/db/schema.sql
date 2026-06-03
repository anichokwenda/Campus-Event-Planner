CREATE TABLE events(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50),
    event_date DATE NOT NULL,
    lat DECIMAL(10, 8) NOT NULL,
    LNG DECIMAL(11, 8) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_event_date ON events(event_date);
CREATE INDEX idx_category ON events(category);
