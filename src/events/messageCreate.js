const discord = require("discord.js");
// eslint-disable-next-line no-unused-vars
const path = "../messages/";
const schedule = require("node-schedule");

module.exports = async (client, message) => {
  if (message.guild === null) return;

  if (message.author.bot) return 0;

  if (message.channel.id === "1053733164826243224") {
    const parceiro = "943653235498029106";
    const membro = message.mentions.members.first();
    client.db.Users.findOne({ _id: message.author.id }, function (err, doc) {
      if (err) return err;
      if (!membro)
        return message.channel
          .send("Mencione um usuário no convite, por favor.")
          .then((msg) => {
            setTimeout(() => msg.delete(), 10000);
          });

      if (doc) {
        doc.parcerias += 1;
        doc.save();
      } else {
        client.db.Users({ _id: message.author.id, parcerias: 1 }).save();
      }

      const Embed = new discord.EmbedBuilder()
        .setTitle("Nova Parceria!")
        .setDescription(
          `> Uma nova parceira foi feita no servidor. **${
            message.author.tag
          }** fez **${doc.parcerias || 1}** parcerias ao total`
        )
        .setColor(client.cor);

      membro.roles.add(parceiro);
      message.reply({ content: "<@&943653245094596608>", embeds: [Embed] });

      client.db.Guilds.findOne({ _id: "1" }, function (err, doc) {
        if (err) throw err;
        const _date = new Date();
        _date.setDate(_date.getDate() + 7);
        const date = new Date(_date);
        doc.partnerschedule.push({
          _id: membro.id,
          schedule: date,
        });
        doc.save();

        schedule.scheduleJob(date, function () {
          message.guild.members.cache.get(membro.id).roles.remove(parceiro);
          membro.send(
            "A parceria com o servidor **Geek Nation** expirou, por favor chame algum staff que faça parceria na dm."
          );
          doc.partnerschedule.pull({
            _id: membro.id,
          });
          doc.save();
        });
      });
    });
  }

  if (
    message.content === `<@${client.user.id}>` ||
    message.content === `<@!${client.user.id}>`
  ) {
    const bot = new discord.EmbedBuilder()
      .setTitle(`Oi, eu sou a Tatsu`)
      .setColor(client.cor)
      .setDescription("Para usar meus comandos use **/**");
    message.channel.send({ embeds: [bot] });
  }

  if (message.guild.id === process.env.GUILD_ID) {
    if (message.author.id !== "354233941550694400") return;
    if (message.content.startsWith(`<@${client.user.id}>`)) {
      const embed = new discord.EmbedBuilder()
        .setTitle("Tatsu Control - A fast and efficient control")
        .setDescription(
          "Controle a adesão de novos servidores, comandos de desenvolvimento tudo num menu de controlo rápido e eficiente!"
        )
        .setColor(client.cor);
      const row = new discord.ActionRowBuilder().addComponents(
        new discord.StringSelectMenuBuilder()
          .setCustomId("control")
          .setPlaceholder("Controle tudo imediatamente!")
          .addOptions({
            label: "Faça evaluate de um código (dev only)",
            description: "Cuidado isto pode ser perigoso!",
            value: "eval",
          })
      );
      message.reply({ embeds: [embed], components: [row] });
    }
  }
};
