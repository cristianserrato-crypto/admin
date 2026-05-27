# Arquitectura objetivo

## Capa publica

- Portafolio de proyectos.
- Resumen funcional de FinCSDash, Cerbis, Majic, Serata y Admin.
- Tecnologias usadas por proyecto.
- Enlaces a GitHub y dominios publicos cuando esten listos.

## Capa privada

- Login administrativo.
- Segundo factor de autenticacion pendiente de definir.
- Dashboard del servidor.
- Dashboard de conversaciones Cerbis.
- Futuras metricas por repositorio/proyecto.

## Repositorios vinculados

- `cristianserrato-crypto/FinCSDash`
- `cristianserrato-crypto/cerbis`
- `cristianserrato-crypto/Majic`
- `cristianserrato-crypto/serata`
- `cristianserrato-crypto/admin`
# Arquitectura objetivo

`cristianserrato.online` queda como dominio raiz del ecosistema.

```text
Nginx / Cloudflare
  -> cristianserrato.online  -> Node/Next Control Center :3010
  -> cerbis.online           -> Cerbis Flask/systemd
  -> majic3d.online          -> Landing Majic3D
  -> fincsdash.online        -> FinCSDash
  -> serata.online           -> Serata
```

La app principal combina landing publica y zona privada.

## Componentes

- `src/app/page.tsx`: portafolio publico.
- `src/app/admin/page.tsx`: shell autenticado del dashboard.
- `server/index.ts`: Express + Next + Socket.IO.
- `server/auth.ts`: JWT, cookie httpOnly y middleware.
- `server/metrics.ts`: telemetria Linux, systemd, Docker, PostgreSQL y dominios.

## Seguridad

- Login por token configurable con `ADMIN_ACCESS_TOKEN`.
- JWT firmado con `JWT_SECRET`.
- Cookie httpOnly, secure en produccion.
- Rate limiting en login.
- Helmet en servidor HTTP.
- Endpoints `/api/admin/metrics` y WebSocket protegidos por sesion.

## Siguientes fases

- 2FA TOTP.
- Roles por modulo.
- Persistencia historica de metricas en PostgreSQL.
- Auditoria de accesos.
- Integracion directa con logs de cada proyecto.
