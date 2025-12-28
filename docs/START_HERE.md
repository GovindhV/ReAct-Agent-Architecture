# 🚀 START HERE - Quick Start Guide

Welcome to the ReAct Calendar Agent! This guide will get you up and running in 10 minutes.

## ⚡ Super Quick Start (5 Commands)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment file
cp .env.example .env

# 3. Start Kafka
docker-compose up -d

# 4. Start server
npm start

# 5. Open UI
open index.html
```

That's it! You're ready to schedule events.

## 📋 What You Need Before Starting

- ✅ macOS (iMac)
- ✅ Node.js 16+ ([Download](https://nodejs.org/))
- ✅ Docker Desktop ([Download](https://www.docker.com/products/docker-desktop/))
- ✅ 10 minutes of time

## 🎯 Step-by-Step Setup

### Step 1: Get the Code
```bash
# If from GitHub
git clone <your-repo-url>
cd react-calendar-agent

# If you have the files already
cd react-calendar-agent
```

### Step 2: Install Dependencies
```bash
npm install
```
*This installs Express, SQLite, Kafka client, and other tools.*

### Step 3: Configure Environment
```bash
# Copy the example environment file
cp .env.example .env

# (Optional) Edit .env if needed
nano .env
```
*Default settings work fine for local development.*

### Step 4: Start Kafka & Zookeeper
```bash
# Start Docker services
docker-compose up -d

# Verify they're running
docker-compose ps

# You should see:
# ✓ kafka - Up
# ✓ zookeeper - Up
# ✓ kafka-ui - Up
```

### Step 5: Start the Server
```bash
npm start

# You should see:
# ✓ Connected to SQLite database
# ✓ Database tables initialized
# ✓ Kafka producer and consumer connected
# ✓ ReAct Calendar Server running on http://localhost:3001
```

### Step 6: Open the UI
```bash
# Option 1: Direct file
open index.html

# Option 2: Local server (better)
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

## 🧪 Test It Out

### In the Web UI:
1. Email: `test@company.com`
2. Query: `Schedule a production meeting tomorrow at 10am`
3. Click "Process Query"
4. Watch the ReAct reasoning happen!

### From Command Line:
```bash
curl -X POST http://localhost:3001/api/process-query \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@company.com",
    "query": "Schedule quality audit Friday afternoon"
  }'
```

## 📊 View What's Happening

### Kafka UI (See real-time messages)
```bash
open http://localhost:8080
```

### Database (See stored events)
```bash
sqlite3 react_calendar.db "SELECT * FROM calendar_events;"
```

### Logs (See server activity)
```bash
tail -f logs/application.log
```

## 🎓 Try These Examples

Copy these into the Query field:

### Manufacturing Queries:
```
Schedule 500 units of Model X on Line 3 next Monday

Schedule quality audit for automotive line tomorrow morning

Book maintenance window for Machine M-456 this Sunday

Create supplier meeting next Tuesday at 3pm

Schedule inventory check for Wednesday afternoon
```

### General Queries:
```
Schedule a team meeting tomorrow at 2pm

Create a project review session Friday morning

Book conference room for client presentation next week
```

## 🐛 Troubleshooting

### "Cannot connect to server"
```bash
# Check if server is running
lsof -i :3001

# If not, start it
npm start
```

### "Kafka connection failed"
```bash
# Check Docker
docker ps

# Restart Kafka
docker-compose restart kafka

# If still failing
docker-compose down
docker-compose up -d
```

### "Port already in use"
```bash
# Find what's using the port
lsof -i :3001

# Kill it
kill -9 <PID>

# Or change the port in .env
echo "PORT=3002" >> .env
```

### "Database locked"
```bash
# Remove the database file
rm react_calendar.db

# Restart the server (it will recreate)
npm start
```

## 🎉 You're Ready!

You now have a fully functional ReAct Calendar Agent running on your iMac!

## 📚 Next Steps

### Learn More:
- **README.md** - Complete project documentation
- **SETUP_GUIDE.md** - Detailed setup instructions
- **QUICK_REFERENCE.md** - Command cheat sheet
- **docs/ARCHITECTURE.md** - System architecture
- **docs/MANUFACTURING.md** - Manufacturing use cases

### Customize It:
1. **Add your production lines** - Edit the event types
2. **Connect to your systems** - Integrate ERP/MES
3. **Add more reasoning** - Enhance the ReAct agent
4. **Deploy to production** - Use PM2 and Nginx

### Explore Features:
```bash
# View all events for a user
curl http://localhost:3001/api/events/test@company.com

# View ReAct reasoning logs
curl http://localhost:3001/api/logs/test@company.com

# Watch Kafka messages in real-time
docker exec -it kafka kafka-console-consumer \
  --bootstrap-server localhost:9092 \
  --topic calendar-events \
  --from-beginning
```

## 🚀 Running Automated Setup

If you prefer, use the automated setup script:

```bash
chmod +x setup.sh
./setup.sh
```

This will:
- Check prerequisites
- Install dependencies
- Start Kafka
- Create database
- Set up Kafka topics
- Generate security keys

## 🆘 Need Help?

### Check the Logs
```bash
# Server logs
npm start

# Kafka logs
docker-compose logs kafka

# Database
sqlite3 react_calendar.db
```

### Run Tests
```bash
chmod +x test-api.sh
./test-api.sh
```

### Health Check
```bash
curl http://localhost:3001/health
```

## 🎯 What You Can Do Now

✅ **Schedule Events** - Use natural language queries
✅ **View Reasoning** - See how the AI thinks
✅ **Track Actions** - Monitor what gets executed
✅ **Stream Events** - Real-time Kafka streaming
✅ **Query History** - Search past events and logs
✅ **Manufacturing Focus** - Production planning ready

## 🔥 Cool Things to Try

### 1. Complex Production Query
```
Schedule 1000 units of Model Y on Lines 2 and 3 starting next Monday, 
with quality checkpoints every 200 units and maintenance breaks scheduled
```

### 2. Multi-Step Reasoning
```
Schedule a supplier meeting for Friday, but check if the procurement 
team is available and book the large conference room
```

### 3. Conditional Scheduling
```
Schedule quality audit for automotive line if defect rate exceeded 
threshold this week
```

## 📈 Monitor Your System

### Dashboard URLs:
- **Main UI**: http://localhost:8000 (or open index.html)
- **API Server**: http://localhost:3001
- **Kafka UI**: http://localhost:8080
- **Health Check**: http://localhost:3001/health

### Quick Status Check:
```bash
# One command to check everything
echo "Server:" && curl -s http://localhost:3001/health | jq .status
echo "Kafka:" && docker ps | grep kafka | awk '{print $NF}'
echo "Database:" && ls -lh react_calendar.db
```

## 🎊 Success Checklist

- [ ] npm install completed
- [ ] Docker containers running
- [ ] Server started on port 3001
- [ ] UI opens in browser
- [ ] First query processed successfully
- [ ] Event visible in Kafka UI
- [ ] Data saved in database

## 🚀 You're All Set!

Start scheduling events with AI-powered reasoning. The system learns and adapts as you use it.

**Happy Scheduling! 🗓️✨**

---

*For detailed documentation, see README.md*
*For commands, see QUICK_REFERENCE.md*
*For architecture, see docs/ARCHITECTURE.md*