const express = require("express");
const { registerPayaso } = require("../src/service/payasosService");
const db = require("../src/repository/payasosRepository");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

async function register(req, res) {
  const { name, email, arma } = req.body;

  try {
    const payaso = await registerPayaso(name, email, arma);
    return res.status(201).json(payaso);
  } catch (error) {
    if (error.message === "El nombre y el email son obligatorios") {
      return res.status(400).json({ error: error.message });
    }
    if (error.message === "El payaso ya está registrado con ese email") {
      return res.status(409).json({ error: error.message });
    }
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

app.post("/payasos", register);

db.init().then(() => {
  app.listen(3000, () => console.log("Servidor en http://localhost:3000"));
});

module.exports = { register };
