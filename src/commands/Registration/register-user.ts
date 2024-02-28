import { GuildMember, SlashCommandBuilder } from "discord.js";
import RegisterConfig from "../../models/RegisterConfig";
import { SlashCommandProps } from "commandkit";

export async function run({ interaction }: SlashCommandProps) {
    try {
        await interaction.deferReply({ ephemeral: true });
        const token = interaction.options.getString("token");
        const user = await RegisterConfig.findOne({ token: token });
        if (!user) {
            interaction.followUp(
                "Please register to our new cohort [here](https://www.bitshala.org/will-be-back-soon)",
            );
            return;
        } else if (user.enrolled) {
            interaction.followUp(
                `You have already enrolled to the channel:${user.role}`,
            );
        } else {
            user.enrolled = true;
            await user.save();
            const member = interaction.member;

            if (!member || !(member instanceof GuildMember)) {
                return;
            }

            const channelPermission = user.role;
            const guild = interaction.guild;
            const roles = guild?.roles;
            const role = roles?.cache.find((r) => r.name === channelPermission);

            if (!role) {
                return;
            }
            member?.roles
                .add(role)
                .then(() => {
                    interaction.followUp(
                        `The role ${role.name} has been added to you.`,
                    );
                })
                .catch((error) => {
                    console.error(
                        `There was an error while adding the role: ${error}`,
                    );
                    interaction.followUp(
                        `Sorry, I couldn't add the role to you. Please contact an admin.`,
                    );
                });
        }
    } catch (error) {
        console.error(`Error in ${__filename}:\n`, error);
    }
}

export const data = new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registering user based on token")
    .setDMPermission(false)
    .addStringOption((option) =>
        option
            .setName("token")
            .setDescription("Registration token")
            .setRequired(true),
    );
