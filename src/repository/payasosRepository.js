const sqlite3 = require("sqlite3");
const { open } = require("sqlite");

// Variable para guardar la conexión a la base de datos
let dbConnection;

const db = {
  // 1. Inicializamos la BD en memoria y creamos la tabla
  init: async () => {
    dbConnection = await open({
      // filename: ':memory:',  <-- Comentamos la memoria RAM
      filename: "./test.sqlite", // <-- Creamos un archivo físico
      driver: sqlite3.Database,
    });

    await dbConnection.exec(`
      CREATE TABLE IF NOT EXISTS payasos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        arma TEXT
      )
    `);
  },

  // 2. Buscar payaso
  findPayasoByEmail: async (email) => {
    // get() devuelve la primera fila que coincida
    const payaso = await dbConnection.get(
      "SELECT * FROM payasos WHERE email = ?",
      [email],
    );
    return payaso || null;
  },

  // 3. Guardar payaso
  savePayaso: async (payaso) => {
    // run() ejecuta la consulta (INSERT, UPDATE, DELETE)
    const result = await dbConnection.run(
      "INSERT INTO payasos (name, email, arma) VALUES (?, ?, ?)",
      [payaso.name, payaso.email, payaso.arma],
    );
    // SQLite devuelve el ID autogenerado en result.lastID
    return {
      id: result.lastID,
      name: payaso.name,
      email: payaso.email,
      arma: payaso.arma,
    };
  },

  // 4. Limpiar la base de datos entre pruebas (Borramos los registros, no la tabla)
  clear: async () => {
    await dbConnection.run("DELETE FROM payasos");
  },

  // 5. Cerrar la conexión al terminar todo
  close: async () => {
    if (dbConnection) {
      await dbConnection.close();
    }
  },
};

module.exports = db;
