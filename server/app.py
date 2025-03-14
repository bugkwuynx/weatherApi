from flask import Flask, request, jsonify
import os
import requests
from dotenv import load_dotenv
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/weather', methods=['POST'])
def get_weather():
    try:
        data = request.get_json()

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
