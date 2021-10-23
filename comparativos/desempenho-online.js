const { v4: uuid } = require("uuid");
const axios = require("axios");

const client = axios.create({
  baseURL: "http://157.230.0.64:3333",
});

const NUM_EXECUTIONS = 300;

let loggedUserToken = undefined;

let providerId = undefined;
let providerUserToken = undefined;

async function generateSession(email, password) {
  const response = await client.post("/sessions", {
    email,
    password,
  });

  return response.data.token;
}

async function generateUsers() {
  for (let i = 0; i < NUM_EXECUTIONS; i++) {
    const name = uuid().replace("-", "").replace(".", "");
    const createdUser = await client.post("/users", {
      name: `Name ${name}`,
      email: `${name}@mail.com`,
      password: "123456789",
      confirmPassword: "123456789",
    });

    //autentica e deixa o token guardado para usuário ou provedor, mas ambos não podem ser o mesmo usuário.
    if (!loggedUserToken) {
      loggedUserToken = await generateSession(`${name}@mail.com`, "123456789");
      continue;
    }

    if (!providerUserToken) {
      providerId = createdUser.data.id;
      providerUserToken = await generateSession(
        `${name}@mail.com`,
        "123456789"
      );
      continue;
    }
  }
}

async function generateAppointments() {
  for (let i = 0; i < NUM_EXECUTIONS; i++) {
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + (i + 1));
    appointmentDate.setHours(10);
    appointmentDate.setMinutes(0);
    appointmentDate.setSeconds(0);
    appointmentDate.setMilliseconds(0);

    await client.post(
      "/appointments",
      { providerId, date: appointmentDate },
      { headers: { Authorization: `Bearer ${loggedUserToken}` } }
    );
  }
}

async function getProviders() {
  for (let i = 0; i < NUM_EXECUTIONS; i++) {
    await client.get("/providers", {
      headers: { Authorization: `Bearer ${loggedUserToken}` },
    });
  }
}

async function getSchedules() {
  for (let i = 0; i < NUM_EXECUTIONS; i++) {
    const dataListagem = new Date();
    dataListagem.setDate(dataListagem.getDate() + i);

    await client.get("/appointments/me", {
      headers: { Authorization: `Bearer ${providerUserToken}` },
      params: {
        year: dataListagem.getFullYear(),
        month: dataListagem.getMonth() + 1,
        day: dataListagem.getDate(),
      },
    });
  }
}

async function main() {
  console.log("Inicio da Execução");
  console.time("tempoGastoCliente");

  await generateUsers();
  await generateAppointments();
  await getProviders();
  await getSchedules();

  console.log("Fim!");
  console.timeEnd("tempoGastoCliente");
}

main();
