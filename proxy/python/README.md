# InfiniteLoopers-Load-Balancer

This is a Python Flask Load Balancer for 4 Bakcend Servers

## How to Run Code:

- ### Creating the Python Virtual Environment:

  ```bash
  - sudo apt-get update
  - sudo apt-get install python3-venv
  - python3 -m venv venv

  - pip install virtualenv
  - virtualenv -p python3 <env_name>

  # activating and deactivating virtualenv
  - source <env_name>/bin/activate
  - deactivate
  ```
- ### Activating the Python Virtual Environment:

  ```bash
  - source venv/bin/activate
  ```
- ### Deactivating the Python Virtual Environment:

  ```bash
  - deactivate
  ```
- ### Flask Application:

  - gunicorn --workers 4 wsgi:app
  - gunicorn --workers 4 wsgi:app --reload (for automatic updates)
- ### Environment Variables:

  ```bash
  # Place the (.env) File in Root Directory
  PORT=5000
  MAX_RETRIES=2
  FRONTEND_URL=https://vercel.app

  SERVER_1=https://web-server-1.com
  SERVER_2=https://web-server-2.com
  SERVER_3=https://web-server-3.com
  SERVER_4=https://web-server-4.com
  ```

---

---

## FINALLY WE GETTING STARTED WITH THE BEST PART

- **Clone the Repository:**

  ```bash
  git clone https://github.com/TebogoYungMercykay/InfiniteLoopers-Load-Balancer.git
  cd InfiniteLoopers-Load-Balancer
  ```
- **Install Dependencies:**

  ```bash
  pip install -r requirements.txt
  ```
- **Run Locally:**

  ```bash
  gunicorn --workers 4 wsgi:app
  ```
- **Access API Documentation:**
  Open your browser and navigate to [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs) for interactive API documentation.

---
