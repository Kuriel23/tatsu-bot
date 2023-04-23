const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("clear")
    .setNameLocalizations({ "en-US": "clear", "pt-BR": "limpar" })
    .setDescription("「Moderação」 Apaga mensagens no chat.")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("quantidade")
        .setDescription("Informe a quantidade de mensagens que deseja apagar.")
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(2)
    )
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const amount = interaction.options.getInteger("quantidade");
    const User = interaction.options.getUser("membro");

    const Response = new discord.EmbedBuilder().setColor(client.cor);

    const Messages = await interaction.channel.messages.fetch();

    const logs = client.channels.cache.get("997478408328052746");

    if (User) {
      let i = 0;
      const filtered = [];
      (await Messages).filter((m) => {
        if (m.author.id === User.id && amount > i) {
          filtered.push(m);
          i++;
        }
        return 0;
      });
      interaction.channel.bulkDelete(filtered, true).then(async (messages) => {
        Response.setDescription(
          `Deletando **__${messages.size}__** mensagens de ${User.tag} <a:LOADING:997512946093662248>`
        );
        interaction.reply({
          embeds: [Response],
        });
        setTimeout(() => {
          interaction.deleteReply();
        }, 5000);

        const MsgsExcluidasUser = new discord.EmbedBuilder()
          .setColor(client.cor)
          .setAuthor({
            name: `${interaction.guild.name}`,
            iconURL: interaction.guild.iconURL({ dybanic: true }),
          })
          .addFields(
            {
              name: `<:ARROW:997511314199027743> Autor do clear`,
              value: `${interaction.user} \`(${interaction.user.id})\``,
              inline: false,
            },
            {
              name: `<:ARROW:997511314199027743> Usuário que teve as mensagens excluídas`,
              value: `${User} \`(${User.id})\``,
              inline: false,
            },
            {
              name: `<:ARROW:997511314199027743> Quantidade de mensagens excluidas`,
              value: `${amount}`,
              inline: false,
            }
          )
          .setThumbnail(User.displayAvatarURL({ dynamic: true, size: 1024 }))
          .setTimestamp();
        await logs.send({ embeds: [MsgsExcluidasUser] });
      });
    } else {
      interaction.channel.bulkDelete(amount, true).then(async (messages) => {
        Response.setDescription(
          `Deletando **__${messages.size}__** mensagens<a:LOADING:997512946093662248>`
        );
        interaction.reply({
          embeds: [Response],
        });
        setTimeout(() => {
          interaction.deleteReply();
        }, 5000);

        const MsgsExcluidas = new discord.EmbedBuilder()
          .setColor(client.cor)
          .setAuthor({
            name: `${interaction.guild.name}`,
            iconURL: interaction.guild.iconURL({ dybanic: true }),
          })
          .addFields(
            {
              name: `<:ARROW:997511314199027743> Autor do clear`,
              value: `${interaction.user} \`(${interaction.user.id})\``,
              inline: false,
            },
            {
              name: `<:ARROW:997511314199027743> Quantidade de mensagens excluidas`,
              value: `${amount}`,
              inline: false,
            }
          )
          .setThumbnail(
            interaction.user.displayAvatarURL({ dynamic: true, size: 1024 })
          )
          .setTimestamp();
        await logs.send({ embeds: [MsgsExcluidas] });
      });
    }
  },
};
