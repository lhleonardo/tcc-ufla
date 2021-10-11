const { Command } = require("commander")
const {v4: uuid} = require("uuid")
const fs = require("fs").promises

const axios = require("axios")

const APP_CREATE_USER_URL = "http://172.21.78.93:3333/users"
const NUM_EXECUTIONS = 1000

function createCLI() {
    const application = new Command()
    application.version("0.0.1")
    application.requiredOption("-o, --output <file>", "output location")
    application.parse()

    return application.opts()
}

async function doRequest(index) {
    const startTime = performance.now();

    await axios.post(APP_CREATE_USER_URL, {
        name: `Nome de teste ${index}`,
        email: `${uuid().replace("-", "").replace(".", "")}@mail.com`,
        password: '123456789',
        confirmPassword: '123456789'
    })

    const endTime = performance.now();

    return (endTime - startTime) / 1000
}

async function execute() {
    const executionTimes = []

    for (let i = 0; i < NUM_EXECUTIONS; i++) {
        const runningTime = await doRequest(i + 1);
        executionTimes.push(runningTime)
    }

    return executionTimes
}

async function saveResults(output, times) {
    let content = ""
    
    times.forEach(time => content += time + "\n")

    await fs.writeFile(output, content)
}


async function main() {
    const result = createCLI()

    const times = await execute(result.output);

    saveResults(result.output, times);
}


main()
