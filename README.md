# Global Expansion Management

A full-stack NestJS project with MySQL and MongoDB. This repository includes seeders for initial test data.

## Prerequisites

- Docker & Docker Compose
- Node.js 22+
- npm

---

## Environment Variables

Create a `.env` file in the root folder:

```env
MYSQL_ROOT_PASSWORD=xxxxxxxxx
MYSQL_DATABASE=mydb
MYSQL_USER=myuser
MYSQL_PASSWORD=xxxxxxxxxxxx
MYSQL_PORT=3306
MYSQL_HOST=localhost || for docker-compose it would be mysql

JWT_SECRET=xxxxxxxx
JWT_EXPIRES_IN=4h
ACCESSTOKEN_COOKIE_EXPIRES_IN=3600000
MONGODB_URI=mongodb://localhost:27017/global_expansion_management
MONGO_DB=global_expansion_management
MONGO_URI=mongodb://localhost:27017 || for docker-compose it would be mongodb


RESEND_API_KEY='xxxxxxxxxxxxxxxxxxxxxxxxx'
RESEND_EMAIL='xxxxxxxxxxxxxxx'
```
