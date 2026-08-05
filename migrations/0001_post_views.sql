CREATE TABLE IF NOT EXISTS post_views (
  slug TEXT PRIMARY KEY,
  total_count INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS post_view_days (
  slug TEXT NOT NULL,
  view_date TEXT NOT NULL,
  view_count INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (slug, view_date)
);

CREATE INDEX IF NOT EXISTS idx_post_view_days_date
  ON post_view_days (view_date);
