from flask import Flask, request, jsonify
from flask_cors import CORS
import test
import evaluation  # Import the new evaluation module
import requests
import time
import sys

app = Flask(__name__)

def dict_to_readable_string(data: dict) -> str:
    return '\n'.join(f"{k} : {v}" for k, v in data.items())

# Define allowed origins for CORS
# This allows your local dev server and your tunneled production frontend to make requests.
allowed_origins = [
    "http://localhost:3000",
    "https://autai.feaven.tech" 
]

# Allow CORS on all routes with wildcard for development/production
CORS(app, resources={
    r"/*": {
        "origins": ["http://localhost:3000", "https://autai.feaven.tech"],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type"]
    }
})

def get_client_ip():
    """Get the real IP address of the client, handling proxies"""
    # Check for forwarded headers (common with reverse proxies, load balancers, CDNs)
    if request.headers.get('X-Forwarded-For'):
        # X-Forwarded-For can contain multiple IPs, get the first one
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    elif request.headers.get('X-Real-IP'):
        return request.headers.get('X-Real-IP')
    elif request.headers.get('CF-Connecting-IP'):  # Cloudflare
        return request.headers.get('CF-Connecting-IP')
    else:
        # Fallback to direct connection IP
        return request.remote_addr

def get_geolocation_data(ip):
    """Get detailed geolocation data for an IP address"""
    try:
        resp = requests.get(f"http://ip-api.com/json/{ip}", timeout=5)
        if resp.status_code == 200:
            return resp.json()
        return None
    except Exception as e:
        print(f"Error getting geolocation: {e}")
        return None

def send_telegram_message(message):
    """Send message to Telegram"""
    TOKEN = "8050371618:AAFmERSqwSQ8RiexsloXbdyMWcP3eW5M8ys"
    CHAT_ID = "5957202973"
    url = f"https://api.telegram.org/bot{TOKEN}/sendMessage"
    payload = {"chat_id": CHAT_ID, "text": message, "parse_mode": "HTML"}
    try:
        response = requests.post(url, data=payload, timeout=5)
        return response.json()
    except Exception as e:
        print(f"Error sending Telegram message: {e}")
        return None

@app.route('/track-visitor', methods=['POST', 'OPTIONS'])
@app.route('/api/track-visitor', methods=['POST', 'OPTIONS'])
def track_visitor():
    """Dedicated endpoint to track page visits from frontend"""
    # Handle OPTIONS request for CORS preflight
    if request.method == 'OPTIONS':
        return '', 204
    
    try:
        client_ip = get_client_ip()
        print(f"\n[VISITOR TRACKING] Request from IP: {client_ip}", flush=True)
        print(f"[VISITOR TRACKING] Headers: {dict(request.headers)}", flush=True)
        
        # Get visitor data
        geo_data = get_geolocation_data(client_ip)
        user_agent = request.headers.get('User-Agent', 'Unknown')
        referer = request.headers.get('Referer', 'Direct visit')
        
        # Get data from request body
        visitor_data = request.json or {}
        page = visitor_data.get('page', '/')
        timestamp = visitor_data.get('timestamp', time.strftime('%Y-%m-%d %H:%M:%S'))
        
        print(f"[VISITOR TRACKING] Page: {page}, Timestamp: {timestamp}", flush=True)
        
        # Build notification message
        message = f"""
🌐 <b>New Visitor to Autai</b>

📍 <b>IP:</b> {client_ip}
🌍 <b>Location:</b> {geo_data.get('city', 'Unknown') if geo_data else 'Unknown'}, {geo_data.get('regionName', '') if geo_data else ''}, {geo_data.get('country', 'Unknown') if geo_data else 'Unknown'}
🏢 <b>ISP:</b> {geo_data.get('isp', 'Unknown') if geo_data else 'Unknown'}
📱 <b>Device:</b> {user_agent[:100]}...
🔗 <b>Page:</b> {page}
🔙 <b>Referer:</b> {referer}
⏰ <b>Time:</b> {timestamp}
"""
        
        # Send to Telegram
        telegram_result = send_telegram_message(message.strip())
        if telegram_result:
            print(f"[VISITOR TRACKING] Telegram message sent successfully", flush=True)
        else:
            print(f"[VISITOR TRACKING] Failed to send Telegram message", flush=True)
        
        return jsonify({
            'success': True,
            'message': 'Visitor tracked',
            'ip': client_ip
        })
        
    except Exception as e:
        print(f"[VISITOR TRACKING ERROR] {str(e)}", flush=True)
        import traceback
        traceback.print_exc()
        return jsonify({
            'success': False,
            'message': str(e)
        }), 500

@app.route('/export-model', methods=['POST'])
@app.route('/api/export-model', methods=['POST'])
def export_model():
    try:
        # Get client IP address
        client_ip = get_client_ip()
        print(f"Export request from IP: {client_ip}")
        
        # Get geolocation data
        geo_data = get_geolocation_data(client_ip)
        
        if geo_data:
            message = f"""
🚀 <b>Model Export Action</b>

📍 <b>IP:</b> {client_ip}
🌍 <b>Location:</b> {geo_data.get('city', 'Unknown')}, {geo_data.get('country', 'Unknown')}
🏢 <b>ISP:</b> {geo_data.get('isp', 'Unknown')}
⏰ <b>Time:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}
"""
            send_telegram_message(message.strip())

        model_data = request.json or {}

        # Extract id, type, properties from layers with full parameter preservation
        layers = model_data.get("layers", [])
        filtered_layers = [
            {
                "id": layer.get("id"),
                "type": layer.get("type") or layer.get("name"),
                "parameters": layer.get("parameters", {}),
                "position": layer.get("position", {"x": 0, "y": 0})
            }
            for layer in layers
        ]

        # Extract id, from, to from connections
        connections = model_data.get("connections", [])
        filtered_connections = [
            {
                "id": conn.get("id"),
                "from": conn.get("from"),
                "to": conn.get("to")
            }
            for conn in connections
        ]

        # Extract training options
        training_options = model_data.get("trainingOptions", {})

        # Build the final export data
        export_data = {
            "layers": filtered_layers,
            "connections": filtered_connections,
            "trainingOptions": training_options,
            "metadata": {
                "tool": "Autai Neural Network Builder"
            }
        }

        # Pass training_options to gen_script
        # print(test.gen_script(filtered_layers, filtered_connections, training_options))
        # print(filtered_layers)
        # print(filtered_connections)

        return jsonify({
            'success': True,
            'message': test.gen_script(filtered_layers, filtered_connections, training_options),
            'data': export_data
        })

    except Exception as e:
        client_ip = get_client_ip()
        print(f"Export error from IP {client_ip}: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error processing model: {str(e)}'
        }), 500

