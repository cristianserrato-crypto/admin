# Cristian Serrato Control Center

Plataforma principal para `cristianserrato.online`: portafolio publico premium y dashboard administrativo privado para servidor, servicios y proyectos.

## Stack

- Next.js, React, TypeScript, TailwindCSS
- Framer Motion, Lucide Icons, Recharts
- Servidor Node/Express custom con Socket.IO
- JWT en cookie httpOnly, Helmet y rate limiting
- Metricas de VPS Linux, systemd, Docker, PostgreSQL y health checks por dominio

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variables minimas:

```bash
ADMIN_ACCESS_TOKEN=token-largo
JWT_SECRET=secreto-largo
PORT=3010
```

## Produccion

```bash
npm run build
npm run start
```

Rutas:

- `/`: portafolio publico.
- `/admin`: login privado y dashboard en tiempo real.
- `/api/admin/*`: endpoints protegidos.
- `/ws`: WebSocket de telemetria.

## Seguridad

No se versionan `.env`, tokens, bases de datos ni logs. El token de administrador debe vivir en variables de entorno del servidor o secret manager.
