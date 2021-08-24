// sobrescrita das declarações de tipos presente no express
// para que as requisições sempre tenham acesso ao user_id
// obtido pelo middleware ensureAuthentication
declare namespace Express {
  export interface Request {
    // DETALHE: isso só acrescenta no arquivo de configurações
    user: {
      id: string;
    };
  }
}
