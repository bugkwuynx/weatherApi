from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/geolocation', methods=['POST'])
def get_geolocation():
    try:
        print('received data')
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400
        city = data.get('city')
        if not city:
            return jsonify({"error": "City is required"}), 400
        geolocation_api_url = os.getenv('LOCATION_API_URL')
        geolocation_api_key = os.getenv('WEATHER_API_KEY')
        apiURL = f"{geolocation_api_url}?q={city}&appid={geolocation_api_key}"
        print(apiURL)
        response = requests.get(apiURL)
        if not response.ok:
            return jsonify({"error": "Failed to fetch geolocation data"}), response.status_code
        geolocation_data = response.json()
        return jsonify(geolocation_data)
    except:
        return jsonify({"error": "Failed to fetch geolocation data"}), 500

@app.route('/api/weather', methods=['POST'])
def get_weather():
    try:
        data = request.get_json()
        print('received data ', data)
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        latitude = data.get('latitude')
        longitude = data.get('longitude')
        
        if not latitude or not longitude:
            return jsonify({"error": "Latitude and longitude are required"}), 400
        weather_api_url = os.getenv('WEATHER_API_URL')
        weather_api_key = os.getenv('WEATHER_API_KEY')
        apiURL = f"{weather_api_url}?lat={latitude}&lon={longitude}&appid={weather_api_key}"
        response = requests.get(apiURL)
        if not response.ok:
            return jsonify({"error": "Failed to fetch weather data"}), response.status_code
            
        weather_data = response.json()
        return jsonify(weather_data)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
