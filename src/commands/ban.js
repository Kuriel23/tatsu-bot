const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("ban")
    .setNameLocalizations({ "en-US": "ban", "pt-BR": "banir" })
    .setDescription("「Moderação」 Bane um usuário do servidor.")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.BanMembers)
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
    const motivo = interaction.options.getString("motivo") || "Não informado.";
    const member = interaction.guild.members.cache.get(user.id);

    if (!interaction.member.permissions.has("BAN_MEMBERS"))
      return interaction.reply(
        "Você não tem permissão para usar este comando!"
      );

    if (interaction.user.id === user.id)
      return interaction.reply({
        content: "Você não pode banir a si mesmo!",
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o seu! Portanto, você não pode banir ele.",
        ephemeral: true,
      });

    if (
      interaction.guild.me.roles.highest.position <=
      member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o meu! Portanto, não posso banir ele.",
        ephemeral: true,
      });

    const logs = client.guilds.cache
      .get(member.guild.id)
      .channels.cache.get("997478408328052746");

    const banimento = new discord.EmbedBuilder()
      .setColor(client.cor)
      .setAuthor({
        name: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `<:ARROW:997511314199027743> Autor do Banimento`,
          value: `${interaction.user} \`(${interaction.user.id})\``,
          inline: false,
        },
        {
          name: `<:ARROW:997511314199027743> Usuário Banido`,
          value: `${user} \`(${user.id})\``,
          inline: false,
        },
        {
          name: `<:ARROW:997511314199027743> Motivo`,
          value: `**${motivo}**`,
          inline: false,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp();
    interaction.guild.members
      .ban({ reason: motivo })
      .then(() => interaction.reply("Usuário banido com sucesso!"));
    await logs.send({ embeds: [banimento] }).catch(() =>
      interaction.reply({
        content: "Erro ao banir o usuário!",
        ephemeral: true,
      })
    );
  },
};