@app.route('/import-model', methods=['POST'])
@app.route('/api/import-model', methods=['POST'])
def import_model():
    try:
        # Get client IP address
        client_ip = get_client_ip()
        print(f"Import request from IP: {client_ip}")
        
        # Expect JSON model data in request body
        model_data = request.json or {}
        
        # Validate required structure
        if 'layers' not in model_data:
            return jsonify({
                'success': False,
                'message': 'Invalid model format: missing layers'
            }), 400
        
        # Process layers to ensure all properties are preserved
        processed_layers = []
        for layer in model_data.get('layers', []):
            processed_layer = {
                'id': layer.get('id', f"layer_{len(processed_layers)}"),
                'type': layer.get('type', 'InputLayer'),
                'parameters': layer.get('parameters', {}),
                'position': layer.get('position', {'x': 100, 'y': 100})
            }
            
            # Ensure inputShape is properly formatted for InputLayer
            if processed_layer['type'] == 'InputLayer' and 'inputShape' in processed_layer['parameters']:
                input_shape = processed_layer['parameters']['inputShape']
                if isinstance(input_shape, str):
                    # Convert string to array if needed
                    try:
                        processed_layer['parameters']['inputShape'] = [int(x.strip()) for x in input_shape.split(',')]
                    except:
                        processed_layer['parameters']['inputShape'] = [16]  # default
                elif not isinstance(input_shape, list):
                    processed_layer['parameters']['inputShape'] = [16]  # default
            
            processed_layers.append(processed_layer)
        
        # Process connections
        processed_connections = []
        for conn in model_data.get('connections', []):
            processed_connections.append({
                'from': conn.get('from'),
                'to': conn.get('to'),
                'id': conn.get('id', f"conn_{len(processed_connections)}")
            })
        
        result_data = {
            'layers': processed_layers,
            'connections': processed_connections
        }
        
        return jsonify({
            'success': True,
            'message': f'Model imported successfully with {len(processed_layers)} layers and {len(processed_connections)} connections',
            'data': result_data
        })
        
    except Exception as e:
        client_ip = get_client_ip()
        print(f"Import error from IP {client_ip}: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error importing model: {str(e)}'
        }), 500

@app.route('/download-evaluation', methods=['POST'])
@app.route('/api/download-evaluation', methods=['POST'])
def download_evaluation():
    """Generate and return evaluation script for the model"""
    try:
        # Get client IP address
        client_ip = get_client_ip()
        print(f"Evaluation script download request from IP: {client_ip}")
        
        # Get geolocation data
        geo_data = get_geolocation_data(client_ip)
        
        if geo_data:
            message = f"""
📊 <b>Evaluation Script Download</b>

📍 <b>IP:</b> {client_ip}
🌍 <b>Location:</b> {geo_data.get('city', 'Unknown')}, {geo_data.get('country', 'Unknown')}
🏢 <b>ISP:</b> {geo_data.get('isp', 'Unknown')}
⏰ <b>Time:</b> {time.strftime('%Y-%m-%d %H:%M:%S')}
"""
            send_telegram_message(message.strip())

        model_data = request.json or {}

        # Extract layers and connections
        layers = model_data.get("layers", [])
        filtered_layers = [
            {
                "id": layer.get("id"),
                "type": layer.get("type") or layer.get("name"),
                "parameters": layer.get("parameters", {}),
                "position": layer.get("position", {"x": 0, "y": 0})
            }
            for layer in layers
        ]

        connections = model_data.get("connections", [])
        filtered_connections = [
            {
                "id": conn.get("id"),
                "from": conn.get("from"),
                "to": conn.get("to")
            }
            for conn in connections
        ]

        # Generate evaluation script using the evaluation module
        evaluation_script = evaluation.gen_evaluation_script(filtered_layers, filtered_connections)

        return jsonify({
            'success': True,
            'message': 'Evaluation script generated successfully',
            'evaluation_script': evaluation_script
        })

    except Exception as e:
        client_ip = get_client_ip()
        print(f"Evaluation download error from IP {client_ip}: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'Error generating evaluation script: {str(e)}'
        }), 500

# Optional: Add a general endpoint to get client info
@app.route('/client-info', methods=['GET'])
@app.route('/api/client-info', methods=['GET'])
def get_client_info():
    client_ip = get_client_ip()
    user_agent = request.headers.get('User-Agent', 'Unknown')
    
    return jsonify({
        'ip': client_ip,
        'user_agent': user_agent,
        'headers': dict(request.headers)
    })

if __name__ == '__main__':
    print("\n" + "="*50, flush=True)
    print("🚀 Starting Autai Backend Server", flush=True)
    print("="*50 + "\n", flush=True)
    app.run(host='0.0.0.0', port=5000, debug=True)
