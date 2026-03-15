-- ============================================================
-- Spark ⚡ — PostgreSQL Database Schema
-- ============================================================

-- USERS
CREATE TABLE users (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100)  NOT NULL,
    email       VARCHAR(150)  NOT NULL UNIQUE,
    password    VARCHAR(255)  NOT NULL,
    created_at  TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- GENERATIONS
CREATE TABLE generations (
    id              SERIAL PRIMARY KEY,
    user_id         INT       NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    prompt          TEXT      NOT NULL,
    generated_code  TEXT      NOT NULL,
    is_favourite    BOOLEAN   NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW()
);

-- INDEX for fast history lookup per user
CREATE INDEX idx_generations_user ON generations(user_id);