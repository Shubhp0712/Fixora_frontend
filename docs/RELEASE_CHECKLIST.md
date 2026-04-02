# Release Checklist

## Pre-Deployment
- [ ] Pull latest `main`
- [ ] Install dependencies (`npm ci`)
- [ ] Verify `.env` values from `.env.example`
- [ ] Confirm backend API URL is reachable
- [ ] Confirm session timeout value approved

## Build & Validation
- [ ] Run lint (`npm run lint`)
- [ ] Run production build (`npm run build`)
- [ ] Execute QA matrix critical cases (auth, RBAC, tenant, regression)
- [ ] Validate middleware route guards in production mode

## Security & Access
- [ ] Verify unauthorized access to `/dashboard/*` redirects to `/login`
- [ ] Verify admin features hidden from non-admin roles
- [ ] Verify role-restricted ticket actions are disabled for insufficient roles
- [ ] Verify auth headers (`Authorization`, `X-Organization-Id`) are sent

## Integration Checks
- [ ] Verify ticket list/detail works against current backend
- [ ] Verify analytics and KB pages load without API errors
- [ ] Verify Slack-originated tickets appear in dashboard

## Deployment
- [ ] Deploy to staging
- [ ] Execute smoke tests for both organizations
- [ ] Deploy to production
- [ ] Monitor logs and client error telemetry for 30 minutes

## Post-Deployment
- [ ] Confirm login/logout works in production
- [ ] Confirm session timeout behavior
- [ ] Confirm no cross-tenant data leakage
- [ ] Announce release completion to team
