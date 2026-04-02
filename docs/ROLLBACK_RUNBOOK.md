# Rollback Runbook

## Trigger Conditions
- Login failures spike after release
- Users can access protected routes without authentication
- Cross-tenant data appears in UI
- High 401/403/5xx error rates after deployment

## Immediate Actions
1. Pause further deployments.
2. Notify team channel with incident start time.
3. Revert frontend deployment to previous stable artifact.
4. Keep backend unchanged unless explicitly identified as root cause.

## Rollback Procedure
1. Identify last known-good frontend release tag.
2. Redeploy previous artifact/environment version.
3. Purge CDN cache if applicable.
4. Validate smoke checks:
   - `/login` loads
   - `/dashboard` protected for unauthenticated users
   - Login works for both organizations

## Verification After Rollback
- Confirm auth flow works end-to-end.
- Confirm role-based UI behavior is restored.
- Confirm ticket pages and analytics load.
- Confirm Slack workflow visibility still intact.

## Incident Follow-up
- Capture root cause and timeline.
- Document impacted users/organizations.
- Add regression test case to QA matrix.
- Schedule patched release with explicit validation gates.
