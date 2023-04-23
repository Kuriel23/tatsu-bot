const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("「Informações」 Veja o meu ping"),
  async execute(interaction, client) {
    interaction.reply(`Meu ping é de **${client.ws.ping}ms**.`);
  },
};
