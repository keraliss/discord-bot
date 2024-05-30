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
                "Please register to our new cohort [here](https://bitshala.org/cohorts/)",
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
                interaction.followUp(
                    `Apologies, I couldn't assign the role to you as there is no such role available on the server. Please get in touch with an administrator for assistance.`,
                );
                user.enrolled = false;
                await user.save();
                return;
            }
            member?.roles
                .add(role)
                .then(() => {
                    let cohortName = "";
                    const separators = ["-", "_"];

                    for (const separator of separators) {
                        if (role.name.includes(separator)) {
                            cohortName = role.name
                                .split(separator)
                                .map((e, index) =>
                                    index === 0 ? e.toUpperCase() : e,
                                )
                                .join(" ");
                            break;
                        }
                    }

                    if (!cohortName) {
                        cohortName = role.name.toUpperCase();
                    }
                    const followUpText = `Congrats!! You are now registered for ${cohortName}. Please use the #general for further questions related to cohort. And follow #notice-board for all cohort related updates.`;
                    interaction.followUp(followUpText);
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
