import { SlashCommandBuilder, PermissionFlagsBits, ChannelType } from "discord.js";
import NotificationConfig from "../../models/NotificationConfig";
import { SlashCommandProps } from 'commandkit';

export async function run({ interaction }: SlashCommandProps):Promise<void> {
    try {
        await interaction.deferReply({ ephemeral: true });
        const targetYtChannelId = interaction.options.getString("youtube-id");
        const targetNotificationChannel =
            interaction.options.getChannel("target-channel");

        const targetChannel = await NotificationConfig.findOne({
            ytChannelId: targetYtChannelId,
            notificationChannelId: targetNotificationChannel?.id,
        });

        if (!targetChannel) {
            interaction.followUp(
                "That Youtube channel has not been configured for notifications.",
            );
        }
        NotificationConfig.findOneAndDelete({ _id: targetChannel?._id })
            .then(() => {
                interaction.followUp("Turned off notifications for that channel!");
            })
            .catch(() => {
                interaction.followUp(
                    "There was a database error. Please try again in a moment.",
                );
            });
    } catch (error) {
        console.error(`Error in ${__filename}:\n`, error);
    }
}

export const data = new SlashCommandBuilder()
    .setName("notification-remove")
    .setDescription("Turn off Youtube notifications for a channel.")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName("youtube-id")
            .setDescription("The ID of the target Youtube Channel.")
            .setRequired(true),
    )
    .addChannelOption((option) =>
        option
            .setName("target-channel")
            .setDescription("The channel to turn off notification for.")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true),
    );
