# SkillForge Docker guide (Windows)

This package runs six containers:

| Container | Technology | Host URL/port |
|---|---|---|
| `frontend` | React build served by Nginx | <http://localhost:5173> |
| `api-gateway` | Express/Node.js | <http://localhost:8080/health> |
| `backend` | Spring Boot | <http://localhost:8081/actuator/health> |
| `email-service` | ASP.NET Core | <http://localhost:8082/api/email/health> |
| `chatbot-service` | FastAPI/Groq | <http://localhost:8000/api/chatbot/health> |
| `mysql` | MySQL 8.4 | `localhost:3307` |

The browser sends `/api` requests to Nginx. Nginx forwards them to the API
Gateway, the gateway forwards them to Spring Boot, and Spring Boot calls the
email and chatbot containers on Docker's private network.

## 1. Prerequisites

Install Docker Desktop for Windows and enable its WSL 2 backend. Open Docker
Desktop and wait until it says that the Docker engine is running.

Open **Command Prompt** in the folder containing `compose.yml`. Every command
below must be run from that folder.

If an older SkillForge stack is still running, go to that old project's folder
and run:

```bat
docker compose down
```

This stops the old containers but preserves their database volume and images.
You do **not** need to delete images. The updated package uses the separate
project name `skillforge-updated`, so it will not reuse the old MySQL volume.

## 2. Create the environment file

Run:

```bat
copy .env.example .env
notepad .env
```

Change at least these values. Do not add quotes unless the value itself needs
them, and do not commit or share `.env`.

| Variable | What to enter |
|---|---|
| `MYSQL_PASSWORD` | A new password for the `skillforge` application user |
| `MYSQL_ROOT_PASSWORD` | A different strong MySQL administrator password |
| `JWT_SECRET` | A random value of at least 32 characters |
| `ADMIN_PASSWORD` | A strong initial SkillForge admin password |
| `EMAIL_SERVICE_INTERNAL_API_KEY` | A long random value used only between Spring and .NET |
| `CHATBOT_INTERNAL_API_KEY` | A different long random value used only between Spring and Python |

You do not manually copy either internal key into source code. Compose injects
the same email key into Spring and .NET, and the same chatbot key into Spring
and Python.

`MYSQL_PASSWORD` is the password used by Spring Boot. `MYSQL_ROOT_PASSWORD` is
only for database administration. They should not be the same.

## 3. Configure Gmail delivery

Leave this while doing the first stack start:

```dotenv
EMAIL_ENABLE_DELIVERY=false
```

That starts email simulation mode and proves all internal routing works without
blocking the whole stack on Gmail credentials.

For real Gmail delivery:

1. Turn on 2-Step Verification for the sending Google account.
2. Open <https://myaccount.google.com/apppasswords> while signed into that
   account and create an App Password named `SkillForge`.
3. Put the generated 16-character App Password in `SMTP_PASSWORD`. Do not use
   the normal Google password. The service removes display spaces if they were
   copied.
4. Use the same Gmail address for `SMTP_USERNAME` and `SMTP_FROM_EMAIL`.
5. Set the values exactly like this:

```dotenv
EMAIL_ENABLE_DELIVERY=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_ENABLE_SSL=false
SMTP_USERNAME=youraccount@gmail.com
SMTP_PASSWORD=your-16-character-app-password
SMTP_FROM_EMAIL=youraccount@gmail.com
SMTP_FROM_NAME=SkillForge
```

Port 587 uses mandatory STARTTLS in the updated code. If Google App Passwords
are unavailable for a work/school or Advanced Protection account, use an SMTP
provider allowed by that account instead. Google documents the App Password
requirements at <https://support.google.com/mail/answer/185833>.

## 4. Configure Groq

Create a current API key at <https://console.groq.com/keys>, then add it to the
root `.env`:

```dotenv
GROQ_API_KEY=gsk_your_current_key
GROQ_MODEL=llama-3.3-70b-versatile
GROQ_TIMEOUT_SECONDS=60
GROQ_MAX_RETRIES=2
CHATBOT_TIMEOUT_MS=90000
```

The project intentionally runs the chatbot in `demo` mode when `GROQ_API_KEY`
is empty. The default model is also used in Groq's current quickstart. If Groq
later retires it, get an active model ID from
<https://console.groq.com/docs/models> and update `GROQ_MODEL`.

## 5. Validate, build, and start

First validate Compose without printing resolved secrets:

```bat
docker compose config --quiet
```

Then build and start everything:

```bat
docker compose build
docker compose up -d
docker compose ps
```

The first build downloads the Node, Java, .NET, Python, Nginx, and MySQL base
images and can take several minutes. `frontend` and `api-gateway` wait for the
backend health check; the backend waits for MySQL, email, and chatbot health
checks.

