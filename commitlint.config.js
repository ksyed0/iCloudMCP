'use strict';

// Enforces conventional commits with optional story/bug references.
//
// Accepted formats:
//   feat: short description
//   fix(App/Services): short description
//   chore: [US-0001] short description
//
// Types must match CLAUDE.md §Commit Message Format.
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'test', 'docs', 'refactor', 'chore', 'style', 'perf', 'ci', 'build', 'revert'],
    ],
    'subject-case': [2, 'never', ['upper-case', 'pascal-case', 'start-case']],
    'header-max-length': [2, 'always', 100],
    'body-max-line-length': [1, 'always', 120],
  },
};
