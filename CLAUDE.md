# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Structure 
expense-tracker/
  ├── app.py                   # Flask app — all routes defined here                                                                                             
  ├── requirements.txt         # Python dependencies
  ├── CLAUDE.md                # Project guidance for Claude Code                                                                                                
  ├── .gitignore                                                                                                                                                 
  │
  ├── database/                                                                                                                                                  
  │   ├── __init__.py
  │   └── db.py                # SQLite stub (get_db, init_db, seed_db to implement)
  │                                                                                                                                                              
  ├── templates/               # Jinja2 server-rendered HTML
  │   ├── base.html            # Base layout                                                                                                                     
  │   ├── landing.html         # Public landing page
  │   ├── login.html                                                                                                                                             
  ├── .gitignore                                                                                                                                                 
  │                 
  ├── database/                                                                                                                                                  
  │   ├── __init__.py
  │   └── db.py                # SQLite stub (get_db, init_db, seed_db to implement)
  │                                                                
  ├── templates/               # Jinja2 server-rendered HTML
  │   ├── base.html            # Base layout                                                                                                                     
  │   ├── landing.html         # Public landing page                       
  │   ├── login.html                                                                                                                                             
  │   ├── register.html                                                                                                                                          
  │   ├── terms.html
  │   └── privacy.html                                                                                                                                           
  │                                                                                                            
  ├── static/                                                                                                                                                    
  │   ├── css/style.css        # All styles + CSS custom properties                                                                                              
  │   └── js/main.js           # YouTube modal logic                                                                                                             
  │                                                                                                                                                              
  └── venv/                    # Python virtual environment (not committed)      

## Stack

- **Backend**: Python / Flask 3.1.3 with Jinja2 server-side rendering
- **Frontend**: Vanilla JS + custom CSS (no build step, no framework)
- **Database**: SQLite (implementation pending in `database/db.py`)
- **App name**: Spendly (repo: Spendy)

## Commands

```bash
# Activate the virtual environment first
source venv/bin/activate

# Run the dev server (localhost:5001)
python app.py

# Run tests
pytest

# Run a single test file
pytest tests/test_foo.py
```

Dependencies are in `requirements.txt`. Install with `pip install -r requirements.txt`.

## Architecture

### Routing (`app.py`)
All Flask routes are defined in a single `app.py`. Current routes are stubs — many return placeholder strings like `"coming in Step X"`. Authentication routes (`/login`, `/register`, `/logout`) accept GET only; POST handling is not yet implemented.

### Database (`database/db.py`)
A stub file expecting three functions to be implemented:
- `get_db()` — returns an SQLite connection with `row_factory = sqlite3.Row` and `PRAGMA foreign_keys = ON`
- `init_db()` — runs `CREATE TABLE` DDL
- `seed_db()` — inserts sample data

No ORM is used — raw `sqlite3` module only.

### Templates (`templates/`)
Jinja2 templates rendered server-side. Public pages (landing, login, register, terms, privacy) are complete. The dashboard is a static mockup — dynamic data rendering is not yet wired up.

### Static assets (`static/`)
- `css/style.css` — all styles, uses CSS custom properties for the design system
- `js/main.js` — YouTube modal logic for the landing page demo video

## Implementation status

The project is built incrementally ("Step X" comments in routes). Frontend UI is complete; backend is largely unimplemented:
- [ ] Database schema + `init_db` / `seed_db`
- [ ] User registration and login (password hashing with Werkzeug)
- [ ] Flask session management
- [ ] Expense CRUD (`/expenses/add`, `/expenses/<id>/edit`, `/expenses/<id>/delete`)
- [ ] POST handler wiring for all forms
