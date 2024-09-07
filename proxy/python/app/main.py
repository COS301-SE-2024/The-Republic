from flask import Flask, request, Response
from dotenv import load_dotenv
from flask_cors import CORS
import requests
import random
import os

load_dotenv()
app = Flask(__name__)

# CORS Origin Configuration
cors = CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", os.getenv('FRONTEND_URL')],
        "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        "allow_headers": ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
        "supports_credentials": True
    }
})

# Load Balancer Configuration
class Server:
    def __init__(self, url):
        self.url = url

servers = [
    Server(os.getenv('SERVER_1')),
    Server(os.getenv('SERVER_2')),
    Server(os.getenv('SERVER_3')),
    Server(os.getenv('SERVER_4')),
]

MAX_RETRIES = int(os.getenv('MAX_RETRIES', len(servers)))

def get_random_server(servers):
    server_index = random.sample(range(len(servers)), 1)[0]
    return servers[server_index]

def proxy_request(request, server, retries):
    
    while retries < MAX_RETRIES:
        try:
            final_url = f"{server.url}{request.full_path}"
            
            response = requests.request(
                method=request.method,
                url=final_url,
                headers={key: value for key, value in request.headers if key.lower() != 'host'},
                data=request.get_data(),
                cookies=request.cookies,
                allow_redirects=False,
                verify=True
            )
            
            excluded_headers = ['content-encoding', 'content-length', 'transfer-encoding', 'connection']
            headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]
            
            if 500 <= int(response.status_code) < 600:
                retries += 1
            elif int(response.status_code) == 404:
                return {
                    "status": "error",
                    "status_code": 404,
                    "id": random.randint(1, 500),
                    "data": "Bad Request, Client Error",
                }
            else:
                return Response(response.content, response.status_code, headers)
        
        except requests.exceptions.RequestException as e:
            # print(f"Error proxying request: {e}")
            retries += 1
                
        if retries >= MAX_RETRIES:
            break
    
    return {
        "status": "success",
        "status_code": 502,
        "id": random.randint(1, 500),
        "data": "Bad API Gateway",
    }

@app.route('/', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def process_root():
    return {
        "status": "success",
        "status_code": 200,
        "id": random.randint(1, 500),
        "data": "Welcome to The-Republic Node-Express App",
    }

@app.route('/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def process_request(path):
    server = get_random_server(servers)
    return proxy_request(request, server, 0)

if __name__ == "__main__":
    env_port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=env_port, threaded=True)
