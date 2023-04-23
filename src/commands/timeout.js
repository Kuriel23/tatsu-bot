const discord = require("discord.js");
const ms = require("ms-pt-br");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("timeout")
    .setNameLocalizations({ "en-US": "mute", "pt-BR": "silenciar" })
    .setDescription("「Moderação」 Silencie um usuário.")
    .setDefaultMemberPermissions(discord.PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("tempo")
        .setDescription(
          "Informe o tempo que o usuário vai ficar silenciado [s, m ou d]"
        )
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("motivo")
        .setDescription(
          "Selecione a quantidade de parcerias que deseja adicionar"
        )
        .setRequired(true)
    ),
  async execute(interaction, client) {
    const user = interaction.options.getUser("membro");
    const time = interaction.options.getString("tempo");
    const reason = interaction.options.getString("motivo") || "Não informado.";
    const member = interaction.guild.members.cache.get(user.id);

    const logs = client.channels.cache.get(client.canais.logs);

    const timer = ms(time);

    if (interaction.user.id === user.id)
      return interaction.reply({
        content: "Você não pode silenciar a si mesmo!",
        ephemeral: true,
      });

    if (
      member.roles.highest.position >= interaction.member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o seu! Portanto, você não pode silenciar ele.",
        ephemeral: true,
      });

    if (
      interaction.guild.me.roles.highest.position <=
      member.roles.highest.position
    )
      return interaction.reply({
        content:
          "O cargo do usuário é mais alto que o meu! Portanto, não posso silenciar ele.",
        ephemeral: true,
      });

    if (timer < 10000 || timer > 2419200000)
      return interaction.reply({
        content: `Esse tempo excede/ou é menor que o limite de silenciar! O tempo vai de 10 segundos até 28 dias.`,
        ephemeral: true,
      });

    const LogSilenciado = new discord.EmbedBuilder()
      .setColor(client.cor)
      .setAuthor({
        name: `${interaction.guild.name}`,
        iconURL: interaction.guild.iconURL({ dynamic: true }),
      })
      .addFields(
        {
          name: `<:ARROW:997511314199027743> Autor`,
          value: `${interaction.user} \`(${interaction.user.id})\``,
        },
        {
          name: `<:ARROW:997511314199027743> Usuário Castigado`,
          value: `${user} \`(${user.id})\``,
        },
        {
          name: `<:ARROW:997511314199027743> Tempo`,
          value: `**${ms(time, { long: true })}**`,
        },
        {
          name: `<:ARROW:997511314199027743> Motivo`,
          value: `**${reason}**`,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    const silenciado = new discord.EmbedBuilder()
      .setColor(client.cor)
      .addFields(
        {
          name: `<:ARROW:997511314199027743> Você foi castigado no servidor`,
          value: `**${interaction.guild.name}**`,
        },
        {
          name: `<:ARROW:997511314199027743> Autor`,
          value: `${interaction.user.tag} \`(${interaction.user.id})\``,
        },
        {
          name: `<:ARROW:997511314199027743> Tempo`,
          value: `**${ms(time, { long: true })}**`,
        },
        {
          name: `<:ARROW:997511314199027743> Motivo`,
          value: `**${reason}**`,
        }
      )
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
      .setTimestamp();

    await user.send({ embeds: [silenciado] });

    member
      .timeout(timer, reason)
      .then(() => interaction.reply("Usuário silenciado com sucesso!"));
    logs.send({ embeds: [LogSilenciado] }).catch(() =>
      interaction.reply({
        content: "Erro ao castigar o usuário!",
        ephemeral: true,
      })
    );
  },
};
