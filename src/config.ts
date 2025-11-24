import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  token: string;
  clientId: string;
  guildId?: string;
}

function getEnvVar(key: string, required: boolean = true): string | undefined {
  const value = process.env[key];
  if (required && !value) {
    throw new Error(`Environment variable ${key} is required but not set`);
  }
  return value;
}

export const config: Config = {
  token: getEnvVar('DISCORD_TOKEN')!,
  clientId: getEnvVar('DISCORD_CLIENT_ID')!,
  guildId: getEnvVar('DISCORD_GUILD_ID', false),
};
