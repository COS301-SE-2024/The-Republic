from app.main import app
import os
from gunicorn.app.wsgiapp import run

if __name__ == "__main__":
    os.environ['GUNICORN_CMD_ARGS'] = '--workers 4 --timeout 120'

    run()