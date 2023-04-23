const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("removeparceria")
    .setDescription(
      "「Moderação」 Remove uma quantidade de parcerias de um usuário."
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageGuild)
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription(
          "Selecione a quantidade de parcerias que deseja remover"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membro");
    const quantidade = interaction.options.getInteger("quantidade");

    client.db.Users.findOne({ _id: user.id }, function (err, doc) {
      if (err) return interaction.reply(err);
      if (doc) {
        doc.parcerias -= quantidade;
        doc.save();
      } else if (!doc) {
        new client.db.Users({ _id: user.id }).save();
      }
    });

    interaction.reply(`${quantidade} parcerias removidas ao ${user}`);
  },
};
