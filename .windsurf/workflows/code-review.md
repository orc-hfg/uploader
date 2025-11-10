---
description: Comprehensive review of recent code changes with constructive feedback on quality, readability, documentation, and improvement opportunities.
auto_execution_mode: 1
---

# Code Review Workflow

This workflow provides a thorough evaluation of your code changes, focusing on code quality, readability, documentation, and areas for improvement.

## 1. Analyze Current State

First, let's see what has changed:

### Check Git Status
Review current working directory state to understand what needs to be evaluated.

### Recent Commit History
Look at recent commits to understand the scope of changes:
```bash
git log --oneline -10
```

## 2. Choose Review Scope

Decide what to review based on current state:

**Option A: Review Working Changes (Staged/Unstaged)**
- For ongoing work before committing
- Includes staged and unstaged modifications

**Option B: Review Recent Commits**
- For already committed changes
- Specify commit range (e.g., last 3 commits, since specific commit)

**Option C: Review Specific Files**
- Focus on particular files or components
- Useful for targeted reviews

## 3. Examine Changes in Detail

Based on chosen scope, analyze the actual code changes:

### For Working Changes:
- Review staged changes (ready for commit)
- Review unstaged changes (work in progress)
- Check for untracked files that should be included

### For Committed Changes:
- Compare against previous commits
- Look at diff for each relevant commit
- Understand the evolution of changes

## 4. Code Quality Assessment

Evaluate each changed file against project standards:

### Technical Quality
- **Type Safety**: Avoid `any` types and type assertions
- **Error Handling**: Proper error handling and validation
- **Performance**: Efficient algorithms and resource usage
- **Security**: Input validation, secure practices

### Code Style & Readability
- **KISS Principle**: Is the solution as simple as possible?
- **Early Returns**: Used appropriately to reduce nesting
- **Native APIs**: Preference for built-in JavaScript/browser APIs
- **Naming**: Full descriptive names (e.g., "Development" not "Dev")
- **Variable Names**: Explain WHY, not just WHAT

### Project-Specific Patterns
- **Path Aliases**: Use `@@/` and `@/` instead of `~~/` and `~/`
- **Vue Templates**: Prefer `$t()` over extracted `t` function
- **Props**: Direct destructuring with defaults, avoid `withDefaults`
- **Imports**: No manual imports for auto-imported functions (useI18n, etc.)
- **Accessibility**: Support for `prefers-reduced-motion`

## 5. Documentation Review

Assess documentation quality:

### Code Documentation
- **Comments**: All in English, explain complex logic
- **Function/Class Docs**: Clear purpose and parameter descriptions
- **Type Definitions**: Self-documenting interfaces and types

### Project Documentation
- **README Updates**: Reflect new features or changes
- **API Documentation**: Updated for new endpoints or changes
- **Setup Instructions**: Still accurate and complete

## 6. Testing & Quality Assurance

Verify testing coverage and quality:

### Test Coverage
- Are new features properly tested?
- Are edge cases covered?

## 7. Architecture & Design Review

Evaluate higher-level design decisions:

### Design Patterns
- **Consistency**: Follows established project patterns
- **Separation of Concerns**: Proper component/module boundaries
- **Reusability**: Code can be easily reused or extended
- **Maintainability**: Easy to understand and modify

### Dependencies & Integration
- **Minimal Dependencies**: Prefer native solutions
- **Proper Integration**: Works well with existing codebase
- **Breaking Changes**: Identified and documented

## 8. Generate Comprehensive Feedback

Provide structured, constructive review:

### ✅ **Strengths & Achievements**
- Well-implemented features and solutions
- Good architectural decisions
- Clear, readable, and maintainable code
- Proper documentation and testing
- Adherence to project standards

### 🔍 **Areas for Improvement**
- **High Priority**: Critical issues affecting functionality or security
- **Medium Priority**: Code quality improvements, better patterns
- **Low Priority**: Style improvements, minor optimizations

### 📝 **Specific Action Items**
- Concrete, actionable recommendations
- Code examples where helpful
- Links to relevant documentation or standards
- Estimated effort/complexity for each item

### 🎯 **Learning Opportunities**
- Patterns or techniques worth studying
- Best practices demonstrated in the code
- Areas for skill development

## 9. Final Assessment & Summary

### Overall Quality Rating
- **Excellent**: Exceeds standards, exemplary code
- **Good**: Meets standards with minor improvements needed
- **Needs Work**: Significant improvements required
- **Requires Revision**: Major issues must be addressed

### Key Takeaways
- Most important improvements to prioritize
- Positive patterns worth maintaining and expanding
- Long-term architectural considerations
- Next steps for continuous improvement

---

**Note**: This workflow emphasizes constructive feedback that balances recognition of good work with actionable improvement suggestions. The goal is continuous learning and maintaining high code quality standards.
