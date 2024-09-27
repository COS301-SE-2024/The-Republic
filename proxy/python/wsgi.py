from app.main import app

if __name__ == "__main__":
    import os
    from gunicorn.app.wsgiapp import run

    os.environ['GUNICORN_CMD_ARGS'] = '--workers 4 --timeout 120'
    run()
