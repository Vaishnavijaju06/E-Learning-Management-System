# SkillForge Frontend

SkillForge is a responsive E-Learning Platform frontend built for a CDAC project evaluation.

## Current milestone

Phase 1 provides:

- React + Vite project setup
- Bootstrap 5 and Bootstrap Icons
- SkillForge design system and responsive theme
- Public navbar and footer
- Public, authentication, student, instructor and admin layouts
- Central route configuration
- Responsive role-specific sidebars
- Landing page foundation
- 404 and unauthorized screens

Business workflows, authentication, mock services and full feature screens will be added in the following phases.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, normally `http://localhost:5173`.

## Production check

```bash
npm run build
npm run preview
```

## Planned demo credentials

| Role | Email | Password |
|---|---|---|
| Student | student@skillforge.com | Student@123 |
| Instructor | instructor@skillforge.com | Instructor@123 |
| Admin | admin@skillforge.com | Admin@123 |

These credentials become functional when mock authentication is implemented in Phase 4.

## Backend integration plan

Service modules introduced in Phase 2 will isolate local mock storage. Later, their mock methods can be replaced with Axios calls to Spring Boot without rewriting page components.