If Docker reports `lookup registry-1.docker.io: no such host`, that is a Docker
Desktop DNS/network problem, not a source-code error. Restart Docker Desktop,
disable a conflicting VPN/proxy or configure its HTTPS proxy, and retry the
build.

## 6. Verify each service

Run:

```bat
curl.exe http://localhost:8080/health
curl.exe http://localhost:8081/actuator/health
curl.exe http://localhost:8082/api/email/health
curl.exe http://localhost:8000/api/chatbot/health
```

All should return an `UP` response. The chatbot health response should say
`"mode":"groq"` after a key is configured; `"mode":"demo"` means the key was
empty when the container was created.

Useful browser addresses:

- Application: <http://localhost:5173>
- Spring Swagger: <http://localhost:8081/swagger-ui.html>
- Chatbot Swagger: <http://localhost:8000/docs>

Register a new user in the application to test the full email path. Sign in and
send a chatbot message to test the full frontend → gateway → backend → Python →
Groq path.

## 7. Check logs

Follow all logs:

```bat
docker compose logs -f --tail 200
```

Or inspect only one flow:

```bat
docker compose logs -f --since 10m email-service backend
docker compose logs -f --since 10m chatbot-service backend api-gateway
```

Press `Ctrl+C` to stop following logs; this does not stop the containers.

Email success appears as an HTTP 200 from the email service and no `Email
delivery failed` entry. A Gmail `535 5.7.8 Username and Password not accepted`
means the value is not a valid App Password for `SMTP_USERNAME`; it is not a
Docker networking or internal API key problem.

For Groq, the updated service logs distinguish an invalid key, a forbidden
model, an invalid model/request, a provider rate limit, and a connection error.

## 8. Apply `.env` changes correctly

Environment changes do not require rebuilding an image, but the affected
container must be recreated.

After changing Gmail settings:

```bat
docker compose up -d --force-recreate email-service
docker compose logs --since 2m email-service
```

After changing Groq settings:

```bat
docker compose up -d --force-recreate chatbot-service
docker compose logs --since 2m chatbot-service
```

After changing an internal API key, recreate both services that share it:

```bat
docker compose up -d --force-recreate email-service chatbot-service backend
```

After changing source code, rebuild the affected service. For example:

```bat
docker compose build email-service
docker compose up -d --force-recreate email-service
```

## 9. MySQL access and data

Open the MySQL client as the application user:

```bat
docker compose exec mysql mysql -u skillforge -p skillforge_db
```

Enter the `MYSQL_PASSWORD` value from `.env` when prompted. For administrative
access, use:

```bat
docker compose exec mysql mysql -u root -p
```

Enter `MYSQL_ROOT_PASSWORD`.

Deleting users directly can fail if related enrollments, payments, submissions,
or notifications exist. Prefer deleting through an application/admin endpoint.
For a disposable local database, a complete reset is usually safer than manual
multi-table deletion; see the destructive reset command below.

Important: MySQL reads its initialization passwords only when the named volume
is first created. Changing a password in `.env` later does not rewrite users in
an existing volume.

## 10. Stop, restart, or reset

Stop while keeping the database and uploaded files:

```bat
docker compose down
```

Start again:

```bat
docker compose up -d
```

Restart one service:

```bat
docker compose restart backend
```

Destructive local reset (deletes the Docker MySQL database and the backend
uploads volume):

```bat
docker compose down -v
```

Only use `down -v` when you intentionally want a new empty database. The data
cannot be recovered from Docker after the volume is removed unless you made a
backup.

## 11. Common problems

### A container is `unhealthy` or exited

```bat
docker compose ps
docker compose logs --tail 200 NAME-OF-SERVICE
```

Use Compose service names such as `backend`, `email-service`, or
`chatbot-service`, not a generated container ID.

### Port is already allocated

Stop the old project or change the left-side host port in `.env`, such as
`MYSQL_HOST_PORT=3308`. Internal container ports and service URLs should not be
changed.

### Internal API returns 401

The backend and target service were created with different internal keys.
Ensure there is only one root `.env`, then recreate all three application
services:

```bat
docker compose up -d --force-recreate email-service chatbot-service backend
```

### Backend cannot authenticate to MySQL

If this is disposable local data and the password was changed after the first
start, run `docker compose down -v` and start again. Otherwise change the MySQL
user password inside MySQL instead of deleting the volume.

### Frontend changed but browser still shows old code

```bat
docker compose build --no-cache frontend
docker compose up -d --force-recreate frontend
```

Then hard-refresh the browser with `Ctrl+F5`.

## 12. Production note

This Compose file is suitable for local development, demos, and a single-host
test deployment. Its database and internal service ports are bound only to
`127.0.0.1`. For an Internet deployment, put only the frontend/reverse proxy
behind HTTPS, keep MySQL and internal services private, use a secret manager,
replace seed/demo credentials, create database backups, and use a real domain in
`FRONTEND_URL`.
