import { SlashCommandBuilder, ChatInputCommandInteraction } from 'discord.js';
import { prisma } from '../lib/database.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('View your command usage statistics'),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    try {
      // Get user's command usage statistics
      const userId = interaction.user.id;

      const totalCommands = await prisma.commandLog.count({
        where: { userId },
      });

      if (totalCommands === 0) {
        await interaction.editReply("You haven't used any commands yet!");
        return;
      }

      // Group by command name
      const commandCounts = await prisma.commandLog.groupBy({
        by: ['commandName'],
        where: { userId },
        _count: { commandName: true },
        orderBy: { _count: { commandName: 'desc' } },
      });

      const statsText = commandCounts
        .map((cmd) => `• \`${cmd.commandName}\`: ${cmd._count.commandName} times`)
        .join('\n');

      await interaction.editReply(
        `📊 **Your Command Statistics**\n\n` +
          `Total commands used: **${totalCommands}**\n\n` +
          `**Top Commands:**\n${statsText}`
      );
    } catch (error) {
      console.error('Error fetching stats:', error);
      await interaction.editReply('Failed to fetch statistics. Please try again later.');
    }
  },
};
