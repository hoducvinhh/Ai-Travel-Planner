# Mobile Project - Files Index

Complete list of all configuration, documentation, and template files for mobile development.

## 📂 File Structure

```
mobile/
├── .claude/                                    # Claude AI configuration
│   ├── skills/                                 # Agent skills
│   │   ├── mobile-ui-guidelines.md            # UI/UX design rules ✅
│   │   ├── mobile-architecture.md             # Architecture patterns ✅
│   │   └── mobile-development-rules.md        # Development constraints ✅
│   └── settings.json                          # Claude settings ✅
│
├── .github/                                    # GitHub templates
│   ├── PULL_REQUEST_TEMPLATE.md               # PR checklist ✅
│   └── ISSUE_TEMPLATE/
│       ├── backend-integration.md             # Backend issue template ✅
│       ├── bug-report.md                      # Bug report template ✅
│       └── feature-request.md                 # Feature request template ✅
│
├── CLAUDE.md                                   # Main Claude rules ✅
├── README.md                                   # Project overview ✅
├── SKILLS_SUMMARY.md                          # Skills quick reference ✅
├── plan-mobile.md                             # Complete development plan ✅
├── mobile-tech-stack.md                       # Tech stack documentation (existing)
├── .gitignore                                 # Git ignore patterns ✅
│
└── (Flutter app structure - to be created)
    ├── lib/
    ├── test/
    ├── android/
    ├── ios/
    ├── assets/
    └── pubspec.yaml
```

## ✅ Files Created (12 total)

### 1. Core Documentation (3 files)

| File | Purpose | Status |
|------|---------|--------|
| `CLAUDE.md` | Main rules for Claude agents | ✅ Created |
| `README.md` | Project overview & quick start | ✅ Created |
| `SKILLS_SUMMARY.md` | Skills quick reference | ✅ Created |

### 2. Skills (3 files)

| File | Purpose | Trigger Words |
|------|---------|---------------|
| `.claude/skills/mobile-ui-guidelines.md` | UI/UX design rules | UI, design, component, button, card, icon, color |
| `.claude/skills/mobile-architecture.md` | Architecture patterns | architecture, provider, repository, service, navigation |
| `.claude/skills/mobile-development-rules.md` | Development constraints | backend, API, folder, scope, commit, permission |

### 3. Templates (4 files)

| File | Purpose | Usage |
|------|---------|-------|
| `.github/PULL_REQUEST_TEMPLATE.md` | PR checklist | Auto-loaded on PR creation |
| `.github/ISSUE_TEMPLATE/backend-integration.md` | Backend requests | Label: `backend-needed` |
| `.github/ISSUE_TEMPLATE/bug-report.md` | Bug reports | Label: `bug, mobile` |
| `.github/ISSUE_TEMPLATE/feature-request.md` | Feature requests | Label: `enhancement, mobile` |

### 4. Configuration (2 files)

| File | Purpose | Status |
|------|---------|--------|
| `.claude/settings.json` | Claude configuration | ✅ Created |
| `.gitignore` | Git ignore patterns | ✅ Created |

## 📖 File Descriptions

### CLAUDE.md
**Main rules file that Claude loads on every session.**

Content:
- Scope constraints (mobile/ only)
- Backend integration protocol
- Required skills (auto-load)
- Code quality gates
- Commit message format
- UI implementation rules
- Architecture patterns
- Pre-commit checklist

**When to reference:** Every time you start working on mobile code.

---

### Skills

#### mobile-ui-guidelines.md
**Complete UI/UX design system and rules.**

Content:
- Color system (AppColors constants)
- Icon system (LucideIcons, black/white only)
- Border radius (rounded corners required)
- Component templates (buttons, cards, inputs)
- Anti-patterns (avoiding AI slop)
- Typography
- Bottom navigation
- Loading states
- Empty states

**When to load:** Before implementing ANY UI component.

**Auto-loaded:** Yes (configured in settings.json)

---

#### mobile-architecture.md
**Complete architecture patterns and code organization.**

Content:
- Architecture overview (layers)
- Folder structure
- State management (Riverpod patterns)
- Provider types
- Repository pattern
- API service (Dio setup)
- Navigation (go_router)
- Data models
- Error handling
- Environment configuration
- Testing patterns

**When to load:** Before implementing ANY feature.

**Auto-loaded:** Yes (configured in settings.json)

---

#### mobile-development-rules.md
**Strict development rules and constraints.**

Content:
- Scope constraints (allowed/forbidden files)
- Backend integration rules
- Git workflow (branch/commit naming)
- Code quality rules
- Security rules
- Testing requirements
- Pre-commit checklist
- Common mistakes
- Quick reference commands

**When to load:** Before making ANY code changes.

**Auto-loaded:** Yes (configured in settings.json)

---

### README.md
**Project overview and developer onboarding.**

Content:
- Project overview
- Quick start guide
- Architecture summary
- Design system basics
- Development rules
- Git workflow
- Configuration
- Troubleshooting
- Dependencies
- Project status

**Audience:** New developers joining mobile team.

---

### SKILLS_SUMMARY.md
**Quick reference guide to all skills and rules.**

