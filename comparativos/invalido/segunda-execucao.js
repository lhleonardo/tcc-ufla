/**
 * Algoritmo para obter o tempo de execução gasto
 * para inicializar as dependências na primeira chamada
 * para a API, fornecida pela injeção de dependência.
 */

const { spawn } = require("child_process");
const kill = require("tree-kill");
const axios = require("axios");
const { v4: uuid } = require("uuid");
const fs = require("fs");

const client = axios.create({
  baseURL: "http://localhost:3333",
});

const pastaProjeto = "../implementacao-ddd"
const arquivoResultado = "./resultados/segunda-execucao-ddd.txt"

/**
 * Cria o processo responsável por inicializar o servidor.
 * 
 * Deve se preencher o _cwd_ para informar qual o caminho do
 * projeto, ou seja, qual é a implementação que deverá ser testada
 * 
 * @returns objeto que representa o processo criado
 */
async function criaServidor() {
  const child = spawn("yarn", ["dev:server"], { cwd: pastaProjeto });

  var output = "";

  child.stdout.setEncoding("utf8");
  child.stdout.on("data", (data) => {
    output = data;
    console.log("output servidor: " + data);
  });

  while (!output.includes("Server started on port 3333!")) {
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return child;
}

/**
 * Finaliza o processo criado no método `criaServidor()`
 * @param {*} servidor 
 * @returns Promise<void>
 */
function mataServidor(servidor) {
  console.log(`Matando servidor pid: ${servidor.pid}`);
  // return new Promise((resolve, reject) => {
  //   kill(servidor.pid, (err) => {
  //     if (err) {
  //       reject(err);
  //     }

  //     resolve();
  //   });
  // });
  spawn('kill', ['-QUIT', '-$(ps opgid= '+servidor.pid+')']);
}

/**
 * Realiza uma requisição, do tipo POST, para o servidor inicializado
 * (fornecendo meio de acesso pela porta 3333, via HTTP), e calcula o tempo
 * que foi gasto em sua execução.
 * 
 * @returns tempo gasto, em milissegundos
 */
async function realizaRequisicao() {
  const token = uuid().replaceAll("-", "").replaceAll(".", "");
  const email = `${token}@sample.com`;
  const name = "Testing child";
  const password = "123456789";

  await client.post("/users", {
    email,
    name,
    password,
    confirmPassword: password,
  });

  const startTime = performance.now();

  await client.post("/users", {
    email: `${token}@newsample.com.br`,
    name,
    password,
    confirmPassword: password,
  });

  const endTime = performance.now();

  return endTime - startTime;
}

/**
 * Escreve no final do arquivo de log atual o tempo que foi gasto.
 * 
 * Para valores de tempo inválidos (falsy) a escrita é ignorada.
 * 
 * @param {*} tempoGasto 
 * @returns void
 */
function escreverTempo(tempoGasto) {
  if (tempoGasto <= 0) return;
  fs.appendFileSync(arquivoResultado, tempoGasto.toString()+"\n");
}

/**
 * Método que realiza a análise da primeira requisição
 */
async function main() {
  const servidor = await criaServidor();

  let tempoGasto = 0;
  try {
    tempoGasto = await realizaRequisicao();
  } catch (e) {
    console.log(e.message);
  }

  mataServidor(servidor);

  console.log(tempoGasto);
  escreverTempo(tempoGasto);

  process.exit(tempoGasto > 0);
}

main();
