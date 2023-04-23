const { connect, Schema, model, set } = require("mongoose");
const { ChalkAdvanced } = require("chalk-advanced");
const paginate = require("mongoose-paginate-v2");

set("strictQuery", true);

connect(process.env.db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    console.log(
      `${ChalkAdvanced.gray(">")} ${ChalkAdvanced.green(
        "✅ • Carregado com sucesso [BANCO DE DADOS]"
      )}`
    )
  )
  .catch(() =>
    console.log(
      `${ChalkAdvanced.gray(">")} ${ChalkAdvanced.red(
        "❎ • Conexão do banco de dados falhada"
      )}`
    )
  );

const userSchema = new Schema({
  _id: { type: String, required: true },
  parcerias: { type: Number },
});
userSchema.plugin(paginate);

const guildSchema = new Schema({
  _id: { type: String, required: true },
  partnerschedule: [
    {
      _id: { type: String },
      schedule: { type: Date },
    },
  ],
});

module.exports.Guilds = model("Guilds", guildSchema);
module.exports.Users = model("Users", userSchema);
