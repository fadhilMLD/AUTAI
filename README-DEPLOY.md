# Autai Deployment Guide

## Frontend and Backend Setup

Autai consists of two components:
1. React frontend (this repository)
2. Python Flask backend (in the `backend` folder)

## Production Deployment

### Backend API Server

The backend should be deployed separately from the frontend and be accessible at a fixed URL:

1. Deploy the Flask server from the `backend` folder
2. Make sure the backend is accessible at `https://api.feaven.tech` or your own domain
3. Ensure CORS is properly configured in the Flask app to accept requests from your frontend domain

```python
# In your backend's app.py
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for all routes, specify allowed origins
CORS(app, resources={r"/*": {"origins": ["https://autai.feaven.tech", "http://localhost:3000"]}})
```

### Frontend Application

1. Edit `.env.production` to set your API base URL:
   ```
   REACT_APP_API_BASE=https://api.feaven.tech
   ```

2. Build the frontend:
   ```
   npm run build
   ```

3. Deploy the contents of the `build` folder to your web server or hosting service

## Cloudflare Tunneling

If using Cloudflare tunneling:

1. Create **two separate tunnels**:
   - One for the frontend (e.g., `https://autai.feaven.tech` → your frontend server)
   - One for the backend API (e.g., `https://api.feaven.tech` → your Flask server)

2. Make sure both services are running before setting up the tunnels

With this setup, the frontend will make API calls to the separate backend URL rather than trying to access API endpoints on the same domain.
