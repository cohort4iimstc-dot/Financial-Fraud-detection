-- =============================================================
-- Fraud Detection Model — PostgreSQL Schema (FIXED)
-- =============================================================

-- Drop tables if they already exist (fixes "already exists" errors)
DROP TABLE IF EXISTS feature_importance CASCADE;
DROP TABLE IF EXISTS model_predictions CASCADE;
DROP TABLE IF EXISTS model_metrics CASCADE;
DROP TABLE IF EXISTS transactions CASCADE;

-- Drop indexes if they already exist
DROP INDEX IF EXISTS idx_transactions_class;
DROP INDEX IF EXISTS idx_transactions_split;
DROP INDEX IF EXISTS idx_predictions_txn;
DROP INDEX IF EXISTS idx_predictions_model;
DROP INDEX IF EXISTS idx_feature_importance_metric;

-- =============================================================
-- 1. TRANSACTIONS
-- =============================================================
CREATE TABLE transactions (
    transaction_id   BIGSERIAL       PRIMARY KEY,
    created_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    v1               DOUBLE PRECISION,
    v2               DOUBLE PRECISION,
    v3               DOUBLE PRECISION,
    v4               DOUBLE PRECISION,
    v5               DOUBLE PRECISION,
    v6               DOUBLE PRECISION,
    v7               DOUBLE PRECISION,
    v8               DOUBLE PRECISION,
    v9               DOUBLE PRECISION,
    v10              DOUBLE PRECISION,
    v11              DOUBLE PRECISION,
    v12              DOUBLE PRECISION,
    v13              DOUBLE PRECISION,
    v14              DOUBLE PRECISION,
    v15              DOUBLE PRECISION,
    v16              DOUBLE PRECISION,
    v17              DOUBLE PRECISION,
    v18              DOUBLE PRECISION,
    v19              DOUBLE PRECISION,
    v20              DOUBLE PRECISION,
    v21              DOUBLE PRECISION,
    v22              DOUBLE PRECISION,
    v23              DOUBLE PRECISION,
    v24              DOUBLE PRECISION,
    v25              DOUBLE PRECISION,
    v26              DOUBLE PRECISION,
    v27              DOUBLE PRECISION,
    v28              DOUBLE PRECISION,
    amount           NUMERIC(12, 2)  NOT NULL,
    actual_class     SMALLINT        NOT NULL CHECK (actual_class IN (0, 1)),
    split_set        VARCHAR(10)     NOT NULL CHECK (split_set IN ('train', 'test'))
);

CREATE INDEX idx_transactions_class ON transactions(actual_class);
CREATE INDEX idx_transactions_split ON transactions(split_set);

