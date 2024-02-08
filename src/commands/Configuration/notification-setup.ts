import { SlashCommandBuilder, PermissionFlagsBits, ChannelType, EmbedBuilder } from "discord.js";
import NotificationConfig from "../../models/NotificationConfig";
import Parser from "rss-parser";
import { SlashCommandProps } from 'commandkit';

const parser = new Parser();

export async function run({ interaction }: SlashCommandProps): Promise<void> {
    try {
        await interaction.deferReply({ ephemeral: true });
        const targetYtChannelId = interaction.options.getString("youtube-id");
        const targetNotificationChannel =
            interaction.options.getChannel("target-channel");
        const targetCustomMessage = interaction.options.getString("custom-message");
        const duplicateExists = await NotificationConfig.exists({
            notificationChannelId: targetNotificationChannel?.id,
            ytChannelId: targetYtChannelId,
        });
        if (duplicateExists) {
            interaction.followUp(
                "The Youtube channel has already been configured for that text channel.\n Run `notification-remove` first.",
            );
            return;
        }
        const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${targetYtChannelId}`;
        const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch(() => {
            interaction.followUp(
                "There was an error fetching the channel. Ensure the ID is correct.",
            );
        });
        if (!feed) return;

        const channelName = feed.title;
        const notificationConfig = new NotificationConfig({
            guildId: interaction.guildId,
            notificationChannelId: targetNotificationChannel?.id,
            ytChannelId: targetYtChannelId,
            customMessage: targetCustomMessage,
            lastChecked: new Date(),
            lastCheckedVid: null,
        });

        if (feed.items.length) {
            const latestVideo = feed.items[0];
            const pubDate = latestVideo.pubDate ? new Date(latestVideo.pubDate) : new Date();

            notificationConfig.lastCheckedVid = {
                id: latestVideo.id.split(":")[2],
                pubDate,
            };
        }
        notificationConfig
            .save()
            .then(() => {
                const embed = new EmbedBuilder()
                    .setTitle(`▶️ Youtube Channel Configuration Success!`)
                    .setDescription(
                        `${targetNotificationChannel} will now get whenever there's a new upload by ${channelName}`,
                    )
                    .setTimestamp();
                interaction.followUp({ embeds: [embed] });
            })
            .catch(() => {
                interaction.followUp(
                    "Unexpected database error. Please try again in a moment",
                );
            });
    } catch (error) {
        console.error(`Error in ${__filename}:\n`, error);
    }
}

export const data = new SlashCommandBuilder()
    .setName("notification-setup")
    .setDescription("Setup Youtube notifications for a channel")
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
        option
            .setName("youtube-id")
            .setDescription("The ID of the youtube channel.")
            .setRequired(true),
    )
    .addChannelOption((option) =>
        option
            .setName("target-channel")
            .setDescription("The channel to get notification in")
            .addChannelTypes(ChannelType.GuildText, ChannelType.GuildAnnouncement)
            .setRequired(true),
    )
    .addStringOption((option) =>
        option
            .setName("custom-message")
            .setDescription(
                "Templates:{VIDEO_TITLE} {VIDEO_URL} {CHANNEL_NAME} {CHANNEL_URL",
            ),
    );
