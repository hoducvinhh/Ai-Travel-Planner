#!/bin/bash

# Script to clean up temporary documentation files
# Keep only essential documentation

echo "🧹 Cleaning up temporary files..."

cd /z/Learn_Programming/DATN\ -\ AI\ Travel\ Planner/mobile

# Remove temporary documentation files
rm -f PHASE0_COMPLETE.md
rm -f SETUP_MANUAL_VI.md
rm -f SESSION_SUMMARY.md
rm -f COMMANDS_PHASE1_TASK1.md
rm -f COMMANDS_PHASE1_TASK1-2.md
rm -f PROGRESS_SUMMARY.md
rm -f QUICK_START.md
rm -f TASK_1.3_COMPLETE.md
rm -f TASK_1.4_COMPLETE.md
rm -f COMMIT_TASK_1.3.md
rm -f plan-mobile.md

echo "✅ Cleanup complete!"
echo ""
echo "📁 Kept essential files:"
echo "  - CLAUDE.md (Claude rules)"
echo "  - README.md (Main documentation)"
echo "  - TASKS.md (Task tracking)"
echo "  - STRUCTURE.md (Project structure)"
echo "  - SETUP.md (Setup instructions)"
echo "  - mobile-tech-stack.md (Tech reference)"
echo "  - .claude/skills/*.md (Skills)"
echo "  - .github/* (GitHub templates)"
echo ""
echo "🗑️  Removed temporary files:"
echo "  - 11 temporary documentation files"
