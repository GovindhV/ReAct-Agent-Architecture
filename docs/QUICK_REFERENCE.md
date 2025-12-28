# Quick Reference - Essential Commands

## 🚀 Start/Stop Services

### Start Everything
```bash
# Terminal 1: Start Kafka
docker-compose up -d

# Terminal 2: Start Backend Server
npm start

# Terminal 3: Open Frontend
open index.html
# or
open http://localhost:3000  # if using React dev server
```

### Stop Everything
```bash
# Stop server (Ctrl+C in Terminal 2)

# Stop Kafka
docker-compose down

# Stop with cleanup
docker-compose down -v
```

## 📊 Kafka Commands

### View Kafka UI
```bash
open http://localhost:8080
```

### List Topics
```bash
docker exec -it kafka kafka-topics --list --bootstrap-server localhost:9092
```

### Create Topic
```bash
docker exec -it kafka kafka-topics --create \
  --topic calendar-events \
  --bootstrap-server localhost:9092 \
  --partitions 3 \
  --replication-factor 1
```

### Consume Messages
```bash
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic calendar-events \
  --from-beginning
```

### Produce Test Message
```bash
docker exec -it kafka kafka-console-producer \
  --bootstrap-server localhost:9092 \
  --topic calendar-events
# Type message and press Enter
```

## 💾 Database Commands

### Open Database
```bash
sqlite3 react_calendar.db
```

### Quick Queries
```sql
-- View all events
SELECT * FROM calendar_events ORDER BY created_at DESC LIMIT 10;

-- View ReAct logs
SELECT * FROM react_logs ORDER BY created_at DESC LIMIT 10;

-- Count events by email
SELECT email, COUNT(*) as event_count 
FROM calendar_events 
GROUP BY email;

-- View today's events
SELECT * FROM calendar_events 
WHERE date = date('now');

-- Clear all data (careful!)
DELETE FROM calendar_events;
DELETE FROM react_logs;
```

### Export Database
```bash
sqlite3 react_calendar.db .dump > backup.sql
```

### Import Database
```bash
sqlite3 react_calendar.db < backup.sql
```

## 🧪 API Testing

### Test Query Processing
```bash
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "query": "Schedule meeting tomorrow at 2pm"
  }'
```

### Get Events for User
```bash
curl http://localhost:3001/api/events/test@company.com
```

### Get Logs for User
```bash
curl http://localhost:3001/api/logs/test@company.com
```

### Health Check
```bash
curl http://localhost:3001/health
```

### Pretty JSON Output
```bash
curl http://localhost:3001/api/events/test@company.com | json_pp
# or
curl http://localhost:3001/api/events/test@company.com | jq .
```

## 🔍 Debugging

### View Server Logs
```bash
# If using npm start
# Logs appear in terminal

# If using PM2
pm2 logs react-calendar-agent

# View log file
tail -f logs/application.log
```

### View Kafka Logs
```bash
docker-compose logs -f kafka
```

### View All Container Logs
```bash
docker-compose logs -f
```

### Check Ports
```bash
# Check if ports are in use
lsof -i :3001  # Backend
lsof -i :9092  # Kafka
lsof -i :8080  # Kafka UI
lsof -i :2181  # Zookeeper
```

### Check Docker Status
```bash
docker ps
docker-compose ps
docker stats
```

## 🛠️ Development

### Install Dependencies
```bash
npm install
```

### Update Dependencies
```bash
npm update
```

### Run in Development Mode
```bash
npm run dev  # Uses nodemon for auto-reload
```

### Reset Everything
```bash
# Stop all services
docker-compose down -v

# Remove database
rm react_calendar.db

# Clear logs
rm -rf logs/*

# Reinstall dependencies
rm -rf node_modules
npm install

# Start fresh
docker-compose up -d
npm start
```

## 📦 Production

### Start with PM2
```bash
pm2 start server.js --name react-calendar-agent
pm2 save
pm2 startup
```

### PM2 Commands
```bash
pm2 list                    # List all processes
pm2 logs react-calendar-agent  # View logs
pm2 restart react-calendar-agent  # Restart
pm2 stop react-calendar-agent     # Stop
pm2 delete react-calendar-agent   # Remove
pm2 monit                   # Monitor
```

