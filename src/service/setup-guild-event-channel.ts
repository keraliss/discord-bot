import { client } from "..";
import { ActionRowBuilder, StringSelectMenuBuilder, ChannelType } from "discord.js";

export async function setupGuildEventChannel({ eventId, eventName, creatorId }) {

    console.log("todo: fetch the channel id from event creator!");
    // try {
    //     const user = await client.users.fetch(creatorId);
    //     const guild = client.guilds.cache.get("YOUR_GUILD_ID");
    //     const channels = guild.channels.cache.filter(
    //         (channel) => channel.type === ChannelType.GuildText,
    //     ); // Adjust as needed for channel types
    //     const selectMenuBuilder = new StringSelectMenuBuilder()
    //         .setCustomId(`select-target-channel::${eventId}`)
    //         .setPlaceholder("Select a Target Channel");
    //     // Generate options for each text channel in the guild
    //     const channelOptions = channels.map((channel) => ({
    //         label: channel.name,
    //         value: channel.id,
    //     }));
    //     selectMenuBuilder.addOptions(channelOptions);
    //     const selectMenu =
    //         new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    //             selectMenuBuilder,
    //         );
    //     await user.send({
    //         content: `Select a target channel for the event: "${eventName}".`,
    //         components: [selectMenu],
    //     });
    // } catch (error) {
    //     console.error("Failed to setup target channel for event:", error);
    // }
}
