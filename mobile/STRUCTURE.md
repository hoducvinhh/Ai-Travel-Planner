# Mobile Project Structure

Clean and organized documentation structure.

## 📁 Root Level (5 files)

```
mobile/
├── CLAUDE.md              # Agent rules (auto-loaded) ⭐
├── README.md              # Quick start guide
├── TASKS.md               # 471 tasks with checkboxes ⭐
├── plan-mobile.md         # Complete development plan
└── mobile-tech-stack.md   # Technology decisions
```

## 📁 Configuration

```
.claude/
├── skills/                # Agent skills (auto-loaded)
│   ├── mobile-ui-guidelines.md         # UI/UX rules ⭐
│   ├── mobile-architecture.md          # Architecture patterns ⭐
│   └── mobile-development-rules.md     # Dev constraints ⭐
└── settings.json          # Claude configuration

.github/
├── PULL_REQUEST_TEMPLATE.md
└── ISSUE_TEMPLATE/
    ├── backend-integration.md
    ├── bug-report.md
    └── feature-request.md

scripts/
└── pre-commit-check.sh    # Automated verification

.gitignore                 # Flutter/Dart ignore patterns
```

## ⭐ Essential Files

**For Agent:**
1. `CLAUDE.md` - Main rules (auto-loaded)
2. `TASKS.md` - Current work
3. Skills in `.claude/skills/` (auto-loaded)

**For Developers:**
1. `README.md` - Quick start
2. `TASKS.md` - Task tracking
3. `plan-mobile.md` - Full context

## 🚀 Quick Start

```bash
# 1. Read rules
cat CLAUDE.md

# 2. See tasks
cat TASKS.md

# 3. Start working
# - Phase 0: Setup (tasks 0.1-0.8)
# - Mark [ ] as [x] when done
```

## 📊 Statistics

- **Total docs:** 5 markdown files (root level)
- **Skills:** 3 files (~2600 lines)
- **Templates:** 4 files
- **Tasks:** 471 tasks
- **Status:** Clean & organized ✅

## 🎯 What Was Removed

Removed redundant files:
- ❌ SKILLS_SUMMARY.md (duplicate info)
- ❌ QUICK_REFERENCE.md (info in CLAUDE.md)
- ❌ FILES_INDEX.md (just index)
- ❌ AGENT_COMPLIANCE.md (verbose)
- ❌ COMPLETION_SUMMARY.md (temporary)
- ❌ TASK_INDEX.md (redundant)
- ❌ .claude/skills/README.md (not needed)

**Result:** Focused, essential documentation only.

---

**Last Updated:** 2026-10-09  
**Status:** Clean & Ready ✅
