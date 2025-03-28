# Microservices Architecture

A scalable microservices architecture with Users and Notifications services, using MongoDB, RabbitMQ, and Docker.

## Services Overview

| Service                   | Description                | Technology        |
| ------------------------- | -------------------------- | ----------------- |
| **Users Service**         | Manages user data          | Node.js, MongoDB  |
| **Notifications Service** | Handles notifications      | Node.js, RabbitMQ |
| **MongoDB**               | Database for Users service | MongoDB 6.0       |
| **RabbitMQ**              | Message broker             | RabbitMQ 3.12     |

## Prerequisites

- Docker v27.4.0+
- Docker Compose v2.31.0+
- Node.js v18+
- Git

## Quick Start

```bash
# Clone repository
git clone git@github.com:Dmitrena/mg-app.git
cd mg-app

# Start services
docker-compose up -d --build

# Verify running services
docker-compose ps
```

## Services Access

| Service                | PORT  | URL                       |
| ---------------------- | ----- | ------------------------- |
| **Users Service**      | 3000  | http://localhost:3000     |
| **MongoDB**            | 27017 | mongodb://localhost:27017 |
| **RabbitMQ**           | 5672  | amqp://localhost:5672     |
| **RabbitMQ Managment** | 15672 | http://localhost:15672    |

## Development

```bash
# Install dependencies
cd users && npm install
cd ../notifications && npm install

# Users service
cd users && npm run start:dev

# Notifications service
cd notifications && npm run start:dev
```

## Services Access

| Service                | PORT  | URL                       |
| ---------------------- | ----- | ------------------------- |
| **Users Service**      | 3000  | http://localhost:3000     |
| **MongoDB**            | 27017 | mongodb://localhost:27017 |
| **RabbitMQ**           | 5672  | amqp://localhost:5672     |
| **RabbitMQ Managment** | 15672 | http://localhost:15672    |

Default credentials:

MongoDB: admin/admin ||
RabbitMQ: admin/admin
