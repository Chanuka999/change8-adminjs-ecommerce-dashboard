# change8-adminjs-ecommerce-dashboard
Role-Based eCommerce Admin Dashboard using AdminJS, Sequelize and PostgreSQL

## Deployment (Vercel)

Before the first production deploy, sync your database schema manually:

```bash
npm run db:sync
```

This uses `scripts/sync-db.js` and runs Sequelize `sync` with safe defaults:

- `alter=false`
- `force=false`

If you intentionally need alter mode, set an environment variable before running:

- PowerShell: `$env:DB_SYNC_ALTER="true"; npm run db:sync`
- CMD: `set DB_SYNC_ALTER=true && npm run db:sync`

Vercel runtime should have these environment variables configured:

- `DB_HOST`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `JWT_SECRET`
- `SESSION_SECRET`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NODE_ENV=production`
