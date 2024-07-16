# Post MAnagement.

## Project
Post Management
Author: Ayoade Lala <ayoadelala@yahoo.com>

## Enum Values

 vote_type?: string = ['up_vote', 'down_vote']
 role: ['admin', 'user'] 
status: ['active', 'inactive']

### Deployment
1. Define Environmental Variables. 
```bash
BASE_PATH=http://localhost
SERVICE_NAME=Post Management
SERVICE_URL=http://localhost
NODE_ENV=development
APP_URL=http://localhost/api/v1
WEB_URL=http://localhost:4200

PORT=4600

DB_DIALECT=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=megaexe_db

#Never set to true in production, you can lose production data
DB_SYNC=false
DB_LOG=false

PROFILE_BASE_URL=http://localhost:4600/api/v1
DOCUMENT_BASE_URL=http://localhost:4600/api/v1

EMAIL_HOST=smtp-pulse.com
EMAIL_PORT=465
EMAIL_EMAIL=
EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_SECURE=true

THROTTLE_TTL=60
THROTTLE_LIMIT=60
HTTP_TIMEOUT=5000
HTTP_MAX_REDIRECTS=5
JWT_SECRET=r5u8x/A?D(G+KbPdSgVkYp3s6v9y$B&E
JWT_EXPIRY=6000
ENCRYPTION_KEY=dSgVkYp3s6v9y$B&E(H+MbQeThWmZq4t
# Must be 256 bits (32 characters)

OTP_EXPIRY_DURATION=86400

NEVER_BOUNCE_API_KEY=

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASS=
REDIS_DB=0

CACHE_EXPIRE_TIME=3600
CACHE_TTL=2
I18N_LANG=en
I18N_SOURCE=/i18n/
BVN_URL=
PWA_BASE_URL=
DD_SWITCH=
DD_BASE_URL=
```




2. Install dependencies
```bash
$ cd Digit
$ yarn install
```

6. Start App
```bash
$ yarn run start // app is started on port 3005
$ yarn run start:watch // watch changes only
$ yarn run start:debug // watch and debug
$ yarn run build // build for production
$ yarn run start:prod
```

7. More Out of the Box
```bash
Swagger/Open Api Documentation and Test
- visit http://localhost:3005/api
- visit http://localhost:3005/api/json

Compodoc Documentation
- run  `$ npx @compodoc/compodoc -p tsconfig.json -s`
- visit http://localhost:8080.

HealthChecks using Terminus
- visit http://localhost:3005/health
```

### More CLI Operations
1. Run Migration
```bash
$ npm run migrate:run 
```
See [Migration](https://typeorm.io/#/migrations) for more.

2. Run Seeding
```
$ npm run seed:run 
```

### User Languange
The default language is English ('en'). To select a custom language for a request, clients can use any of the following options:
1. Query - add `lang=en`to all query
```
...?lang=en
```

2. Header - add `x-aella-lang=en`to request header
```
x-aella-lang=en
```

### Todo
- Add unit test
- A backdoor for customer care, a readonly login as a customer
