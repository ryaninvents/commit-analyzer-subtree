# @ryaninvents/commit-analyzer-subtree

> Release just one package from a monorepo

## Setup

```bash
npm install --save-dev @ryaninvents/commit-analyzer-subtree
```

> **Note:** This package requires `@semantic-release/commit-analyzer` as a peerDependency, but `@semantic-release/commit-analyzer` is bundled with `semantic-release` so in most cases you shouldn't have to explicitly set it up.

## Configuration

This package is configured by setting `subtree` to an array of globs. When `semantic-release` runs, it will only include commits that affected these files. All other options are passed through directly to `@semantic-release/commit-analyzer`.

Example [**semantic-release** configuration file](https://github.com/semantic-release/semantic-release/blob/master/docs/usage/configuration.md#configuration):

```json
{
  "plugins": ["@semantic-release/release-notes-generator"],
  "analyzeCommits": [
    [
      "@ryaninvents/commit-analyzer-subtree",
      {
        "subtree": ["packages/project-1/**"],
        "preset": "angular",
        "releaseRules": [
          { "type": "docs", "scope": "README", "release": "patch" },
          { "type": "refactor", "release": "patch" },
          { "type": "style", "release": "patch" }
        ],
        "parserOpts": {
          "noteKeywords": ["BREAKING CHANGE", "BREAKING CHANGES"]
        }
      }
    ]
  ]
}
```
