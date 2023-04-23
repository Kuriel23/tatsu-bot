const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("rankparcerias")
    .setDescription(
      "「Moderação」 Mostra quantas parcerias foram feitas pelos staffs e o rank deles."
    )
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageGuild),
  async execute(interaction, client) {
    await interaction.reply("Carregando...");
    let page;
    let buttonname;
    let collector;
    await Search(1);
    async function Search(pagina) {
      const parcerias = await client.db.Users.paginate(
        {},
        { page: pagina, limit: 15, sort: { parcerias: -1 } }
      ).catch((err) => {
        if (err)
          return interaction.editReply({
            content: client.msg.content.searchinvalid,
          });
      });
      page = parcerias.page;

      const str2 = Math.floor(Math.random() * 100);
      buttonname = str2;
      const antes = new discord.ButtonBuilder()
        .setCustomId(str2 + "prevx")
        .setEmoji("⏮️")
        .setStyle(2)
        .setDisabled(!parcerias.hasPrevPage);
      const depois = new discord.ButtonBuilder()
        .setCustomId(str2 + "nextx")
        .setEmoji("⏭️")
        .setStyle(2)
        .setDisabled(!parcerias.hasNextPage);
      const botao = new discord.ActionRowBuilder()
        .addComponents(antes)
        .addComponents(depois);
      const parceriass = new discord.EmbedBuilder()
        .setTitle(
          "Rank dos staffs de parceria e quantas parcerias foram feitas por eles."
        )
        .setFooter({
          text: `Página ${parcerias.page} de ${parcerias.totalPages} páginas`,
        })
        .setColor(client.cor);
      if (parcerias.docs[0]) {
        const fields = parcerias.docs.map((w, index) => ({
          name: `${parcerias.pagingCounter + index}. ${
            interaction.guild.members.cache.get(w._id)
              ? interaction.guild.members.cache.get(w._id).user.username
              : w._id
          }`,
          value: `**Parcerias**: ${w.parcerias
            .toLocaleString("pt-BR")
            .toString()}`,
          inline: true,
        }));

        parceriass.addFields(...fields);
      }
      const mensagem = await interaction.editReply({
        content: null,
        embeds: [parceriass],
        components: [botao],
      });
      const filter = (interaction) =>
        interaction.customId === buttonname + "nextx" ||
        interaction.customId === buttonname + "prevx";
      collector = mensagem.createMessageComponentCollector({
        filter,
        time: 300000,
      });
    }
    collector.on("collect", (i) => {
      if (i.user.id === interaction.member.id) {
        if (i.customId === buttonname + "nextx") {
          i.deferUpdate();
          Search(page + 1);
        }
        if (i.customId === buttonname + "prevx") {
          i.deferUpdate();
          Search(page - 1);
        }
      } else {
        i.reply({
          content: client.msg.content.invalid,
          ephemeral: true,
        });
      }
    });
  },
};
