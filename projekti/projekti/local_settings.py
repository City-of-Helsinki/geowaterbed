
import os

DATABASES = {
    "default": {
        # Ends with "postgresql_psycopg2", "mysql", "sqlite3" or "oracle".
        "ENGINE": "django.db.backends.postgresql_psycopg2",
        # DB name or path to database file if using sqlite3.
        "NAME": os.environ.get("DATABASE_NAME", "vesi"),
        # Not used with sqlite3.
        "USER": os.environ.get("DATABASE_USER", os.environ.get('USER')),
        # Not used with sqlite3.
        "PASSWORD": os.environ.get("DATABASE_PASSWORD", ""),
        # Set to empty string for localhost. Not used with sqlite3.
        "HOST": os.environ.get("DATABASE_HOST", "localhost"),
        # Set to empty string for default. Not used with sqlite3.
        "PORT": os.environ.get("DATABASE_PORT", "")
    }
}
