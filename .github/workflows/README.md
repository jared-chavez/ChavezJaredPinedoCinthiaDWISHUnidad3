# 🔄 GitHub Actions - CI/CD Workflows

Este directorio contiene los workflows de CI/CD para el proyecto.

## 📋 Workflows Disponibles

### 1. `ci-development.yml`
**Trigger:** Push y PRs a `development`

**Jobs:**
- ✅ Lint & Type Check
- ✅ Build Application
- ✅ Prisma Schema Check
- ✅ Run Tests (opcional)
- ✅ Security Audit

**Uso:** Se ejecuta automáticamente en cada push a `development`

---

### 2. `ci-main.yml`
**Trigger:** Push a `main` y ejecución manual

**Jobs:**
- ✅ Lint & Type Check
- ✅ Build Application
- ✅ Prisma Schema Check
- ✅ Run Tests
- ✅ Security Audit (estricto)
- ⚠️ Deploy (comentado, listo para configurar)

**Uso:** Se ejecuta automáticamente en cada push a `main`

---

### 3. `pr-checks.yml`
**Trigger:** Pull Requests a `main` o `development`

**Jobs:**
- ✅ PR Validation (lint, types, build)
- ✅ PR Description Check

**Uso:** Se ejecuta automáticamente en cada PR

---

### 4. `database-migration.yml`
**Trigger:** Manual o push a `main` con cambios en `schema.prisma`

**Jobs:**
- ✅ Run Database Migrations

**Uso:** Ejecutar manualmente cuando se necesiten migraciones

---

## 🔐 Secrets Requeridos

Configura estos secrets en GitHub Settings → Secrets and variables → Actions:

### Obligatorios:
- `DATABASE_URL` - URL de conexión a PostgreSQL
- `AUTH_SECRET` - Secret para NextAuth

### Opcionales (para deployment):
- `VERCEL_TOKEN` - Token de Vercel (si usas Vercel)
- `VERCEL_ORG_ID` - ID de organización Vercel
- `VERCEL_PROJECT_ID` - ID del proyecto Vercel

---

## 🚀 Configuración Inicial

1. **Crear las ramas:**
```bash
git checkout -b development
git push -u origin development
```

2. **Configurar secrets en GitHub:**
   - Ve a Settings → Secrets and variables → Actions
   - Agrega `DATABASE_URL` y `AUTH_SECRET`

3. **Hacer un push para activar los workflows:**
```bash
git push origin development
```

---

## 📊 Estado de los Workflows

Puedes ver el estado de los workflows en:
- **Actions tab** en GitHub
- **Badge de status** (opcional, agregar a README)

---

## 🔧 Personalización

### Agregar Tests

Cuando implementes tests, descomenta y configura el job `test` en los workflows.

### Agregar Deployment

1. Descomenta el job `deploy` en `ci-main.yml`
2. Configura las credenciales necesarias
3. Ajusta los pasos según tu plataforma (Vercel, AWS, etc.)

### Agregar Notificaciones

Puedes agregar notificaciones a Slack, Discord, etc. usando acciones como:
- `slackapi/slack-github-action`
- `8398a7/action-slack`

---

## 🐛 Troubleshooting

### Workflow falla en "Generate Prisma Client"
- Verifica que `DATABASE_URL` está configurado
- Usa un valor dummy para CI si no necesitas BD real

### Build falla
- Verifica que todas las variables de entorno están configuradas
- Revisa los logs del workflow para más detalles

### Tests no se ejecutan
- El job `test` tiene `continue-on-error: true` por defecto
- Implementa tests y remueve esa opción

---

## 📚 Recursos

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Migrations](https://www.prisma.io/docs/guides/migrate)
