const discord = require("discord.js");

module.exports = {
  data: new discord.SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("「Informações」 Exibe informações sobre o servidor."),
  async execute(interaction, client) {
    const {
      ownerId,
      description,
      members,
      memberCount,
      channels,
      emojis,
      stickers,
      premiumTier,
      premiumSubscriptionCount,
      roles,
    } = interaction.guild;

    const server = new discord.EmbedBuilder()
      .setColor(client.cor)
      .setThumbnail(interaction.guild.iconURL({ dynamic: true, size: 1024 }))
      .addFields(
        { name: `👑 Dono`, value: `<@${ownerId}>`, inline: true },
        {
          name: `📋 Informações`,
          value: `> **Nome:** ${interaction.guild.name} \n> **Descrição:** ${
            description || "Sem descrição"
          } \n> **Servidor Criado:** ${discord.time(
            interaction.guild.createdAt,
            "R"
          )}`,
        },
        {
          name: "👥 Usuários",
          value: `> **Total:** ${memberCount} \n> **Bots:** ${
            members.cache.filter((m) => m.user.bot).size
          } \n> **Cargos:** ${roles.cache.size} \n> **Usuários:** ${
            members.cache.filter((m) => !m.user.bot).size
          }`,
          inline: true,
        },
        {
          name: "💬 Canais",
          value: `> **Total:** ${channels.cache.size} \n> **Voz:** ${
            channels.cache.filter((c) => c.type === "GUILD_VOICE").size
          } \n> **Texto:** ${
            channels.cache.filter((c) => c.type === "GUILD_TEXT").size
          } \n> **Threads:** ${
            channels.cache.filter(
              (c) =>
                c.type === "GUILD_NEWS_THREAD" &&
                "GUILD_PUBLIC_THREAD" &&
                "GUILD_PRIVATE_THREAD"
            ).size
          }`,
          inline: true,
        },
        {
          name: "🌟 Emojis & Stickers",
          value: `> **Total:** ${
            stickers.cache.size + emojis.cache.size
          } \n> **Animado:** ${
            emojis.cache.filter((e) => e.animated).size
          } \n> **Estático:** ${
            emojis.cache.filter((e) => !e.animated).size
          } \n> **Stickers:** ${stickers.cache.size}`,
          inline: true,
        },
        {
          name: "🚀 Server Boost",
          value: `> **Nível:** ${premiumTier.replace(
            "TIER_",
            ""
          )} \n> **Boosts:** ${premiumSubscriptionCount} \n> **Boosters:** ${
            members.cache.filter((m) => m.premiumSince).size
          }`,
        }
      );

    interaction.reply({ embeds: [server] });
  },
};
