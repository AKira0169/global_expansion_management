# Global Expansion Management

A full-stack NestJS project with MySQL and MongoDB. This repository includes seeders for initial test data.

## Prerequisites

- Docker & Docker Compose
- Node.js 22+
- npm

---

## deployment link

[Link](http://wsg0gg0occ8k00gks80ksksc.5.75.159.70.sslip.io)

--

## API List

You can also explore and test the API via Postman:  
[Postman Workspace](https://www.postman.com/oday-teams/workspace/global-expansion-management)

### Auth

POST /auth/login
POST /auth/signup

### Analytics

GET /analytics/top-vendors

### Project

GET /projects
POST /projects
GET /projects/:projectId/matches/rebuild

### vendors

GET /vendors
POST /vendors

--

## Seeds

npm run seed

npm run seed:mongo

--

## schema diagrams

// DBML derived from your TypeORM entities: User, Project, Vendor, Match

Table users {
id uuid [primary key]
first_name varchar
last_name varchar
email varchar [unique]
password varchar
role varchar [default: 'CLIENT', note: 'Enum in app (Role)']
company_name varchar
contact_email varchar
}

Table projects {
id uuid [primary key]
user_id uuid [not null]
name varchar
country varchar
services_needed varchar [note: 'TypeORM simple-array']
budget double
status varchar [default: 'PENDING', note: 'Enum in app (ProjectStatus)']
}

Table vendors {
id uuid [primary key]
name varchar
countries_supported varchar [note: 'TypeORM simple-array']
services_offered varchar [note: 'TypeORM simple-array']
rating double
response_sla_hours double
}

Table matches {
id uuid [primary key]
project_id uuid [not null]
vendor_id uuid [not null]
// add any other Match fields here if your entity includes them
}

// Relationships
Ref: users.id < projects.user_id
Ref: projects.id < matches.project_id
Ref: vendors.id < matches.vendor_id

--

## Environment Variables

Create a `.env` file in the root folder:

```env
MYSQL_ROOT_PASSWORD=xxxxxxxxx
MYSQL_DATABASE=mydb
MYSQL_USER=myuser
MYSQL_PASSWORD=xxxxxxxxxxxx
MYSQL_PORT=3306
MYSQL_HOST=localhost || change localhost to mysql for docker-compose


JWT_SECRET=xxxxxxxx
JWT_EXPIRES_IN=4h
ACCESSTOKEN_COOKIE_EXPIRES_IN=3600000
MONGODB_URI=mongodb://localhost:27017/global_expansion_management
MONGO_DB=global_expansion_management
MONGO_URI=mongodb://localhost:27017 ||  change localhost to mongodb for docker-compose


RESEND_API_KEY='xxxxxxxxxxxxxxxxxxxxxxxxx'
RESEND_EMAIL='xxxxxxxxxxxxxxx'
```
