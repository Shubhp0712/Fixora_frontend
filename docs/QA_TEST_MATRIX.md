# QA Test Matrix

## Scope
- Frontend authentication flow
- Route protection
- Role-based UI access control
- Tenant isolation headers/context
- Slack workflow regression touchpoints

## Environments
- Organization A: Alpha Corp (`org_alpha`)
- Organization B: Beta Industries (`org_beta`)

## Test Accounts
- Employee
- IT Support
- Manager
- Admin

## Matrix

| ID | Area | Scenario | Steps | Expected Result |
| --- | --- | --- | --- | --- |
| AUTH-01 | Auth | Login success | Open `/login`, submit valid details | Redirect to `/dashboard`, session created |
| AUTH-02 | Auth | Invalid/empty login data | Submit form with missing required fields | Form validation blocks submit |
| AUTH-03 | Auth | Logout | Click logout in sidebar | Session cleared, redirected to `/login` |
| AUTH-04 | Auth | Session timeout | Stay idle beyond timeout | Auto logout and redirect to `/login` |
| AUTH-05 | Route guard | Direct dashboard access without login | Open `/dashboard` in new session | Redirect to `/login` |
| AUTH-06 | Route guard | Login page while authenticated | Open `/login` after login | Redirect to `/dashboard` |
| RBAC-01 | Employee RBAC | Access admin area | Login as employee and open `/dashboard/admin` | Access denied panel displayed |
| RBAC-02 | IT support RBAC | Update ticket status | Login as IT support and open ticket detail | Status action enabled |
| RBAC-03 | Employee RBAC | Update/assign ticket | Login as employee and open ticket detail | Update/assign disabled |
| RBAC-04 | Manager/Admin RBAC | Access admin nav item | Login as manager/admin | Admin nav is visible |
| RBAC-05 | UI RBAC | Create ticket button | Login by role and inspect tickets page | Button enabled/disabled per permission |
| TENANT-01 | Tenant isolation | Org context in UI | Login as Alpha, then Beta | Sidebar shows correct org name |
| TENANT-02 | Tenant isolation | API org header | Observe requests in devtools | `X-Organization-Id` matches selected org |
| TENANT-03 | Tenant isolation | Cross-org data leakage check | Compare ticket lists between orgs | Only organization-scoped records returned |
| SLACK-01 | Slack regression | New ticket via Slack | Trigger Slack ticket workflow | Ticket appears in dashboard list |
| SLACK-02 | Slack regression | Status update from dashboard reflected | Update status in dashboard | Slack notification/event flows as expected |
| REG-01 | Regression | Landing page to login | Start at `/`, click login CTA | Navigates to `/login` |
| REG-02 | Regression | Analytics render | Open `/dashboard/analytics` | Charts render without JS errors |
| REG-03 | Regression | Knowledge base render | Open `/dashboard/kb` | List/search UI loads |
| REG-04 | Regression | Middleware | Restart app and browse protected routes | Guards still enforced |
