const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { readdirSync } = require("fs");
require("dotenv").config();
const { ChalkAdvanced } = require("chalk-advanced");
const schedule = require("node-schedule");

module.exports = async (client) => {
  schedulers();

  async function schedulers() {
    client.db.Guilds.findOne({ _id: "1" }, async function (err, not) {
      if (err) throw err;
      not.partnerschedule.forEach((partner) => {
        schedule.scheduleJob(partner.schedule, function () {
          const person = client.guilds.cache
            .get("943646229496229909")
            .members.cache.get(partner._id);
          person.roles.remove("943653235498029106");
          person.send(
            "A parceria com o servidor **Geek Nation** expirou, por favor chame algum staff que faça parceria na dm."
          );
          not.partnerschedule.pull({ _id: partner._id });
        });
      });
      await not.save();
    });
  }

  const commandFiles = readdirSync("./src/commands/").filter((file) =>
    file.endsWith(".js")
  );

  const commands = [];

  for (const file of commandFiles) {
    const command = require(`../commands/${file}`);
    commands.push(command.data.toJSON());
    client.commands.set(command.data.name, command);
  }

  const rest = new REST({
    version: "10",
  }).setToken(process.env.TOKEN);

  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), {
        body: commands,
      });
      console.log(
        `${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
          "Sucesso registrado comandos globalmente"
        )}`
      );
    } catch (err) {
      if (err) console.error(err);
    }
  })();
  client.user.setPresence({
    activities: [{ name: `${client.users.cache.size} membros.`, type: 3 }],
    status: "online",
  });
};
