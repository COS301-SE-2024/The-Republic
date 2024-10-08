from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import logging
import requests
import random
import os

load_dotenv()
app = Flask(__name__)

# Configure logging
logging.basicConfig(level=logging.INFO)

# CORS Origin Configuration
cors = CORS(app, resources={
    r"/*": {
        "origins": ["*"],
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

def proxy_request(request, retries):
    
    while retries < MAX_RETRIES:
        server = get_random_server(servers)

        try:
            final_url = f"{server.url}{request.full_path}"
            
            response = requests.request(
                method=request.method,
                url=final_url,
                headers={key: value for key, value in request.headers if key.lower() != 'host'},
                data=request.get_data(),
                cookies=request.cookies,
                allow_redirects=False,
                verify=True,
            )
            
            excluded_headers = ['content-length', 'transfer-encoding', 'connection']
            headers = [(name, value) for name, value in response.raw.headers.items() if name.lower() not in excluded_headers]
            
            content_type = response.headers.get('Content-Type', 'application/octet-stream')
            headers.append(('Content-Type', content_type))
            
            content_length = response.headers.get('content-length')
            if content_length:
                headers.append(('Content-Length', content_length))

            if 500 <= int(response.status_code) < 600:
                logging.error(f"Error Occurred({retries}): ", response.status_code)
                retries += 1
            elif int(response.status_code) == 404:
                return jsonify({
                        "status": "error",
                        "status_code": 404,
                        "success": False,
                        "data": "Bad Request, Client Error",
                    }), 404
            else:
                if 'application/json' in response.headers.get('Content-Type', ''):
                    try:
                        data = response.json()
                    except ValueError:
                        data = response.content
                else:
                    try:
                        data = response.content.decode('utf-8', errors='replace')
                    except ValueError:
                        data = response.content
                
                return jsonify(data), response.status_code
        
        except requests.exceptions.RequestException as e:
            logging.error(f"Request to {server.url} failed: {e}")
            retries += 1
            if retries >= MAX_RETRIES:
                return jsonify({
                    "status": "error",
                    "success": False,
                    "status_code": 502,
                    "data": "Bad API Gateway, Error Occured",
                }), 502
                
        if retries >= MAX_RETRIES:
            break

    return jsonify({
            "status": "error",
            "success": False,
            "status_code": 502,
            "data": "Bad API Gateway, Request Coundn't be Handled.",
        }), 502


@app.route('/', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def process_root():
    return jsonify({
            "status": "success",
            "success": True,
            "status_code": 200,
            "data": "Welcome to The-Republic Node-Express App",
        }), 200

@app.route('/<path:path>', methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
def process_request(path):
    return proxy_request(request, 0)

if __name__ == "__main__":
    env_port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=env_port, threaded=True)
