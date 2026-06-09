const { registerPayaso } = require("../src/service/payasosService");
const db = require("../src/repository/payasosRepository");

describe("Pruebas de Integración: payasosService + SQLite", () => {
  // ANTES DE TODAS LAS PRUEBAS: Abrimos la BD y creamos la tabla
  beforeAll(async () => {
    await db.init();
  });

  // ANTES DE CADA PRUEBA: Limpiamos los datos para que sean independientes
  //beforeEach(async () => {
  //await db.clear();
  //});

  // DESPUÉS DE TODAS LAS PRUEBAS: Cerramos la conexión
  afterAll(async () => {
    await db.close();
  });

  // --- LAS PRUEBAS SON EXACTAMENTE IGUALES QUE ANTES ---

  test("Debe registrar un payaso nuevo y guardarlo en la base de datos", async () => {
    const result = await registerPayaso(
      "Pennywise",
      "payaso@ejemplo.com",
      "globo",
    );

    expect(result).toHaveProperty("id");
    expect(result.name).toBe("Pennywise");
    expect(result.arma).toBe("globo");

    const payasoInDb = await db.findPayasoByEmail("payaso@ejemplo.com");
    expect(payasoInDb).not.toBeNull();
    expect(payasoInDb.name).toBe("Pennywise");
    expect(payasoInDb.arma).toBe("globo");
  });

  test("Debe lanzar un error si intentamos registrar un email duplicado", async () => {
    await registerPayaso(
      "Juan Carlos Monedero",
      "venezuela@ejemplo.com",
      "sombrero",
    );

    await expect(
      registerPayaso("Carlos Falso", "venezuela@ejemplo.com", "zapatos"),
    ).rejects.toThrow("El payaso ya está registrado con ese email");
  });

  test("Debe lanzar un error si faltan datos y no tocar la base de datos", async () => {
    await expect(registerPayaso("Solo Nombre", null, null)).rejects.toThrow(
      "El nombre y el email son obligatorios",
    );

    const payasoInDb = await db.findPayasoByEmail(null);
    expect(payasoInDb).toBeNull();
  });
});
