const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("userinfo")
    .setNameLocalizations({
      "pt-BR": "info_usuário",
      "en-US": "userinfo",
    })
    .setDescription("「Informações」 Exibe as informações do usuário.")
    .addUserOption((option) =>
      option
        .setName("membro")
        .setNameLocalizations({ "pt-BR": "membro", "en-US": "member" })
        .setDescription("Identifique o membro")
        .setRequired(false)
    ),
  async execute(interaction, client) {
    const flags = {
      DISCORD_EMPLOYEE: "<:DISCORD_EMPLOYEE:997455337957380096>",
      DISCORD_PARTNER: "<:DISCORD_PARTNER:997455311105433670>",
      BUGHUNTER_LEVEL_1: "<:BUGHUNTER_LEVEL_1:997455290595291196>",
      BUGHUNTER_LEVEL_2: "<:BUGHUNTER_LEVEL_2:997455267870560287>",
      HYPESQUAD_EVENTS: "<:HYPESQUAD_EVENTS:997455235532476427>",
      HOUSE_BRAVERY: "<:HOUSE_BRAVERY:997455202049343498>",
      HOUSE_BRILLIANCE: "<:HOUSE_BRILLIANCE:997455166590701569>",
      HOUSE_BALANCE: "<:HOUSE_BALANCE:997455137327030292>",
      EARLY_SUPPORTER: "<:EARLY_SUPPORTER:997455104133308552>",
      VERIFIED_DEVELOPER: "<:VERIFIED_DEVELOPER:997455071656820736> ",
    };

    const user = interaction.options.getUser("usuario") || interaction.user;
    if (!interaction.member)
      return interaction.reply({
        content: "Membro não aparenta estar neste servidor.",
      });
    const userFlags = user.flags.toArray();

    const embed = new discord.EmbedBuilder()
      .setColor(client.cor)
      .addFields(
        { name: `👤 Nome`, value: user.username, inline: true },
        { name: "#️⃣ Tag", value: user.discriminator, inline: true },
        { name: "🆔 ID", value: user.id, inline: true },
        {
          name: "📌 Status",
          value: `\`\`\`${
            interaction.member.presence?.activities[0]?.state || "Nenhum"
          }\`\`\``,
        },
        {
          name: "🗓️ Conta Criada",
          value: discord.time(user.createdAt, "F"),
        },
        {
          name: "🗓️ Entrada no Servidor",
          value: discord.time(interaction.member.joinedAt, "F"),
        },
        {
          name: "🤖 Bot?",
          value: user.bot ? "Sim" : "Não",
          inline: true,
        },
        {
          name: `🚀 Server Booster`,
          value: interaction.member.premiumSince
            ? `Desde ${discord.time(
                interaction.member.premiumSinceTimestamp,
                "F"
              )}`
            : "Não",
          inline: true,
        },
        {
          name: `📚 Cargos`,
          value:
            interaction.member.roles.cache
              .sort((a, b) => b.position - a.position)
              .filter((role) => role !== interaction.guild.roles.everyone)
              .map((role) => role)
              .join(" ") || `Nenhum`,
        }
      )
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 1024 }));

    if (userFlags.length) {
      embed.setTitle(userFlags.map((flag) => flags[flag]).join(" "));
    }

    return interaction.reply({ embeds: [embed] });
  },
};
