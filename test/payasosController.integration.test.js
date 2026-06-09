// payasosController.test.js
const request = require("supertest");
const express = require("express");

// Mock del servicio
jest.mock("../src/service/payasosService");
const { registerPayaso } = require("../src/service/payasosService");

// Mock de la base de datos para evitar conexiones reales
jest.mock("../src/repository/payasosRepository", () => ({
  init: jest.fn().mockResolvedValue(),
}));

const { register } = require("./src/controller/payasosController");

// Montamos una app de prueba sin levantar el servidor real
const app = express();
app.use(express.json());
app.post("/payasos", register);

describe("POST /payasos - Registro de payaso", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("debe devolver 201 cuando se inserta un payaso correctamente", async () => {
    const nuevoPayaso = {
      name: "Pepito",
      email: "pepito@circo.com",
      arma: "pistola de agua",
    };

    const payasoCreado = { id: 1, ...nuevoPayaso };

    // Simulamos que el servicio resuelve con el payaso creado
    registerPayaso.mockResolvedValue(payasoCreado);

    const response = await request(app)
      .post("/payasos")
      .send(nuevoPayaso)
      .set("Content-Type", "application/json");

    expect(response.status).toBe(201);
    expect(response.body).toEqual(payasoCreado);
    expect(registerPayaso).toHaveBeenCalledWith(
      nuevoPayaso.name,
      nuevoPayaso.email,
      nuevoPayaso.arma,
    );
  });
});
