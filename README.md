**Technical Architecture**

![ReAct Agent - Manufacturing Industry -Architecture diagram](https://github.com/user-attachments/assets/2f1b8842-154f-404e-975e-068541dd1914)


**The Stack** -
Our implementation combines several modern technologies:

**LangFlow / IBM Watsonx Orchestrate**  - Visual AI Orchestration. LangFlow provides the visual workflow layer for designing and managing ReAct loops. It allows production engineers to see and modify the reasoning process without diving into code.

**SQLite - Reliable Local Storage** - For production planning, we need fast, reliable data access. SQLite provides:  Zero-configuration database, Transaction support for data integrity. Perfect for single-facility operation, Easy backup and migration.

**Confluent Kafka** - Real-Time Event Streaming. Manufacturing is real-time. Kafka enables: Event-driven architecture, Real-time notifications to stakeholders, Audit trails for compliance, Integration with existing MES/ERP systems

**RESTful API Layer** - A lightweight API server that: Processes natural language queries, Executes ReAct reasoning loops, Manages database transactions, Streams events to Kafka.

**React Frontend** - Modern User Interface - An intuitive interface where operators can: Enter scheduling requests in natural language, View reasoning processes transparently, Monitor action execution in real-time, Access historical logs and analytics.

**Real-Time Streaming** - Every action triggers Kafka events: production.scheduled → Notify production manager, resource.allocated → Update MES system, maintenance.scheduled → Alert maintenance crew, quality.audit.scheduled → Inform quality team.
