const discord = require("discord.js");
require("dotenv").config();

const client = new discord.Client({
  intents: 3276799,
  cacheWithLimits: {
    MessageManager: {
      sweepInterval: 300,
      sweepFilter: discord.Sweepers.filterByLifetime({
        lifetime: 60,
        getComparisonTimestamp: (m) => m.editedTimestamp ?? m.createdTimestamp,
      }),
    },
  },
});

client.cor = "#7289DA";
client.db = require("./database");
client.canais = {
  errors: "997478408328052746",
  logs: "997478408328052746",
};

process.on("unhandledRejection", (error) => {
  console.log(error);
  client.channels.cache
    .get(client.canais.errors)
    .send("Erro detectado: \n" + error);
});
process.on("uncaughtException", (error) => {
  console.log(error);
  client.channels.cache
    .get(client.canais.errors)
    .send("Erro detectado: \n" + error);
});

const boilerplateComponents = async () => {
  await require("./src/util/boilerplateClient")(client);
};

boilerplateComponents();
