module.exports = (client, interaction) => {
  if (interaction.isStringSelectMenu()) {
    require("../menu/" + interaction.customId)(client, interaction);
  }
  if (interaction.isButton()) {
    if (
      interaction.customId.includes("next") ||
      interaction.customId.includes("prev")
    )
      return;
    require("../button/" + interaction.customId)(client, interaction);
  }
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      command.execute(interaction, client);
    } catch (err) {
      if (err) console.error(err);
      interaction.reply({
        content: "Um erro foi executado no meu grande algoritmo.",
        ephemeral: true,
      });
    }
  }
};
