/**
 * Ordered, append-only schema migrations. Never edit a released migration — add a new one.
 * Applied automatically on first database access (see client.ts) and by `npm run db:migrate`.
 */
export type Migration = {
  version: number;
  name: string;
  statements: string[];
};

export const migrations: Migration[] = [
  {
    version: 1,
    name: 'initial_schema',
    statements: [
      `CREATE TABLE users (
        id TEXT PRIMARY KEY,
        email TEXT NOT NULL UNIQUE COLLATE NOCASE,
        name TEXT NOT NULL DEFAULT '',
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      )`,
      `CREATE TABLE sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        user_agent TEXT NOT NULL DEFAULT ''
      )`,
      `CREATE INDEX sessions_user_idx ON sessions(user_id)`,
      `CREATE TABLE login_attempts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT NOT NULL,
        email TEXT NOT NULL,
        success INTEGER NOT NULL CHECK (success IN (0, 1)),
        attempted_at TEXT NOT NULL
      )`,
      `CREATE INDEX login_attempts_ip_idx ON login_attempts(ip, attempted_at)`,
      `CREATE INDEX login_attempts_email_idx ON login_attempts(email, attempted_at)`,
      `CREATE TABLE media (
        id TEXT PRIMARY KEY,
        filename TEXT NOT NULL,
        mime TEXT NOT NULL,
        width INTEGER NOT NULL CHECK (width > 0),
        height INTEGER NOT NULL CHECK (height > 0),
        bytes INTEGER NOT NULL CHECK (bytes > 0),
        sha256 TEXT NOT NULL UNIQUE,
        alt TEXT NOT NULL DEFAULT '',
        data BLOB NOT NULL,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE posts (
        seq INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT NOT NULL UNIQUE,
        slug TEXT NOT NULL UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT NOT NULL DEFAULT '',
        body TEXT NOT NULL DEFAULT '',
        category TEXT NOT NULL,
        tags TEXT NOT NULL DEFAULT '[]',
        seo_title TEXT NOT NULL DEFAULT '',
        seo_description TEXT NOT NULL DEFAULT '',
        cover_image_id TEXT REFERENCES media(id) ON DELETE SET NULL,
        cover_alt TEXT NOT NULL DEFAULT '',
        status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
        featured INTEGER NOT NULL DEFAULT 0 CHECK (featured IN (0, 1)),
        is_sample INTEGER NOT NULL DEFAULT 0 CHECK (is_sample IN (0, 1)),
        reading_minutes INTEGER NOT NULL DEFAULT 1 CHECK (reading_minutes >= 1),
        published_at TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        CHECK (status = 'draft' OR published_at IS NOT NULL)
      )`,
      `CREATE INDEX posts_status_published_idx ON posts(status, published_at DESC)`,
      `CREATE INDEX posts_category_idx ON posts(category)`,
      `CREATE TABLE post_slug_history (
        old_slug TEXT PRIMARY KEY,
        post_id TEXT NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
        created_at TEXT NOT NULL
      )`,
      `CREATE VIRTUAL TABLE posts_fts USING fts5(
        title, excerpt, body, tags,
        content='posts', content_rowid='seq',
        tokenize='porter unicode61 remove_diacritics 2'
      )`,
      `CREATE TRIGGER posts_fts_insert AFTER INSERT ON posts BEGIN
        INSERT INTO posts_fts(rowid, title, excerpt, body, tags)
        VALUES (new.seq, new.title, new.excerpt, new.body, new.tags);
      END`,
      `CREATE TRIGGER posts_fts_delete AFTER DELETE ON posts BEGIN
        INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, body, tags)
        VALUES ('delete', old.seq, old.title, old.excerpt, old.body, old.tags);
      END`,
      `CREATE TRIGGER posts_fts_update AFTER UPDATE OF title, excerpt, body, tags ON posts BEGIN
        INSERT INTO posts_fts(posts_fts, rowid, title, excerpt, body, tags)
        VALUES ('delete', old.seq, old.title, old.excerpt, old.body, old.tags);
        INSERT INTO posts_fts(rowid, title, excerpt, body, tags)
        VALUES (new.seq, new.title, new.excerpt, new.body, new.tags);
      END`,
    ],
  },
];
