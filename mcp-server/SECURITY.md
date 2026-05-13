# Security Policy

## Supported Versions

Security fixes target the latest published version.

## Scope

This MCP server is read-only. Supported behavior includes searching Reddit, fetching posts, fetching comments, and fetching subreddit metadata.

Out of scope by default:

- Posting
- Commenting
- Voting
- Sending direct messages
- Moderation actions
- Account automation

## Reporting

Open a private security advisory on GitHub if available. Otherwise, open an issue with minimal reproduction details and do not include secrets.

## Data Handling

The server returns public Reddit data from Reddit's API. Downstream AI clients may store or transmit returned content depending on their own configuration. Treat exported research datasets as sensitive working material.
