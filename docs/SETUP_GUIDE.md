# Complete Setup Guide for ReAct Calendar Agent

This guide will walk you through setting up the entire ReAct Calendar Agent system on your iMac from scratch.

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js (should be >= 16.0.0)
node --version

# Check npm
npm --version

# Check Docker
docker --version

# Check Docker Compose
docker-compose --version

# Check Python (for LangFlow)
python3 --version
```

If any are missing, install them first:

### Install Homebrew (if not installed)
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Install Node.js
```bash
brew install node
```

### Install Docker Desktop
Download from: https://www.docker.com/products/docker-desktop/

### Install Python
```bash
brew install python3
```

## Step 1: Project Setup

### 1.1 Create Project Directory
```bash
# Create project folder
mkdir react-calendar-agent
cd react-calendar-agent

# Initialize git repository
git init

# Create necessary directories
mkdir -p logs src/components src/utils docs
```

### 1.2 Create package.json
Create `package.json` with the content from the artifact provided.

### 1.3 Install Dependencies
```bash
npm install
```

This will install:
- express (Web server)
- cors (Cross-origin requests)
- sqlite3 (Database)
- kafkajs (Kafka client)
- axios (HTTP client)
- uuid (ID generation)
- dotenv (Environment variables)

## Step 2: Environment Configuration

### 2.1 Create .env file
Copy the `.env` file content from the artifact and save it as `.env` in your project root.

### 2.2 Update Configuration
Edit `.env` and update:
```bash
# Set your actual values
OPENAI_API_KEY=sk-your-actual-key-here
JWT_SECRET=$(openssl rand -base64 32)
```

### 2.3 Create .gitignore
```bash
cat > .gitignore << EOF
node_modules/
.env
*.db
logs/
*.log
.DS_Store
npm-debug.log*
.vscode/
EOF
```

## Step 3: Kafka Setup

### 3.1 Create docker-compose.yml
Copy the docker-compose.yml content from the artifact.

### 3.2 Start Kafka Services
```bash
# Start all services
docker-compose up -d

# Verify services are running
docker-compose ps

# Check logs
docker-compose logs -f kafka
```

You should see:
```
✓ zookeeper - running on port 2181
✓ kafka - running on port 9092
✓ kafka-ui - running on port 8080
```

### 3.3 Verify Kafka
```bash
# List topics
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092

# Create test topic
docker exec -it kafka kafka-topics --create \
  --topic test-topic \
  --bootstrap-server localhost:9092 \
  --partitions 1 \
  --replication-factor 1
```

### 3.4 Access Kafka UI
Open browser: http://localhost:8080

You should see the Kafka UI dashboard.

## Step 4: Server Setup

### 4.1 Create server.js
Copy the server.js content from the artifact.

### 4.2 Test Server
```bash
# Start server
npm start

# You should see:
# Connected to SQLite database
# Database tables initialized
# Kafka producer and consumer connected
# ReAct Calendar Server running on http://localhost:3001
```

### 4.3 Test API
Open a new terminal:

```bash
# Test health endpoint
curl http://localhost:3001/api/process-query

# Test query processing
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "query": "Schedule a meeting tomorrow at 2pm"
  }'
