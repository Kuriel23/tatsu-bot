const discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("beijar")
    .setNameLocalizations({
      "pt-BR": "beijar",
      "en-US": "kiss",
    })
    .setDescription("「Ações」 Beije um usuário.")
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("usuário");
    const { body } = await superagent.get("https://api.waifu.pics/sfw/kiss");

    const embed = new discord.EmbedBuilder()
      .setDescription(`${interaction.user} **beijou** ${user}`)
      .setImage(body.url)
      .setColor(client.cor);

    const button = new discord.ActionRowBuilder().addComponents(
      new discord.ButtonBuilder()
        .setCustomId("1")
        .setLabel("Retribuir")
        .setStyle(1)
        .setEmoji("🔁")
    );

    const embed1 = new discord.EmbedBuilder()
      .setDescription(`${user} **retribuiu o beijo**`)
      .setColor(client.cor)
      .setImage(body.url);

    interaction
      .reply({
        content: `${interaction.user},`,
        embeds: [embed],
        components: [button],
      })
      .then(() => {
        const filter = (i) => i.customId === "1" && i.user.id === user.id;
        const collector = interaction.channel.createMessageComponentCollector({
          filter,
          max: 1,
        });

        collector.on("collect", async (i) => {
          if (i.customId === "1") {
            i.reply({ content: `${user}`, embeds: [embed1] });
          }
        });
      });
  },
};
