import {
    ActionRowBuilder,
    Interaction,
    ModalBuilder,
    StringSelectMenuBuilder,
    TextInputBuilder,
    TextInputStyle,
} from "discord.js";
import ScheduledGuildEvent from "../../models/ScheduledGuildEvent";
import { GuildEventRecurrence } from "../../utils/constants";

export default async function (interaction: Interaction) {
    if (interaction.isStringSelectMenu()) {
        const customId = interaction.customId;
        const prefix = customId.split("::")[0];

        if (prefix === "select-event-recurrence") {
            const eventId = customId.split("::")[1];

            const selectedRecurrence = interaction.values[0];
            try {
                await ScheduledGuildEvent.updateOne(
                    { eventId },
                    { recurrence: selectedRecurrence },
                );

                await interaction.reply({
                    content: `Recurrence set to ${selectedRecurrence}`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error("Failed to update event recurrence:", error);
                await interaction.reply({
                    content: "Failed to set recurrence. Please try again later.",
                    ephemeral: true,
                });
            }
        }
        if (prefix === "update-event-select") {
            const selectedEventId = interaction.values[0];

            const event = await ScheduledGuildEvent.findOne({
                eventId: selectedEventId,
                deletedAt: null,
            });
            if (!event) {
                await interaction.reply({
                    content: "Event not found.",
                    ephemeral: true,
                });
                return;
            }

            const recurrenceSelectMenu = new StringSelectMenuBuilder()
                .setCustomId(`select-event-recurrence::${selectedEventId}`)
                .setPlaceholder("Select New Recurrence");

            const recurrenceOptions = Object.entries(GuildEventRecurrence).map(
                ([key, value]) => ({
                    label: key,
                    value: value,
                }),
            );

            recurrenceSelectMenu.addOptions(recurrenceOptions);

            const row =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    recurrenceSelectMenu,
                );

            await interaction.update({
                content: "Please choose a new recurrence for the event:",
                components: [row],
            });
        }
        if (prefix === "select-target-channel") {
            const eventId = customId.split("::")[1];
            const selectedChannelId = interaction.values[0];

            try {
                const event = await ScheduledGuildEvent.findOne({
                    eventId: eventId,
                    deletedAt: null,
                });
                if (!event) {
                    await interaction.reply({
                        content: "Event not found.",
                        ephemeral: true,
                    });
                    return;
                }

                event.targetChannelId = selectedChannelId;
                await event.save();

                await interaction.reply({
                    content: `Target channel for event "${event.name}" has been updated successfully.`,
                    ephemeral: true,
                });
            } catch (error) {
                console.error("Failed to update target channel for event:", error);
                await interaction.reply({
                    content:
                        "Failed to update the target channel. Please try again later.",
                    ephemeral: true,
                });
            }
        }
    }

    if (
        interaction.isButton() &&
        interaction.customId.startsWith("open-link-modal")
    ) {
        const eventId = interaction.customId.split("::")[1];

        const modal = new ModalBuilder()
            .setCustomId(`submit-event-link::${eventId}`)
            .setTitle("Submit Event Link");

        const eventLinkInput = new TextInputBuilder()
            .setCustomId("eventLinkInput")
            .setLabel("Event Link")
            .setStyle(TextInputStyle.Short)
            .setRequired(true);

        const eventDescriptionInput = new TextInputBuilder()
            .setCustomId("eventDescriptionInput")
            .setLabel("Event Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);

        const actionRow = new ActionRowBuilder<TextInputBuilder>().addComponents(
            eventLinkInput,
        );

        modal.addComponents(actionRow);

        const descriptionActionRow =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                eventDescriptionInput,
            );

        modal.addComponents(descriptionActionRow);

        await interaction.showModal(modal);
    }

    if (
        interaction.isModalSubmit() &&
        interaction.customId.startsWith("submit-event-link")
    ) {
        const eventId = interaction.customId.split("::")[1];
        const eventLink = interaction.fields.getTextInputValue("eventLinkInput");
        const eventDescription = interaction.fields.getTextInputValue(
            "eventDescriptionInput",
        );

        try {
            await ScheduledGuildEvent.updateOne(
                { eventId: eventId },
                { $set: { customLink: eventLink, description: eventDescription } },
            );

            await interaction.reply({
                content:
                    "The event link has been successfully updated! The bot will post the link on the server 30 minutes before the event starts.",
                ephemeral: true,
            });
        } catch (error) {
            console.error("Failed to update event link:", error);
            await interaction.reply({
                content: "Failed to update the event link. Please try again later.",
                ephemeral: true,
            });
        }
    }
}
