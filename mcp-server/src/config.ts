export type AppConfig = {
  redditClientId: string;
  redditClientSecret: string;
  redditUserAgent: string;
};

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const redditClientId = requireEnv(env, "REDDIT_CLIENT_ID");
  const redditClientSecret = requireEnv(env, "REDDIT_CLIENT_SECRET");
  const redditUserAgent = requireEnv(env, "REDDIT_USER_AGENT");

  return {
    redditClientId,
    redditClientSecret,
    redditUserAgent
  };
}

function requireEnv(env: NodeJS.ProcessEnv, name: string): string {
  const value = env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}
