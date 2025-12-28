# Complete Project Structure

## Directory Layout

```
react-calendar-agent/
│
├── 📄 package.json                 # Project dependencies and scripts
├── 📄 package-lock.json            # Locked dependency versions
├── 📄 .env                         # Environment variables (DO NOT COMMIT)
├── 📄 .env.example                 # Example environment config
├── 📄 .gitignore                   # Git ignore rules
├── 📄 README.md                    # Main project documentation
├── 📄 SETUP_GUIDE.md              # Detailed setup instructions
├── 📄 QUICK_REFERENCE.md          # Command cheat sheet
├── 📄 docker-compose.yml          # Kafka & Zookeeper configuration
├── 📄 langflow-config.json        # LangFlow workflow definition
├── 📄 index.html                   # Simple HTML frontend
│
├── 📂 src/                         # Source code directory
│   ├── 📄 server.js               # Main Express server
│   ├── 📄 agent.js                # ReAct agent implementation
│   ├── 📄 database.js             # Database operations
│   ├── 📄 kafka.js                # Kafka producer/consumer
│   └── 📂 utils/                  # Utility functions
│       ├── 📄 parser.js           # Query parsing utilities
│       ├── 📄 dateUtils.js        # Date manipulation helpers
│       └── 📄 logger.js           # Logging configuration
│
├── 📂 config/                      # Configuration files
│   ├── 📄 default.json            # Default configuration
│   ├── 📄 production.json         # Production configuration
│   └── 📄 development.json        # Development configuration
│
├── 📂 docs/                        # Documentation
│   ├── 📄 ARCHITECTURE.md         # System architecture details
│   ├── 📄 API.md                  # API documentation
│   ├── 📄 MANUFACTURING.md        # Manufacturing use cases
│   └── 📄 linkedin-article.md     # LinkedIn article content
│
├── 📂 logs/                        # Application logs (auto-created)
│   ├── 📄 application.log         # Main application log
│   ├── 📄 error.log               # Error logs
│   └── 📄 kafka.log               # Kafka-specific logs
│
├── 📂 backups/                     # Database backups (auto-created)
│   └── 📄 backup_YYYYMMDD.sql     # Timestamped backups
│
├── 📂 tests/                       # Test files
│   ├── 📄 agent.test.js           # ReAct agent tests
│   ├── 📄 api.test.js             # API endpoint tests
│   └── 📄 database.test.js        # Database tests
│
├── 📂 scripts/                     # Utility scripts
│   ├── 📄 setup.sh                # Initial setup script
│   ├── 📄 backup.sh               # Database backup script
│   ├── 📄 migrate.js              # Database migration
│   └── 📄 seed.js                 # Seed data for testing
│
├── 📂 ui/                          # React frontend (optional)
│   ├── 📄 package.json            # React app dependencies
│   ├── 📂 src/
│   │   ├── 📄 App.jsx             # Main React component
│   │   ├── 📄 index.jsx           # React entry point
│   │   └── 📂 components/
│   │       ├── 📄 QueryForm.jsx   # Query input form
│   │       ├── 📄 ResultDisplay.jsx  # Result display
│   │       └── 📄 EventList.jsx   # Event list view
│   └── 📂 public/
│       └── 📄 index.html          # HTML template
│
├── 📂 kafka-data/                  # Kafka data (Docker volume)
├── 📂 zookeeper-data/             # Zookeeper data (Docker volume)
└── 📄 react_calendar.db           # SQLite database (auto-created)
```

## File Contents Overview

### Root Level Files

#### package.json
- Project metadata
- npm dependencies (express, sqlite3, kafkajs, etc.)
- Scripts (start, dev, test)
- Engine requirements

#### .env (Environment Variables)
```bash
PORT=3001
DATABASE_PATH=./react_calendar.db
KAFKA_BROKERS=localhost:9092
OPENAI_API_KEY=your_key
JWT_SECRET=your_secret
```

#### docker-compose.yml
- Zookeeper service configuration
- Kafka broker configuration
- Kafka UI service
- Volume mappings
- Network settings

#### README.md
- Project overview
- Quick start guide
- Architecture description
- API documentation
- Troubleshooting

### Source Code (src/)

#### server.js (Main Backend)
```javascript
// Express server setup
// ReAct agent initialization
// API endpoints
// Kafka integration
// Database connections
// Error handling
```

Key endpoints:
- POST /api/process-query
- GET /api/events/:email
- GET /api/logs/:email
- GET /health

#### agent.js (ReAct Implementation)
```javascript
class ReActAgent {
  think()      // Reasoning phase
  act()        // Action execution
  observe()    // Result observation
  run()        // Main loop
  parseQuery() // NLP parsing
}
```

#### database.js (Database Layer)
```javascript
// SQLite connection management
// CRUD operations for events
// Logging operations
// Query builders
// Migration helpers
```

#### kafka.js (Streaming Layer)
```javascript
// Kafka producer initialization
// Consumer setup
// Topic management
// Message publishing
// Event streaming
```

### Configuration (config/)

#### default.json
```json
{
  "server": {
    "port": 3001,
    "cors": ["*"]
  },
  "database": {
    "path": "./react_calendar.db"
  },
  "kafka": {
    "brokers": ["localhost:9092"]
  }
}
```

### Documentation (docs/)

#### ARCHITECTURE.md
- System design
- Component interactions
- Data flow diagrams
- Technology stack details

