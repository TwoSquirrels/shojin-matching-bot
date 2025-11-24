import { Events, Interaction, ChatInputCommandInteraction, Client, Collection } from 'discord.js';
import { prisma } from '../lib/database.js';

interface Command {
  data: {
    name: string;
    toJSON: () => unknown;
  };
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
}

interface ClientWithCommands extends Client {
  commands: Collection<string, Command>;
}

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    if (!interaction.isChatInputCommand()) return;

    const client = interaction.client as ClientWithCommands;
    const command = client.commands.get(interaction.commandName);

    if (!command) {
      console.error(`No command matching ${interaction.commandName} was found.`);
      return;
    }

    let success = true;
    let errorMessage: string | undefined;

    try {
      await command.execute(interaction);
    } catch (error) {
      success = false;
      errorMessage = error instanceof Error ? error.message : String(error);
      console.error('Error executing command:', error);

      const reply = {
        content: 'There was an error while executing this command!',
        ephemeral: true,
      };

      if (interaction.replied || interaction.deferred) {
        await interaction.followUp(reply);
      } else {
        await interaction.reply(reply);
      }
    } finally {
      // Log command usage to database
      try {
        await prisma.commandLog.create({
          data: {
            commandName: interaction.commandName,
            userId: interaction.user.id,
            guildId: interaction.guildId,
            success,
            error: errorMessage,
          },
        });
      } catch (logError) {
        console.error('Failed to log command usage:', logError);
      }
    }
  },
};
