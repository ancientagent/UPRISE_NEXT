# [Deprecated] CCPM Usage Guide

Strategy note: CCPM and .claude-based workflows are no longer used in UPRISE Phase 2. This document is retained for historical reference only. Prefer docs/PHASE2_EXECUTION_PLAN.md and docs/ops/CHECKLISTS.md for current process.

## Overview
CCPM (Claude Code Project Management) is a lightweight project management workflow for managing epics and tasks using GitHub Issues.

## Quick Start

### Prerequisites
- GitHub CLI (`gh`) authenticated
- Access to repository with issue creation permissions
- CCPM configuration files in `.claude/` directory

### Core Commands

#### 1. Setup Labels
```bash
gh label create epic --color FFD700 --description "High-level initiative"
gh label create task --color 3CB371 --description "Work item"
gh label create blocked --color FF0000 --description "Blocked by dependency"
gh label create "priority:p0" --color 8B0000 --description "Immediate"
gh label create "priority:p1" --color CD5C5C --description "Soon"
```

#### 2. Create Epic from PRD
```bash
EPIC_TITLE="Epic: Your Epic Title"
PRD_FILE=".claude/prds/your-prd.md"

EPIC_URL=$(gh issue create \
  --title "$EPIC_TITLE" \
  --label epic --label "priority:p1" \
  --body-file "$PRD_FILE")

EPIC_NUM=$(echo "$EPIC_URL" | grep -o '[0-9]*$')
```

#### 3. Create Tasks
```bash
TASK_URL=$(gh issue create \
  --title "Task: Your Task Title" \
  --label task --label "priority:p1" \
  --body "Task description. Link: #$EPIC_NUM")

TASK_NUM=$(echo "$TASK_URL" | grep -o '[0-9]*$')
```

#### 4. Link Tasks to Epic
```bash
gh issue comment $EPIC_NUM --body "## Related Tasks
- [ ] #$TASK_NUM Task description"
```

## File Structure

```
.claude/
├── config/
│   └── ccpm.json          # CCPM configuration
├── workflows/
│   └── ccpm.yaml          # Workflow definitions
└── prds/
    └── *.md               # Product requirement documents
```

## Configuration (ccpm.json)

- **project**: Project metadata
- **labels**: Issue label definitions
- **templates**: Issue template paths
- **guardrails**: Project-specific constraints
- **documentation**: Documentation file paths

## Workflow Commands

### Pseudo-Commands (to be implemented)
- `/pm:prd-new <name>` - Create new PRD template
- `/pm:prd-parse <name>` - Parse PRD into structured data
- `/pm:epic-oneshot <name>` - Create epic and tasks from PRD

### Current Implementation
Uses GitHub CLI directly to:
1. Create labels
2. Create epic issue from PRD file
3. Create task issues
4. Link tasks to epic via comments

## Best Practices

1. **PRD First**: Always start with a well-defined PRD
2. **Label Consistently**: Use standard labels (epic, task, priority levels)
3. **Link Everything**: Always reference the epic number in tasks
4. **Document Changes**: Update CHANGELOG.md after major operations
5. **Use Checklists**: Add task checklists to epics for tracking

## Example Workflow

```bash
# 1. Create PRD
cat > .claude/prds/feature.md << EOF
# Product Requirements Document: Feature Name
## Problem Statement
...
## Requirements
...
EOF

# 2. Create epic from PRD
EPIC_URL=$(gh issue create --title "Epic: Feature" \
  --label epic --body-file .claude/prds/feature.md)

# 3. Create tasks
TASK1=$(gh issue create --title "Task 1" --label task \
  --body "Description #$(echo $EPIC_URL | grep -o '[0-9]*$')")

# 4. Document
echo "Created epic and tasks" >> docs/CHANGELOG.md
```

## Troubleshooting

- **Authentication**: Run `gh auth status` to verify GitHub CLI auth
- **Permissions**: Ensure you have issue creation permissions
- **Labels**: Labels must exist before use (run setup first)

## Notes

- Codespaces environments have GitHub CLI pre-authenticated
- All operations are idempotent (safe to re-run)
- Use `|| true` to ignore label creation errors if labels exist