#### API.md
```markdown
# API Documentation

## POST /api/process-query
Request body:
{
  "email": "string",
  "query": "string"
}

Response:
{
  "thought": "string",
  "action": "string",
  "event": {...},
  "streamId": "string"
}
```

#### MANUFACTURING.md
- Manufacturing use cases
- Production scheduling
- Quality management
- Maintenance planning
- Real-world examples

### Scripts (scripts/)

#### setup.sh
```bash
#!/bin/bash
# Install dependencies
# Create directories
# Initialize database
# Start Docker services
```

#### backup.sh
```bash
#!/bin/bash
# Backup database with timestamp
# Optional: Upload to cloud storage
# Cleanup old backups
```

#### migrate.js
```javascript
// Database schema updates
// Version management
// Rollback support
```

#### seed.js
```javascript
// Generate test data
// Sample events
// Test users
// Development fixtures
```

## Database Schema

### calendar_events
```sql
CREATE TABLE calendar_events (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  attendees TEXT,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME,
  INDEX idx_email (email),
  INDEX idx_date (date)
);
```

### react_logs
```sql
CREATE TABLE react_logs (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  query TEXT NOT NULL,
  thought TEXT,
  action TEXT,
  observation TEXT,
  result TEXT,
  stream_id TEXT,
  execution_time_ms INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_stream_id (stream_id)
);
```

## Kafka Topics Structure

### calendar-events
```json
{
  "streamId": "uuid",
  "email": "user@company.com",
  "event": {
    "id": "uuid",
    "title": "Production Meeting",
    "date": "2024-12-16",
    "time": "10:00 AM",
    "attendees": "team@company.com"
  },
  "timestamp": "2024-12-15T10:30:00Z"
}
```

### react-logs
```json
{
  "logId": "uuid",
  "email": "user@company.com",
  "thought": "Analyzing query...",
  "action": "Creating event...",
  "observation": "Success",
  "timestamp": "2024-12-15T10:30:00Z"
}
```

## Git Repository Structure

### .gitignore
```
# Dependencies
node_modules/
npm-debug.log*

# Environment
.env
.env.local

# Database
*.db
*.db-journal

# Logs
logs/
*.log

# Backups
backups/

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Docker
kafka-data/
zookeeper-data/
```

### Branches
- `main` - Stable production code
- `develop` - Development branch
- `feature/*` - Feature branches
- `hotfix/*` - Quick fixes
- `release/*` - Release preparation

## Development Workflow

### 1. Setup
```bash
git clone <repo>
cd react-calendar-agent
npm install
cp .env.example .env
# Edit .env with your values
docker-compose up -d
npm start
```

### 2. Development
```bash
git checkout -b feature/my-feature
# Make changes
npm run dev  # Auto-reload
# Test changes
git commit -m "Add my feature"
git push origin feature/my-feature
```

### 3. Testing
```bash
npm test
npm run lint
npm run coverage
```

### 4. Deployment
```bash
# Production build
npm run build

# Deploy with PM2
pm2 start server.js --name react-calendar

# Monitor
pm2 monit
```

## Data Flow

```
User Input → Express API → ReAct Agent
                ↓
        Think → Act → Observe
                ↓
        SQLite Database
                ↓
        Kafka Producer
                ↓
        Real-time Stream
                ↓
        Frontend Update
```

## Security Considerations

### Sensitive Files (Never Commit)
- `.env` - Contains secrets
- `*.db` - Contains user data
- `logs/` - May contain PII
- `backups/` - Sensitive backups

### Protected Endpoints
- `/api/*` - Require authentication
- `/health` - Public (monitoring)

### Data Protection
- JWT tokens for API auth
- Encrypted Kafka streams
- Database encryption at rest
- HTTPS in production

## Monitoring & Logging

### Log Files
```
logs/
├── application.log    # INFO level
├── error.log          # ERROR level
├── kafka.log          # Kafka events
└── access.log         # HTTP requests
```

### Monitoring Endpoints
- `/health` - Service health
- `/metrics` - Prometheus metrics
- `/stats` - Application statistics

## Scaling Strategy

### Horizontal Scaling
1. Multiple API servers (load balanced)
2. Kafka cluster (3+ brokers)
3. Database replication
4. Redis for session management

### Vertical Scaling
1. Increase server resources
2. Database optimization
3. Connection pooling
4. Caching layer

## Backup Strategy

### Automated Backups
```bash
# Daily at 2 AM
0 2 * * * /path/to/scripts/backup.sh

# Keep 30 days of backups
find backups/ -mtime +30 -delete
```

### Manual Backup
```bash
./scripts/backup.sh
```

## Maintenance Tasks

### Daily
- Check service health
- Monitor disk space
- Review error logs

### Weekly
- Database vacuum
- Clear old logs
- Update dependencies

### Monthly
- Full system backup
- Security audit
- Performance review

## Resource Requirements

### Minimum
- CPU: 2 cores
- RAM: 4GB
- Disk: 20GB
- Network: 10Mbps

### Recommended
- CPU: 4 cores
- RAM: 8GB
- Disk: 50GB SSD
- Network: 100Mbps

## Support Files

Create these additional files for production:

- `LICENSE` - Software license
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history
- `CODE_OF_CONDUCT.md` - Community standards
- `SECURITY.md` - Security policy