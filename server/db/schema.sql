CREATE TABLE facts (
    id SERIAL PRIMARY KEY,
    fact TEXT NOT NULL,
    upvotes INTEGER DEFAULT 0,
    downvotes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE fact_votes (
    id SERIAL PRIMARY KEY,
    fact_id INTEGER REFERENCES facts(id),
    user_id VARCHAR(255), -- This could be a session ID or user ID
    vote_type VARCHAR(10), -- 'upvote' or 'downvote'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(fact_id, user_id) -- Prevents multiple votes from same user on same fact
);
