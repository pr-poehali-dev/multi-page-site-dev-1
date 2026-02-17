CREATE TABLE t_p31590366_multi_page_site_dev_.versions (
    id SERIAL PRIMARY KEY,
    version VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    type VARCHAR(10) NOT NULL CHECK (type IN ('major', 'minor', 'patch')),
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    full_description TEXT,
    changes TEXT[] NOT NULL DEFAULT '{}',
    files JSONB NOT NULL DEFAULT '[]',
    author_id INTEGER REFERENCES t_p31590366_multi_page_site_dev_.users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_versions_date ON t_p31590366_multi_page_site_dev_.versions(date DESC);
CREATE INDEX idx_versions_type ON t_p31590366_multi_page_site_dev_.versions(type);