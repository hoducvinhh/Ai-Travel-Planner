# Mobile Development Skills

This folder contains skills that guide AI agents (Claude) when working on the mobile app.

## What are Skills?

Skills are specialized knowledge files that:
- Provide detailed guidelines for specific areas
- Are loaded on-demand when needed
- Help maintain consistency across development
- Prevent common mistakes and anti-patterns

## Available Skills

### 1. mobile-ui-guidelines.md
**Purpose:** Complete UI/UX design system and component guidelines

**Load when:** Before implementing ANY UI component

**Covers:**
- Color system (AppColors constants)
- Icon system (LucideIcons - black/white only)
- Border radius (rounded corners on all components)
- Component templates (buttons, cards, inputs, etc.)
- Anti-patterns (avoiding "AI slop")
- Typography, spacing, animations
- Empty states, loading states

**Trigger words:** UI, design, component, button, card, icon, color, style, theme

---

### 2. mobile-architecture.md
**Purpose:** Architecture patterns and code organization

**Load when:** Before implementing ANY feature

**Covers:**
- Architecture layers (Screen → Provider → Repository → Service)
- Folder structure
- State management (Riverpod patterns)
- Repository pattern
- API service (Dio setup)
- Navigation (go_router)
- Data models (Freezed)
- Error handling
- Environment configuration
- Testing patterns

**Trigger words:** architecture, structure, provider, repository, service, navigation, routing, state

---

### 3. mobile-development-rules.md
**Purpose:** Development constraints and workflow rules

**Load when:** Before making ANY code changes

**Covers:**
- Scope constraints (mobile/ only, backend/ forbidden)
- Backend integration protocol (consume API, don't modify)
- Git workflow (branch/commit naming)
- Code quality standards
- Security rules
- Testing requirements
- Pre-commit checklist
- Common mistakes and how to avoid them

**Trigger words:** backend, API, folder, scope, commit, push, permission, modify

---

## How Skills are Loaded

### Automatic Loading
Skills are configured to auto-load in `../.claude/settings.json`:

```json
{
  "autoloadSkills": [
    "mobile-ui-guidelines",
    "mobile-architecture",
    "mobile-development-rules"
  ]
}
```

### Manual Loading
Agent can explicitly load a skill:

```
Skill("mobile-ui-guidelines")
```

### Trigger Words
Skills auto-load when agent's task contains trigger words:
- UI work → loads `mobile-ui-guidelines`
- Architecture questions → loads `mobile-architecture`
- Backend/scope questions → loads `mobile-development-rules`

## Usage Guidelines

### For AI Agents (Claude)

**Before starting ANY task:**
1. Check if skills are loaded (look for context about AppColors, architecture pattern, scope rules)
2. If not loaded, explicitly load all 3 skills
3. Follow guidelines from loaded skills
4. Reference skills when making decisions

**Example workflow:**
```
User: "Implement login screen"

Agent thought process:
1. This is UI work → load mobile-ui-guidelines
2. This is a feature → load mobile-architecture
3. I'll be making code changes → load mobile-development-rules
4. Read skills content
5. Implement following patterns:
   - UI: Use AppColors, LucideIcons, rounded corners
   - Architecture: Screen → Provider → Repository → Service
   - Scope: Only modify mobile/ files
6. Test before committing
```

### For Developers

**Reading skills:**
- Skills are written in markdown, human-readable
- Read skills to understand project standards
- Contribute improvements when you find better patterns

**Updating skills:**
When you discover:
- New anti-patterns → Add to mobile-ui-guidelines
- Better architecture patterns → Add to mobile-architecture
- Common mistakes → Add to mobile-development-rules

Keep skills up-to-date so future agents and developers benefit.

## Skill Content Structure

Each skill follows this structure:

```markdown
---
skill: skill-name
description: Brief description
triggerWords: [word1, word2, word3]
---

# Skill Title

## Section 1: Core Concepts
[Guidelines and explanations]

## Section 2: Patterns
[Code examples and templates]

## Section 3: Anti-Patterns
[What NOT to do with examples]

## Section 4: Checklist
[Quick verification items]
```

## Relationship with Other Files

```
CLAUDE.md (main rules)
    ↓
.claude/settings.json (configuration)
    ↓
.claude/skills/*.md (detailed guidelines)
    ↓
Code implementation
```

**CLAUDE.md** provides high-level rules and references skills.

**Skills** provide detailed, actionable guidelines for specific areas.

## Verification

To verify skills are working:

1. **Check auto-load:**
   - Look at `.claude/settings.json`
   - Verify `autoloadSkills` array contains all 3 skills

2. **Check content:**
   - Each skill should have frontmatter with `skill:`, `description:`, `triggerWords:`
   - Content should be detailed and actionable

3. **Check references:**
   - `CLAUDE.md` should reference skills
   - `SKILLS_SUMMARY.md` should document when to load each skill

## Troubleshooting

### Skills not loading automatically

**Cause:** Settings not configured or trigger words not matched

**Fix:**
1. Check `.claude/settings.json` has correct `autoloadSkills`
2. Explicitly load skills: `Skill("skill-name")`
3. Add trigger words to task description

### Agent not following skill guidelines

**Cause:** Skills loaded but content unclear or agent forgot

**Fix:**
1. Make guidelines more explicit in skill
2. Add ✅/❌ examples
3. Reference skills in `CLAUDE.md` summary
4. Add checklist items

### Outdated skill content

**Cause:** Patterns changed but skills not updated

**Fix:**
1. Review skills regularly
2. Update when new patterns discovered
3. Remove deprecated patterns
4. Keep examples current

## Contributing

When improving skills:

1. **Be specific:** Instead of "use good colors", say "use AppColors.primary (#FF6B6B)"
2. **Show examples:** ✅ DO / ❌ DON'T code snippets
3. **Explain why:** Rationale helps agents make better decisions
4. **Keep concise:** Long paragraphs get skipped, use bullet points
5. **Test changes:** Verify agent follows updated guidelines

## Stats

- **Total skills:** 3
- **Total lines:** ~2000+
- **Coverage:**
  - UI/UX: 100%
  - Architecture: 100%
  - Development rules: 100%
  - Backend integration: 100%

## Version History

**v1.0.0 (2026-10-09)**
- Initial skills creation
- 3 skills: UI guidelines, Architecture, Development rules
- Auto-load configuration
- Comprehensive coverage

---

**Maintained by:** Mobile Development Team  
**Last updated:** 2026-10-09

For questions about skills system, see `SKILLS_SUMMARY.md` in project root.
