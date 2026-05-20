# Admin

Admin sera la web app central para portafolio publico y administracion privada de proyectos.

## Vision

La portada publica funcionara como hoja de vida tecnica: resumen de cada proyecto, tecnologias utilizadas, estado, enlaces a repositorios y enlaces a dominios cuando esten definidos.

La zona privada centralizara paneles operativos con autenticacion reforzada. La autenticacion en dos pasos queda definida como siguiente fase.

## Estructura inicial

```text
apps/server-dashboard/          Dashboard actual de metricas del servidor.
apps/cerbis-conversations/      Base del panel de conversaciones y analiticas Cerbis.
docs/                           Arquitectura y plan de integracion.
```

## Modulos actuales

- Server Dashboard: consumo de recursos, servicios, disco, memoria, procesos y estado del host.
- Cerbis Conversations: panel administrativo y analiticas base para conversaciones del asistente.

## Seguridad

No se versionan tokens, `.env`, bases de datos ni logs. La zona privada debe integrarse con autenticacion, roles y 2FA antes de exponer datos sensibles.
