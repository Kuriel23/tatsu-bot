const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("kick")
    .setNameLocalizations({ "en-US": "kick", "pt-BR": "expulsar" })
    .setDescription("「Moderação」 Expulsa um usuário do servidor.")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.KickMembers)
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("motivo")
        .setDescription(
          "Selecione a quantidade de parcerias que deseja adicionar"
        )
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membro");
    const reason = interaction.options.getString("motivo") || "Não informado.";
    const member = interaction.guild.members.cache.get(user.id);

    if (interaction.user.id === user.id)
      return interaction.reply({
        content: "Você não pode expulsar a si mesmo!",
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o seu! Portanto, você não pode expulsar ele.",
        ephemeral: true,
      });

    if (
      interaction.guild.me.roles.highest.position <=
      member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o meu! Portanto, não posso expulsar ele.",
        ephemeral: true,
      });

    const logs = client.channels.cache.get("997478408328052746");

    const expulsao = new discord.EmbedBuilder()
      .setColor(client.cor)
      .setAuthor({
        name: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `<:ARROW:997511314199027743> Autor da Expulsão`,
          value: `${interaction.user} \`(${interaction.user.id})\``,
          inline: false,
        },
        {
          name: `<:ARROW:997511314199027743> Usuário Expulso`,
          value: `${user} \`(${user.id})\``,
          inline: false,
        },
        {
          name: `<:ARROW:997511314199027743> Motivo`,
          value: `**${reason}**`,
          inline: false,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    interaction.guild.members
      .kick(user)
      .then(() => interaction.reply("Usuário expulso com sucesso!"));
    logs.send({ embeds: [expulsao] }).catch(() =>
      interaction.reply({
        content: "Erro ao expulsar o usuário!",
        ephemeral: true,
      })
    );
  },
};