### Backup Database
```bash
# Create backup directory
mkdir -p backups

# Backup with timestamp
sqlite3 react_calendar.db .dump > backups/backup_$(date +%Y%m%d_%H%M%S).sql

# Or copy file directly
cp react_calendar.db backups/backup_$(date +%Y%m%d_%H%M%S).db
```

## 🔧 Maintenance

### Clear Old Logs (Keep last 30 days)
```sql
DELETE FROM react_logs 
WHERE created_at < datetime('now', '-30 days');

DELETE FROM calendar_events 
WHERE created_at < datetime('now', '-30 days');

VACUUM;
```

### Check Database Size
```bash
ls -lh react_calendar.db
```

### Optimize Database
```sql
PRAGMA optimize;
VACUUM;
ANALYZE;
```

### Update Kafka Topics
```bash
# Delete topic
docker exec -it kafka kafka-topics --delete \
  --topic old-topic \
  --bootstrap-server localhost:9092

# Describe topic
docker exec -it kafka kafka-topics --describe \
  --topic calendar-events \
  --bootstrap-server localhost:9092
```

## 🌐 Network

### Test Connectivity
```bash
# Test backend
curl http://localhost:3001/health

# Test Kafka
telnet localhost 9092

# Test Kafka UI
curl http://localhost:8080
```

### Find Process Using Port
```bash
lsof -i :3001
```

### Kill Process on Port
```bash
kill -9 $(lsof -t -i:3001)
```

## 📈 Monitoring

### Watch Health Continuously
```bash
watch -n 2 'curl -s http://localhost:3001/health | jq .'
```

### Monitor Database Activity
```bash
watch -n 5 'sqlite3 react_calendar.db "SELECT COUNT(*) as events FROM calendar_events; SELECT COUNT(*) as logs FROM react_logs;"'
```

### Monitor Kafka Consumer Lag
```bash
docker exec -it kafka kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --describe \
  --group react-calendar-group
```

## 🎯 Example Queries

### Production Scheduling
```bash
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "supervisor@factory.com",
    "query": "Schedule 500 units of Model X on Line 3 next Monday"
  }'
```

### Quality Audit
```bash
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "quality@factory.com",
    "query": "Schedule quality audit for automotive line tomorrow morning"
  }'
```

### Maintenance Window
```bash
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maintenance@factory.com",
    "query": "Book maintenance window for Machine M-456 this Sunday"
  }'
```

## 🚨 Emergency Commands

### Kill All Node Processes
```bash
pkill -f node
```

### Reset Kafka Completely
```bash
docker-compose down -v
rm -rf kafka-data zookeeper-data
docker-compose up -d
```

### Force Database Reset
```bash
rm react_calendar.db
npm start
```

### Check System Resources
```bash
# CPU and Memory
top
htop  # if installed

# Disk space
df -h

# Docker resources
docker stats
```

## 📝 Git Commands

### Initial Setup
```bash
git init
git add .
git commit -m "Initial commit: ReAct Calendar Agent"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```

### Regular Updates
```bash
git add .
git commit -m "Your commit message"
git push
```

### Create Branch
```bash
git checkout -b feature/new-feature
git push -u origin feature/new-feature
```

## 🔐 Security

### Generate Secrets
```bash
# JWT Secret
openssl rand -base64 32

# Database encryption key
openssl rand -hex 32

# API key
uuidgen
```

### Check Open Ports
```bash
sudo lsof -i -P -n | grep LISTEN
```

## 💡 Tips

### Quick Restart
```bash
# Create alias in ~/.zshrc or ~/.bashrc
alias restart-calendar='docker-compose restart && pm2 restart react-calendar-agent'
```

### Monitor Everything
```bash
# Terminal multiplexer
tmux new -s calendar
# Split panes:
# Ctrl+b % (vertical split)
# Ctrl+b " (horizontal split)
# Ctrl+b arrow keys (navigate)
```

### Auto-format Logs
```bash
tail -f logs/application.log | jq .
```