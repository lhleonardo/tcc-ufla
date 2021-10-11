const { v4: uuid } = require("uuid")
const fs = require("fs").promises

const axios = require("axios")

const client = axios.create({
    baseURL: "http://172.21.66.232:3333"
})

const NUM_EXECUTIONS = 1000

const requests = [
    {
        name: "Criar conta",
        output: "./resultados/criar-conta-ddd.txt",
        execute: async (index) => {
            await client.post("/users", {
                name: `Nome de teste ${index}`,
                email: `${uuid().replace("-", "").replace(".", "")}@mail.com`,
                password: '123456789',
                confirmPassword: '123456789'
            });
        }
    },
    {
        name: "Agendar um atendimento",
        output: "./resultados/criar-agendamento-ddd.txt",
        execute: async (index) => {
            const appointmentDate = new Date();
            appointmentDate.setDate(appointmentDate.getDate() + index);

            const userToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2MzM5NzEzMTQsImV4cCI6MTYzNDA1NzcxNCwic3ViIjoiZTEyOTU0ZDktNDc0ZS00NGUxLWE0NGYtZjg1MDM0ZTg5MzA1In0.yxdBzkxGNPw2XbbADw7zpaTUjyVZ8rfDNmvl81u0pZw"
            const providerId = "00ce9d7c-ec9a-438c-a7a6-74696d2e2f8d"

            await client.post("/appointments", { providerId, date: appointmentDate }, { headers: { "Authorization": `Bearer ${userToken}` } })
        }
    },
]

async function executeRequest(request) {
    const executionTimes = []

    for (let i = 0; i < NUM_EXECUTIONS; i++) {
        const startTime = performance.now();

        await request.execute(i + 1);

        const endTime = performance.now();

        const runningTime = (endTime - startTime) / 1000;

        executionTimes.push(runningTime);
    }

    return executionTimes;
}

async function saveResults(output, times) {
    let content = "";

    times.forEach(time => content += time + "\n");

    await fs.writeFile(output, content);
}


async function main() {
    for (const request of requests) {
        console.log(`Executando: ${request.name}`)
        console.time(request.name);
    
        const runningTimes = await executeRequest(request);
    
        await saveResults(request.output, runningTimes);
    
        console.timeEnd(request.name);
    }
}


main()
