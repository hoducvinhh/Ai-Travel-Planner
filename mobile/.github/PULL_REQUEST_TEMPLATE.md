# Pull Request Checklist

## PR Information

**Branch:** `mobile/feature-name`  
**Type:** [ ] Feature [ ] Bug Fix [ ] Refactor [ ] Documentation  
**Related Issue:** #___

## Description

Brief description of what this PR does.

## Changes Made

- Change 1
- Change 2
- Change 3

## Screenshots (for UI changes)

### Before
[Screenshot or N/A]

### After
[Screenshot or N/A]

## Pre-Submission Checklist

### Code Quality

- [ ] `flutter analyze` passes with 0 issues
- [ ] `flutter test` passes (all tests green)
- [ ] `flutter build apk --debug` succeeds
- [ ] Code follows architecture patterns (Screen → Provider → Repository → Service)
- [ ] No business logic in screens
- [ ] Error handling implemented in repositories

### Scope Compliance

- [ ] **CRITICAL:** Only `mobile/` files modified
- [ ] No changes to `backend/`, `frontend/`, `ml-service/`, `database/`
- [ ] Branch name starts with `mobile/`
- [ ] All commit messages start with `mobile:`
- [ ] Verified with: `git diff --name-only origin/main | grep -v "^mobile/"`

### UI/UX Standards

- [ ] Used `AppColors.*` constants (no raw hex colors)
- [ ] Used `LucideIcons.*` (no Material Icons)
- [ ] All components have rounded corners (`AppRadius.sm/md/lg`)
- [ ] Icons are black/white/gray only (no colored icons on light backgrounds)
- [ ] Text contrast meets WCAG AA (4.5:1 minimum)
- [ ] Touch targets are minimum 48x48dp
- [ ] Animations are subtle (150-250ms) and purposeful
- [ ] No "AI slop" patterns (glass morphism, gradient overload, giant emojis)

### Backend Integration

- [ ] Only calls existing backend endpoints (no backend code modified)
- [ ] Handles API errors gracefully
- [ ] No hardcoded API URLs (uses `Env.apiUrl`)
- [ ] If endpoint is missing: created issue with `backend-needed` label

### Security

- [ ] No hardcoded secrets (API keys, passwords)
- [ ] Sensitive data stored in `FlutterSecureStorage` (not `SharedPreferences`)
- [ ] Input validation implemented
- [ ] No SQL injection vulnerabilities

### Testing

- [ ] Unit tests added for new repositories (80%+ coverage target)
- [ ] Unit tests added for new services (70%+ coverage target)
- [ ] Tested on Android emulator/device
- [ ] Tested on iOS simulator (if available)
- [ ] Manual testing completed for happy path
- [ ] Edge cases tested

### Documentation

- [ ] Code comments added where necessary (non-obvious logic only)
- [ ] README.md updated (if needed)
- [ ] CLAUDE.md updated (if architecture changed)

## Testing Evidence

### Manual Testing

Device/Emulator: ___  
OS Version: ___  
Test Results: [ ] Pass [ ] Fail

**Happy Path:**
- [ ] Feature works as expected
- [ ] No crashes
- [ ] No console errors

**Edge Cases:**
- [ ] Offline behavior tested (if applicable)
- [ ] Error states display correctly
- [ ] Loading states work properly

### Automated Tests

```bash
# flutter analyze
[paste output - should be "No issues found!"]

# flutter test
[paste output - should be "All tests passed!"]
```

## Backend Dependencies

- [ ] No new backend endpoints required
- [ ] OR: Issue created for required endpoints (#___)
- [ ] OR: Using workaround until endpoint available

## Deployment Notes

**Environment Variables Needed:**
- None
- OR: List variables needed

**Migration Steps:**
- None
- OR: List steps

## Reviewer Notes

Any specific areas you want reviewers to focus on?

## Post-Merge Tasks

- [ ] Close related issue(s)
- [ ] Update project board
- [ ] Notify QA team (if applicable)

---

## For Reviewers

### Review Checklist

- [ ] Code follows mobile architecture patterns
- [ ] No files outside `mobile/` modified
- [ ] UI follows design system (AppColors, LucideIcons, AppRadius)
- [ ] No backend code changes
- [ ] Tests are adequate
- [ ] No security issues
- [ ] Screenshots match expected design

### Approval

- [ ] **Approve** - Ready to merge
- [ ] **Request Changes** - Issues found (comment inline)
- [ ] **Comment** - Questions/suggestions (no blocking issues)

---

**Automated checks will verify:**
- Scope compliance (only mobile/ files)
- Linting (flutter analyze)
- Tests (flutter test)
- Build (flutter build apk --debug)
