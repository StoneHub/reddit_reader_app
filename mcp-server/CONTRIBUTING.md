# Contributing

Contributions should preserve the server's read-only scope unless a maintainer explicitly opens a design discussion for write support.

Before opening a pull request:

```bash
npm test
npm run typecheck
npm run build
```

When adding a tool, include:

- A clear research use case
- Input validation
- Tests for request construction or normalization
- Documentation in `README.md`

Do not add scraping fallbacks unless they are explicitly discussed. This project prioritizes Reddit's official API.