-- =============================================================
-- 2. MODEL PREDICTIONS
-- =============================================================
CREATE TABLE model_predictions (
    prediction_id     BIGSERIAL       PRIMARY KEY,
    transaction_id    BIGINT          NOT NULL REFERENCES transactions(transaction_id) ON DELETE CASCADE,
    model_name        VARCHAR(50)     NOT NULL CHECK (model_name IN (
                          'logistic_regression',
                          'decision_tree',
                          'random_forest'
                      )),
    predicted_class   SMALLINT        NOT NULL CHECK (predicted_class IN (0, 1)),
    fraud_probability DOUBLE PRECISION CHECK (fraud_probability BETWEEN 0 AND 1),
    predicted_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_predictions_txn   ON model_predictions(transaction_id);
CREATE INDEX idx_predictions_model ON model_predictions(model_name);

-- =============================================================
-- 3. MODEL METRICS
-- =============================================================
CREATE TABLE model_metrics (
    metric_id        BIGSERIAL       PRIMARY KEY,
    model_name       VARCHAR(50)     NOT NULL,
    run_at           TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    accuracy         DOUBLE PRECISION CHECK (accuracy BETWEEN 0 AND 1),
    precision_score  DOUBLE PRECISION CHECK (precision_score BETWEEN 0 AND 1),
    recall_score     DOUBLE PRECISION CHECK (recall_score BETWEEN 0 AND 1),
    f1_score         DOUBLE PRECISION CHECK (f1_score BETWEEN 0 AND 1),
    random_state     INTEGER,
    test_size        DOUBLE PRECISION CHECK (test_size BETWEEN 0 AND 1),
    smote_applied    BOOLEAN         NOT NULL DEFAULT TRUE,
    n_estimators     INTEGER
);

-- =============================================================
-- 4. FEATURE IMPORTANCE
-- =============================================================
CREATE TABLE feature_importance (
    importance_id    BIGSERIAL       PRIMARY KEY,
    metric_id        BIGINT          REFERENCES model_metrics(metric_id) ON DELETE CASCADE,
    feature_name     VARCHAR(10)     NOT NULL,
    importance_score DOUBLE PRECISION NOT NULL CHECK (importance_score >= 0),
    rank             SMALLINT        CHECK (rank >= 1)
);

CREATE INDEX idx_feature_importance_metric ON feature_importance(metric_id);

-- =============================================================
-- SAMPLE INSERTS
-- =============================================================

INSERT INTO model_metrics
    (model_name, accuracy, precision_score, recall_score, f1_score,
     random_state, test_size, smote_applied, n_estimators)
VALUES
    ('random_forest',       0.9996, 0.97, 0.84, 0.90, 42, 0.20, TRUE, 100),
    ('logistic_regression', 0.9992, 0.88, 0.62, 0.73, 42, 0.20, TRUE, NULL),
    ('decision_tree',       0.9993, 0.80, 0.79, 0.79, 42, 0.20, TRUE, NULL);

INSERT INTO transactions (
    v1, v2, v3, v4, v5, v6, v7, v8, v9, v10,
    v11, v12, v13, v14, v15, v16, v17, v18, v19, v20,
    v21, v22, v23, v24, v25, v26, v27, v28,
    amount, actual_class, split_set
) VALUES (
    -1.36, -0.07,  2.54,  1.38, -0.34,
     0.46,  0.24,  0.10,  0.36,  0.09,
    -0.55, -0.62, -0.99, -0.31,  1.47,
    -0.47,  0.21,  0.03,  0.40,  0.25,
    -0.02,  0.28, -0.11,  0.07,  0.13,
    -0.19,  0.13, -0.02,
    149.62, 0, 'test'
);

INSERT INTO model_predictions
    (transaction_id, model_name, predicted_class, fraud_probability)
VALUES
    (1, 'random_forest',       0, 0.02),
    (1, 'logistic_regression', 0, 0.04),
    (1, 'decision_tree',       0, 0.00);

INSERT INTO feature_importance
    (metric_id, feature_name, importance_score, rank)
VALUES
    (1, 'v17', 0.172, 1),
    (1, 'v14', 0.158, 2),
    (1, 'v12', 0.134, 3),
    (1, 'v10', 0.112, 4),
    (1, 'v11', 0.098, 5),
    (1, 'v4',  0.087, 6),
    (1, 'v3',  0.065, 7),
    (1, 'v7',  0.054, 8),
    (1, 'amount', 0.043, 9),
    (1, 'v16', 0.031, 10);

-- =============================================================
-- QUERIES — run these to verify everything worked
-- =============================================================

-- 1. Confirm all 4 tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';

-- 2. Compare all models by F1 score
SELECT
    model_name,
    ROUND(accuracy::numeric,        4) AS accuracy,
    ROUND(precision_score::numeric, 4) AS precision,
    ROUND(recall_score::numeric,    4) AS recall,
    ROUND(f1_score::numeric,        4) AS f1
FROM model_metrics
ORDER BY f1_score DESC;

-- 3. Top 10 feature importances
SELECT feature_name, importance_score, rank
FROM feature_importance
ORDER BY rank;

-- 4. All predictions for our sample transaction
SELECT
    t.transaction_id,
    t.amount,
    t.actual_class,
    p.model_name,
    p.predicted_class,
    p.fraud_probability
FROM model_predictions p
JOIN transactions t USING (transaction_id);