Content:
- Files created index
- Quick reference (when to load which skill)
- Most important rules
- Pre-commit checklist
- Common patterns
- Troubleshooting
- Learning path
- Best practices

**Audience:** Developers and AI agents needing quick lookup.

---

### .claude/settings.json
**Claude AI configuration.**

Content:
- File access rules (mobile/ allowed, backend/ forbidden)
- Allowed bash commands
- Auto-load skills
- Pre-commit checks
- Guidelines (colors, icons, architecture)
- Warnings (common mistakes)

**Purpose:** Enforce rules automatically in Claude.

---

### Templates

#### PULL_REQUEST_TEMPLATE.md
**Comprehensive PR checklist.**

Sections:
- PR information
- Changes description
- Screenshots (for UI)
- Pre-submission checklist
- Code quality checks
- Scope compliance
- UI/UX standards
- Backend integration
- Security
- Testing
- Documentation

**Usage:** Automatically loads when creating PR.

---

#### backend-integration.md
**Template for requesting backend changes.**

Sections:
- Issue type (missing endpoint, bug, performance)
- Endpoint details
- Request/response examples
- Mobile testing details
- Current workaround
- Impact assessment

**Usage:** Create issue with label `backend-needed`.

---

#### bug-report.md
**Template for reporting mobile bugs.**

Sections:
- Bug description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots/video
- Environment details
- Error logs
- Severity assessment

**Usage:** Create issue with labels `bug, mobile`.

---

#### feature-request.md
**Template for proposing new features.**

Sections:
- Feature description
- Problem/use case
- Proposed solution
- Technical considerations
- Backend dependencies
- Design system considerations
- Success metrics

**Usage:** Create issue with labels `enhancement, mobile`.

---

### .gitignore
**Git ignore patterns for Flutter/Dart.**

Ignores:
- Build artifacts (*.apk, *.ipa)
- Generated files (*.g.dart, *.freezed.dart)
- IDE files (.idea, .vscode)
- Sensitive data (.env, *.jks, google-services.json)
- Dependencies (node_modules, .pub-cache)
- Platform-specific (iOS/Pods, Android/.gradle)

**Purpose:** Keep repository clean, prevent secrets from being committed.

---

## 🚀 Getting Started

### For New Developers

1. **Read documentation in order:**
   ```
   README.md → CLAUDE.md → SKILLS_SUMMARY.md
   ```

2. **Load skills before coding:**
   ```
   mobile-ui-guidelines.md
   mobile-architecture.md
   mobile-development-rules.md
   ```

3. **Bookmark for reference:**
   - Quick lookup: `SKILLS_SUMMARY.md`
   - Architecture: `.claude/skills/mobile-architecture.md`
   - UI guidelines: `.claude/skills/mobile-ui-guidelines.md`

### For AI Agents (Claude)

**Auto-loaded on session start:**
- `CLAUDE.md` (main rules)
- `.claude/settings.json` (configuration)
- All skills in `.claude/skills/` (per settings)

**Manual load when needed:**
- Load all 3 skills before implementing features
- Reference `SKILLS_SUMMARY.md` for quick patterns

---

## 🔄 Maintenance

### When to Update These Files

**Update mobile-ui-guidelines.md when:**
- New design patterns discovered
- Anti-patterns identified
- Component templates added

**Update mobile-architecture.md when:**
- Architecture changes
- New patterns adopted
- Better practices discovered

**Update mobile-development-rules.md when:**
- New constraints added
- Common mistakes identified
- Git workflow changes

**Update CLAUDE.md when:**
- Major rule changes
- New skills added
- Critical warnings needed

**Update SKILLS_SUMMARY.md when:**
- Any of the above skills change
- New common patterns emerge

---

## 📊 Coverage

### What's Covered ✅

- ✅ Scope constraints (mobile/ only)
- ✅ UI/UX design system (colors, icons, components)
- ✅ Architecture patterns (Riverpod, repositories, services)
- ✅ Backend integration (consume API, don't modify)
- ✅ Git workflow (branch/commit naming)
- ✅ Code quality (linting, testing)
- ✅ Security (secrets, storage, validation)
- ✅ Templates (PR, issues)
- ✅ Configuration (Claude settings, gitignore)

### What's NOT Covered (To Be Added Later)

- ⏳ Specific Flutter code implementation
- ⏳ CI/CD pipeline configuration
- ⏳ Deployment scripts
- ⏳ Performance optimization guidelines
- ⏳ Accessibility testing procedures
- ⏳ App Store submission guidelines

---

## 📈 Version History

**v1.0.0 (2026-10-09)**
- Initial creation
- 12 files created
- 3 skills defined
- 4 templates created
- Complete rule system established

---

## ✨ Summary

**Total Files Created:** 12  
**Skills:** 3  
**Templates:** 4  
**Documentation:** 3  
**Configuration:** 2  

**Status:** ✅ Complete and ready for mobile development

**Next Steps:**
1. Review all files
2. Initialize Flutter project
3. Start Phase 1 implementation
4. Load skills and follow rules

---

**Created by:** Claude (AI Assistant)  
**Date:** 2026-10-09  
**Project:** AI Travel Planner - Mobile App
