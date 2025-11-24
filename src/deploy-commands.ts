import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { config } from './config.js';
import { loadModules } from './utils/loader.js';

interface Command {
  data: {
    name: string;
    toJSON: () => RESTPostAPIChatInputApplicationCommandsJSONBody;
  };
}

async function deployCommands() {
  console.log('📚 Loading commands...');
  const commands = await loadModules<Command>('commands');
  const commandsData = commands.map((command) => command.data.toJSON());

  console.log(`Found ${commandsData.length} commands`);

  // Construct and prepare an instance of the REST module
  const rest = new REST().setToken(config.token);

  try {
    console.log('🚀 Started refreshing application (/) commands.');

    if (config.guildId) {
      // Deploy to specific guild (faster for development)
      const data = (await rest.put(
        Routes.applicationGuildCommands(config.clientId, config.guildId),
        { body: commandsData }
      )) as RESTPostAPIChatInputApplicationCommandsJSONBody[];
      console.log(`✅ Successfully reloaded ${data.length} guild commands.`);
    } else {
      // Deploy globally
      const data = (await rest.put(Routes.applicationCommands(config.clientId), {
        body: commandsData,
      })) as RESTPostAPIChatInputApplicationCommandsJSONBody[];
      console.log(`✅ Successfully reloaded ${data.length} global commands.`);
      console.log('⚠️  Global commands can take up to an hour to propagate.');
    }
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
}

void deployCommands();