```

Expected response:
```json
{
  "thought": "Analyzing query...",
  "action": "Creating calendar event...",
  "observation": "Successfully created calendar event",
  "event": {
    "id": "...",
    "title": "Scheduled Meeting",
    "date": "2024-12-16",
    "time": "2:00 PM",
    "attendees": "team@company.com"
  },
  "streamId": "...",
  "success": true
}
```

## Step 5: Frontend Setup

### 5.1 Create index.html (Option 1 - Simple HTML)

```bash
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>ReAct Calendar Agent</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; padding: 20px; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 20px; box-shadow: 0 20px 60px rgba(0,0,0,0.3); padding: 40px; }
        h1 { color: #667eea; margin-bottom: 10px; }
        p { color: #666; margin-bottom: 30px; }
        .input-group { margin-bottom: 20px; }
        label { display: block; font-weight: 600; margin-bottom: 8px; color: #333; }
        input, textarea { width: 100%; padding: 12px; border: 2px solid #e0e0e0; border-radius: 8px; font-size: 16px; transition: border 0.3s; }
        input:focus, textarea:focus { outline: none; border-color: #667eea; }
        button { width: 100%; padding: 15px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; border-radius: 8px; font-size: 18px; font-weight: 600; cursor: pointer; transition: transform 0.2s; }
        button:hover { transform: translateY(-2px); }
        button:disabled { opacity: 0.5; cursor: not-allowed; }
        .result { margin-top: 30px; padding: 20px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #667eea; }
        .error { background: #fff0f0; border-left-color: #ef4444; }
        .loading { text-align: center; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🗓️ ReAct Calendar Agent</h1>
        <p>AI-powered scheduling with intelligent reasoning</p>
        
        <div class="input-group">
            <label>Email Address</label>
            <input type="email" id="email" placeholder="your.email@company.com" required>
        </div>
        
        <div class="input-group">
            <label>Query</label>
            <textarea id="query" rows="4" placeholder="Schedule a production meeting tomorrow at 10am..." required></textarea>
        </div>
        
        <button onclick="processQuery()" id="submitBtn">Process Query</button>
        
        <div id="result"></div>
    </div>

    <script>
        async function processQuery() {
            const email = document.getElementById('email').value;
            const query = document.getElementById('query').value;
            const resultDiv = document.getElementById('result');
            const submitBtn = document.getElementById('submitBtn');
            
            if (!email || !query) {
                resultDiv.innerHTML = '<div class="result error">Please fill in all fields</div>';
                return;
            }
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processing...';
            resultDiv.innerHTML = '<div class="loading">⏳ Processing your request...</div>';
            
            try {
                const response = await fetch('http://localhost:3001/api/process-query', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, query })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    resultDiv.innerHTML = `
                        <div class="result">
                            <h3>✅ Success!</h3>
                            <p><strong>Thought:</strong> ${data.thought}</p>
                            <p><strong>Action:</strong> ${data.action}</p>
                            <p><strong>Event:</strong> ${data.event.title} on ${data.event.date} at ${data.event.time}</p>
                            <p><small>Stream ID: ${data.streamId}</small></p>
                        </div>
                    `;
                } else {
                    throw new Error('Failed to process query');
                }
            } catch (error) {
                resultDiv.innerHTML = `<div class="result error"><strong>Error:</strong> ${error.message}</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Process Query';
            }
        }
    </script>
</body>
</html>
EOF
```

### 5.2 Or Use React Version
The React component artifact provided can be used with Create React App or Vite:

```bash
# Using Create React App
npx create-react-app calendar-ui
cd calendar-ui
npm install lucide-react
# Replace src/App.js with the React artifact content

# Or using Vite (faster)
npm create vite@latest calendar-ui -- --template react
cd calendar-ui
npm install
npm install lucide-react
# Replace src/App.jsx with the React artifact content
```

### 5.3 Open Frontend
```bash
# For simple HTML version
open index.html

# Or start a simple server
python3 -m http.server 8000
# Then open http://localhost:8000
```

## Step 6: LangFlow Setup (Optional but Recommended)

### 6.1 Install LangFlow
```bash
pip3 install langflow
```

### 6.2 Start LangFlow
```bash
langflow run --host 0.0.0.0 --port 7860
```

### 6.3 Import Configuration
1. Open http://localhost:7860
2. Click "Import Flow"
3. Upload the `langflow-config.json` file
4. The ReAct workflow will be visualized

### 6.4 Connect to Backend
Update server.js to use LangFlow API:

```javascript
// Add at top of server.js
const LANGFLOW_URL = process.env.LANGFLOW_API_URL || 'http://localhost:7860';
```

## Step 7: Database Verification

### 7.1 Check Database
```bash
# Install SQLite CLI if not present
brew install sqlite3

# Open database
sqlite3 react_calendar.db

# View tables
.tables

# Query events
SELECT * FROM calendar_events;

# Query logs
SELECT * FROM react_logs ORDER BY created_at DESC LIMIT 5;

# Exit
.quit
```

### 7.2 Database Browser (GUI)
```bash
# Install DB Browser for SQLite
brew install --cask db-browser-for-sqlite

# Open your database
open -a "DB Browser for SQLite" react_calendar.db
```

## Step 8: Testing

### 8.1 Run Complete Test
```bash
# Terminal 1: Start Kafka
docker-compose up

# Terminal 2: Start Backend
npm start

# Terminal 3: Test API
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "operator@factory.com",
    "query": "Schedule quality audit for automotive line tomorrow at 9am"
  }'
```

### 8.2 Verify Kafka Stream
```bash
# Watch Kafka messages in real-time
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic calendar-events \
  --from-beginning
```

### 8.3 Check Logs
```bash
# View application logs
tail -f logs/application.log

# View Kafka logs
docker-compose logs -f kafka

# View database activity
sqlite3 react_calendar.db "SELECT * FROM react_logs ORDER BY created_at DESC LIMIT 5;"
```

## Step 9: Production Preparation

### 9.1 Security Hardening
```bash
# Generate strong secrets
openssl rand -base64 32 > .jwt_secret
openssl rand -base64 32 > .db_encryption_key

# Update .env with generated secrets
```

### 9.2 Add PM2 for Process Management
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start server.js --name react-calendar-agent

# Save PM2 configuration
pm2 save

# Setup auto-restart
pm2 startup
```

### 9.3 Setup Nginx Reverse Proxy
```bash
# Install Nginx
brew install nginx

# Create config
cat > /usr/local/etc/nginx/servers/react-calendar.conf << 'EOF'
server {
    listen 80;
    server_name localhost;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# Start Nginx
brew services start nginx
```

## Step 10: Monitoring Setup

### 10.1 Add Health Check Endpoint
Add to server.js:
```javascript
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: db ? 'connected' : 'disconnected',
    kafka: producer ? 'connected' : 'disconnected'
  });
});
```

### 10.2 Setup Monitoring
```bash
# Test health check
curl http://localhost:3001/health

# Monitor continuously
watch -n 5 'curl -s http://localhost:3001/health | json_pp'
```

## Troubleshooting

### Issue: Kafka won't start
```bash
# Check if port 9092 is in use
lsof -i :9092

# Kill conflicting process
kill -9 <PID>

# Reset Kafka
docker-compose down -v
docker-compose up -d
```

### Issue: Database locked
```bash
# Find and kill process
lsof react_calendar.db | awk 'NR>1 {print $2}' | xargs kill -9

# Restart server
npm start
```

### Issue: Port 3001 already in use
```bash
# Find process
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change port in .env
echo "PORT=3002" >> .env
```

### Issue: Cannot connect to Kafka from server
```bash
# Test Kafka connectivity
telnet localhost 9092

# Check Kafka logs
docker logs kafka

# Verify broker is advertising correct address
docker exec kafka kafka-broker-api-versions --bootstrap-server localhost:9092
```

## Next Steps

1. **Customize for your manufacturing processes**
   - Add specific production lines
   - Configure custom event types
   - Integrate with your ERP system

2. **Enhance ReAct reasoning**
   - Add more sophisticated NLP parsing
   - Integrate actual LLM models
   - Implement machine learning for optimization

3. **Scale the system**
   - Deploy to production server
   - Setup Kafka cluster
   - Implement load balancing

4. **Add monitoring and analytics**
   - Setup Grafana dashboards
   - Implement alerting
   - Create analytics reports

## Support

For issues or questions:
1. Check the logs: `tail -f logs/application.log`
2. Review Kafka streams: http://localhost:8080
3. Inspect database: `sqlite3 react_calendar.db`
4. Consult README.md for architecture details

## Congratulations! 🎉

Your ReAct Calendar Agent is now fully operational. Start scheduling events and watch the intelligent reasoning in action!