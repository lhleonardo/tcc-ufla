const { v4: uuid } = require("uuid");
const fs = require("fs").promises;

const axios = require("axios");

const client = axios.create({
  baseURL: "http://172.21.66.232:3333",
});

const NUM_EXECUTIONS = 1000;
const tipoImplementacao = "semddd";

const loggedUser =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzM5OTc1NzMsImV4cCI6MTYzNDA4Mzk3Mywic3ViIjoiYjU0MWVmOWYtYzIxMC00ZDcyLWIxYzktODIzYzZmNDRlYmRiIn0.8-FaqXubWY2sZBIMmfK24CGQt61NGCOaLiuF5piZqbs";

const providerToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzM5OTg5NzQsImV4cCI6MTYzNDA4NTM3NCwic3ViIjoiYmU4NTlmODgtZmM3YS00YWRlLWI0NGQtN2NhMzZhOTI2ZTA3In0.hZlVGLYbCnbnyyvwb4SX9ym4FCYZZ04RA61k0QM5HQk";

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

      const providerId = "be859f88-fc7a-4ade-b44d-7ca36a926e07";

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
    name: "Ver prestadores disponíveis",
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
