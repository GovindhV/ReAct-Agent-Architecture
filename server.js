const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const { Kafka } = require('kafkajs');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

//http://localhost:8000/react_agent_demo/src/ui/

const app = express();
app.use(cors());
app.use(express.json());

// Initialize SQLite Database
const db = new sqlite3.Database('./react_calendar.db', (err) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize Kafka
const kafka = new Kafka({
  clientId: 'react-calendar-agent',
  brokers: ['localhost:9092']
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'react-calendar-group' });

// Database Schema
function initializeDatabase() {
  db.run(`
    CREATE TABLE IF NOT EXISTS calendar_events (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      title TEXT NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      attendees TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS react_logs (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      query TEXT NOT NULL,
      thought TEXT,
      action TEXT,
      observation TEXT,
      result TEXT,
      stream_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log('Database tables initialized');
}

// ReAct Agent Implementation
class ReActAgent {
  constructor() {
    this.maxIterations = 5;
  }

  async think(query, context) {
    // Simulate LLM reasoning
    const thought = `Analyzing query: "${query}". User wants to schedule an event. I need to extract event details and create a calendar entry.`;
    return thought;
  }

  async act(query, thought) {
    // Parse the query to extract event details
    const eventDetails = this.parseQuery(query);
    
    const action = {
      type: 'CREATE_CALENDAR_EVENT',
      details: eventDetails,
      description: `Creating calendar event: ${eventDetails.title}`
    };
    
    return action;
  }

  parseQuery(query) {
    // Simple NLP parsing (in production, use proper NLP library)
    const now = new Date();
    
    // Extract time
    const timeMatch = query.match(/(\d{1,2})(am|pm|:\d{2})/i);
    const time = timeMatch ? this.normalizeTime(timeMatch[0]) : '10:00 AM';
    
    // Extract date
    const date = this.extractDate(query, now);
    
    // Extract title
    const title = this.extractTitle(query);
    
    // Extract attendees
    const attendees = this.extractAttendees(query);
    
    return {
      title,
      date,
      time,
      attendees,
      description: query
    };
  }

  normalizeTime(timeStr) {
    // Normalize time format
    if (timeStr.includes(':')) {
      return timeStr.toUpperCase();
    }
    const hour = parseInt(timeStr);
    const isPM = timeStr.toLowerCase().includes('pm');
    return `${hour}:00 ${isPM ? 'PM' : 'AM'}`;
  }

  extractDate(query, now) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('tomorrow')) {
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    
    if (lowerQuery.includes('next monday')) {
      const nextMonday = new Date(now);
      const daysUntilMonday = (8 - nextMonday.getDay()) % 7;
      nextMonday.setDate(nextMonday.getDate() + (daysUntilMonday || 7));
      return nextMonday.toISOString().split('T')[0];
    }
    
    if (lowerQuery.includes('next tuesday')) {
      const nextTuesday = new Date(now);
      const daysUntilTuesday = (9 - nextTuesday.getDay()) % 7;
      nextTuesday.setDate(nextTuesday.getDate() + (daysUntilTuesday || 7));
      return nextTuesday.toISOString().split('T')[0];
    }
    
    if (lowerQuery.includes('friday')) {
      const friday = new Date(now);
      const daysUntilFriday = (12 - friday.getDay()) % 7;
      friday.setDate(friday.getDate() + (daysUntilFriday || 7));
      return friday.toISOString().split('T')[0];
    }
    
    if (lowerQuery.includes('wednesday')) {
      const wednesday = new Date(now);
      const daysUntilWednesday = (10 - wednesday.getDay()) % 7;
      wednesday.setDate(wednesday.getDate() + (daysUntilWednesday || 7));
      return wednesday.toISOString().split('T')[0];
    }
    
    // Default to tomorrow
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }

  extractTitle(query) {
    // Extract meeting/event title
    const patterns = [
      /schedule (?:a |an )?(.+?)(?:meeting|event|call|session)/i,
      /create (?:a |an )?(.+?)(?:meeting|event|call|session)/i,
      /book (?:a |an )?(.+?)(?:meeting|event|call|session)/i
    ];
    
    for (const pattern of patterns) {
      const match = query.match(pattern);
      if (match) {
        return match[1].trim() + ' meeting';
      }
    }
    
    return 'Scheduled Meeting';
  }

  extractAttendees(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('production team')) return 'production-team@company.com';
    if (lowerQuery.includes('quality')) return 'quality@company.com';
    if (lowerQuery.includes('supplier')) return 'suppliers@company.com';
    if (lowerQuery.includes('management')) return 'management@company.com';
    
    return 'team@company.com';
  }

  async observe(action) {
    // Execute the action and observe results
    try {
      if (action.type === 'CREATE_CALENDAR_EVENT') {
        const eventId = uuidv4();
        const event = { id: eventId, ...action.details };
        
        return {
          success: true,
          event,
          message: `Successfully created calendar event: ${event.title}`
        };
      }
      
      return { success: false, message: 'Unknown action type' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async run(email, query) {
    const iterations = [];
    
    // Iteration 1: Think
    const thought = await this.think(query, {});
    iterations.push({ step: 'think', content: thought });
    
    // Iteration 2: Act
    const action = await this.act(query, thought);
    iterations.push({ step: 'act', content: action });
    
    // Iteration 3: Observe
    const observation = await this.observe(action);
    iterations.push({ step: 'observe', content: observation });
    
    return {
      thought,
      action: action.description,
      observation: observation.message,
      result: observation,
      iterations
    };
  }
}

// Initialize Kafka
async function initKafka() {
  try {
    await producer.connect();
    await consumer.connect();
    await consumer.subscribe({ topic: 'calendar-events', fromBeginning: true });
    
    console.log('Kafka producer and consumer connected');
    
    // Start consuming messages
    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const event = JSON.parse(message.value.toString());
        console.log('Received event from Kafka:', event);
      },
    });
  } catch (error) {
    console.error('Kafka initialization error:', error);
    console.log('Continuing without Kafka - make sure Kafka is running on localhost:9092');
  }
}

// API Endpoints
app.post('/api/process-query', async (req, res) => {
  try {
    const { email, query } = req.body;
    
    if (!email || !query) {
      return res.status(400).json({ error: 'Email and query are required' });
    }
    
    // Initialize ReAct Agent
    const agent = new ReActAgent();
    
    // Run ReAct loop
    const result = await agent.run(email, query);
    
    // Generate stream ID
    const streamId = uuidv4();
    
    // Save to database
    if (result.result.success) {
      const event = result.result.event;
      
      db.run(
        `INSERT INTO calendar_events (id, email, title, date, time, attendees, description)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [event.id, email, event.title, event.date, event.time, event.attendees, event.description],
        (err) => {
          if (err) console.error('Database insert error:', err);
        }
      );
      
      // Stream to Kafka
      try {
        await producer.send({
          topic: 'calendar-events',
          messages: [
            {
              key: streamId,
              value: JSON.stringify({
                streamId,
                email,
                event,
                timestamp: new Date().toISOString()
              })
            }
          ]
        });
      } catch (kafkaErr) {
        console.log('Kafka streaming skipped (not connected)');
      }
    }
    
    // Log ReAct process
    db.run(
      `INSERT INTO react_logs (id, email, query, thought, action, observation, result, stream_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        email,
        query,
        result.thought,
        result.action,
        result.observation,
        JSON.stringify(result.result),
        streamId
      ]
    );
    
    res.json({
      thought: result.thought,
      action: result.action,
      observation: result.observation,
      event: result.result.event,
      streamId,
      success: true
    });
    
  } catch (error) {
    console.error('Error processing query:', error);
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/events/:email', (req, res) => {
  const { email } = req.params;
  
  db.all(
    'SELECT * FROM calendar_events WHERE email = ? ORDER BY date DESC',
    [email],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ events: rows });
    }
  );
});

app.get('/api/logs/:email', (req, res) => {
  const { email } = req.params;
  
  db.all(
    'SELECT * FROM react_logs WHERE email = ? ORDER BY created_at DESC LIMIT 10',
    [email],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ logs: rows });
    }
  );
});

// Initialize and start server
const PORT = process.env.PORT || 3001;

async function startServer() {
  await initKafka();
  
  app.listen(PORT, () => {
    console.log(`ReAct Calendar Server running on http://localhost:${PORT}`);
  });
}

startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  await producer.disconnect();
  await consumer.disconnect();
  db.close();
  process.exit(0);
});