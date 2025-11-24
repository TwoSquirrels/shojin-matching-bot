import {
  Client,
  Collection,
  GatewayIntentBits,
  ChatInputCommandInteraction,
  ClientEvents,
} from 'discord.js';
import { config } from './config.js';
import { loadModules } from './utils/loader.js';

interface Command {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

interface Event {
  name: keyof ClientEvents;
  once?: boolean;
  execute: (...args: unknown[]) => void | Promise<void>;
}

// Extend Client type to include commands
declare module 'discord.js' {
  interface Client {
    commands: Collection<string, Command>;
  }
}

async function main() {
  // Create a new client instance
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
    ],
  });

  // Initialize commands collection
  client.commands = new Collection<string, Command>();

  // Load commands
  console.log('📚 Loading commands...');
  const commands = await loadModules<Command>('commands');
  for (const command of commands) {
    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`  ✓ Loaded command: ${command.data.name}`);
    }
  }

  // Load events
  console.log('📚 Loading events...');
  const events = await loadModules<Event>('events');
  for (const event of events) {
    if ('name' in event && 'execute' in event) {
      if (event.once) {
        client.once(event.name, (...args: unknown[]) => void event.execute(...args));
      } else {
        client.on(event.name, (...args: unknown[]) => void event.execute(...args));
      }
      console.log(`  ✓ Loaded event: ${event.name}`);
    }
  }

  // Login to Discord
  console.log('🚀 Starting bot...');
  await client.login(config.token);
}

main().catch((error) => {
  console.error('❌ Failed to start bot:', error);
  process.exit(1);
});
