const { SlashCommandBuilder } = require("discord.js");
const RegisterConfig = require("../../models/RegisterConfig");

/**@param {import('commandkit').SlashCommandProps} param0 */
async function run({ interaction }) {
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
                `You have already enrolled to the channel:${user.channel}`,
            );
        } else {
            user.enrolled = false;
            await user.save();
            const member = interaction.member;
            const channelPermission = user.channel;
            const guild = interaction.guild;
            const roles = guild.roles;
            const role = roles.cache.find((r) => r.name === channelPermission);
            member.roles
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
        console.log(`Error in ${__filename}:\n`, error);
    }
}

const data = new SlashCommandBuilder()
    .setName("register")
    .setDescription("Registering user based on token")
    .setDMPermission(false)
    .addStringOption((option) =>
        option
            .setName("token")
            .setDescription("Registration token")
            .setRequired(true),
    );
module.exports = { data, run };
