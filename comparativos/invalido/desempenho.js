const { v4: uuid } = require("uuid");
const fs = require("fs").promises;

const axios = require("axios");

const client = axios.create({
  baseURL: "http://172.21.71.105:3333",
});

const NUM_EXECUTIONS = 1000;
const tipoImplementacao = "ddd";

const loggedUser =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzQwNDAyMDEsImV4cCI6MTYzNDEyNjYwMSwic3ViIjoiZTEyOTU0ZDktNDc0ZS00NGUxLWE0NGYtZjg1MDM0ZTg5MzA1In0.RBgNFIkrN2UC-RqrECXR7mPKdyXa9t2JLk_GvaaCpXk";

const providerToken =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzQwNDAxODMsImV4cCI6MTYzNDEyNjU4Mywic3ViIjoiMDBjZTlkN2MtZWM5YS00MzhjLWE3YTYtNzQ2OTZkMmUyZjhkIn0.q-99KDozyc4SRzXxzMFGUyxYYYg2HtvyYQwYG4Wn47Y";

const providerId = "00ce9d7c-ec9a-438c-a7a6-74696d2e2f8d";

const requests = [
  {
    name: "Criar conta",
    output: `./resultados/criar-conta-${tipoImplementacao}.txt`,
    execute: async (index) => {
      await client.post("/users", {
        name: `Nome de teste ${index}`,
        email: `${uuid().replace("-", "").replace(".", "")}@mail.com`,
        password: "123456789",
        confirmPassword: "123456789",
      });
    },
  },
  {
    name: "Agendar um atendimento",
    output: `./resultados/criar-agendamento-${tipoImplementacao}.txt`,
    execute: async (index) => {
      const appointmentDate = new Date();
      appointmentDate.setDate(appointmentDate.getDate() + index);
      appointmentDate.setHours(10);

      await client.post(
        "/appointments",
        { providerId, date: appointmentDate },
        { headers: { Authorization: `Bearer ${loggedUser}` } }
      );

      appointmentDate.setHours(12);
      await client.post(
        "/appointments",
        { providerId, date: appointmentDate },
        { headers: { Authorization: `Bearer ${loggedUser}` } }
      );

      appointmentDate.setHours(14);
      await client.post(
        "/appointments",
        { providerId, date: appointmentDate },
        { headers: { Authorization: `Bearer ${loggedUser}` } }
      );

      appointmentDate.setHours(16);
      await client.post(
        "/appointments",
        { providerId, date: appointmentDate },
        { headers: { Authorization: `Bearer ${loggedUser}` } }
      );
    },
  },
  {
    name: "Ver prestadores dispon??veis",
    output: `./resultados/ver-prestadores-${tipoImplementacao}.txt`,
    execute: async () => {
      await client.get("/providers", {
        headers: { Authorization: `Bearer ${loggedUser}` },
      });
    },
  },
  {
    name: "Listar agendamentos marcados",
    output: `./resultados/listar-agendamentos-${tipoImplementacao}.txt`,
    execute: async (index) => {
      const dataListagem = new Date();
      dataListagem.setDate(dataListagem.getDate() + index);

      await client.get("/appointments/me", {
        headers: { Authorization: `Bearer ${providerToken}` },
        params: {
          year: dataListagem.getFullYear(),
          month: dataListagem.getMonth() + 1,
          day: dataListagem.getDate()
        }
      });
    },
  },
];

async function executeRequest(request) {
  const executionTimes = [];

  for (let i = 0; i < NUM_EXECUTIONS; i++) {
    const startTime = performance.now();

    await request.execute(i + 1);

    const endTime = performance.now();

    const runningTime = (endTime - startTime);

    executionTimes.push(runningTime);
  }

  return executionTimes;
}

async function saveResults(output, times) {
  let content = "";

  times.forEach((time) => (content += time + "\n"));

  await fs.writeFile(output, content);
}

async function main() {
  for (const request of requests) {
    console.log(`Executando: ${request.name}`);
    console.time(request.name);

    const runningTimes = await executeRequest(request);

    await saveResults(request.output, runningTimes);

    console.timeEnd(request.name);
  }
}

main();
