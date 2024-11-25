CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE facts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fact TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fact_votes (
    id SERIAL PRIMARY KEY,
    fact_id INTEGER REFERENCES facts(id),
    user_id INTEGER REFERENCES users(id);
    vote_type VARCHAR(10), -- 'upvote' or 'downvote'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fact_id, user_id)
);

CREATE TABLE fact_views (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    fact_id INTEGER REFERENCES facts(id),
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, fact_id)
);
