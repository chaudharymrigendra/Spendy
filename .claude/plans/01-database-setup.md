# Plan: Database Setup (Step 1)

## Context

The Spendly app has a fully built frontend but no data layer. `database/db.py` is currently a stub (comments only). All future features — auth, profile, expense CRUD — depend on this foundation. This plan implements the three required functions and wires them into app startup.

## Status: COMPLETE

---

## Files Modified

- `database/db.py` — implemented all three functions
- `app.py` — added imports and startup calls

---

## Implementation

### 1. `database/db.py`

```python
import sqlite3
import os
from werkzeug.security import generate_password_hash

DB_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "spendly.db")


def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db():
    conn = get_db()
    conn.executescript("""
        CREATE TABLE IF NOT EXISTS users (
            id            INTEGER PRIMARY KEY AUTOINCREMENT,
            name          TEXT    NOT NULL,
            email         TEXT    UNIQUE NOT NULL,
            password_hash TEXT    NOT NULL,
            created_at    TEXT    DEFAULT (datetime('now'))
        );

        CREATE TABLE IF NOT EXISTS expenses (
            id          INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id     INTEGER NOT NULL REFERENCES users(id),
            amount      REAL    NOT NULL,
            category    TEXT    NOT NULL,
            date        TEXT    NOT NULL,
            description TEXT,
            created_at  TEXT    DEFAULT (datetime('now'))
        );
    """)
    conn.commit()
    conn.close()


def seed_db():
    conn = get_db()
    if conn.execute("SELECT 1 FROM users LIMIT 1").fetchone():
        conn.close()
        return

    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
        ("Demo User", "demo@spendly.com", generate_password_hash("demo123")),
    )
    user_id = cursor.lastrowid

    expenses = [
        (user_id, 45.50,  "Food",          "2026-04-01", "Grocery run"),
        (user_id, 12.00,  "Transport",     "2026-04-03", "Bus pass top-up"),
        (user_id, 120.00, "Bills",         "2026-04-05", "Electricity bill"),
        (user_id, 60.00,  "Health",        "2026-04-08", "Pharmacy"),
        (user_id, 25.00,  "Entertainment", "2026-04-12", "Streaming subscriptions"),
        (user_id, 80.00,  "Shopping",      "2026-04-15", "New shoes"),
        (user_id, 15.75,  "Other",         "2026-04-18", "Miscellaneous"),
        (user_id, 30.00,  "Food",          "2026-04-22", "Restaurant dinner"),
    ]
    cursor.executemany(
        "INSERT INTO expenses (user_id, amount, category, date, description) VALUES (?, ?, ?, ?, ?)",
        expenses,
    )
    conn.commit()
    conn.close()
```

### 2. `app.py` changes

Import line added at top:
```python
from database.db import get_db, init_db, seed_db
```

`__main__` block updated:
```python
if __name__ == "__main__":
    with app.app_context():
        init_db()
        seed_db()
    app.run(debug=True, port=5001)
```

---

## Rules Applied

- No ORM — raw `sqlite3` only (spec §11)
- Parameterized queries throughout (spec §11)
- `PRAGMA foreign_keys = ON` on every connection (spec §11)
- `amount` stored as `REAL` (spec §11)
- Password hashed via `werkzeug.security.generate_password_hash` (spec §11)
- `seed_db()` checks for existing data before inserting — idempotent (spec §5C)
- `CREATE TABLE IF NOT EXISTS` — `init_db()` safe to call repeatedly (spec §5B)
- 8 sample expenses across all 7 categories, dates in April 2026 (spec §5C, §10)

---

## Verification Results

- `init_db()` — tables created without error, safe on repeated calls
- `seed_db()` — inserts Demo User + 8 expenses; skips on second call
- All 7 categories present: Bills, Entertainment, Food, Health, Other, Shopping, Transport
- FK enforcement: inserting expense with `user_id=9999` raises `FOREIGN KEY constraint failed`
- `pytest` — no test failures (no tests exist yet)
