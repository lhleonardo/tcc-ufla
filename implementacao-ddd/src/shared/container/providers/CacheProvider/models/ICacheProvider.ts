export default interface ICacheProvider {
  /**
   * Adiciona ao cache um novo valor referenciado pela chave.
   *
   * @param key chave de referência no cache
   * @param value valor para ser salvo no cache
   */
  save(key: string, value: any): Promise<void>;

  /**
   * Recupera no cache um valor salvo pela **key**, sendo instancia de um
   * tipo T.
   *
   * @param key chave de referência no cache
   */
  recovery<T>(key: string): Promise<T | null>;

  /**
   * Remove do cache a informação armazenada pela *key* referenciada
   *
   * @param key chave a ser invalidada
   */
  invalidate(key: string): Promise<void>;

  /**
   * Remove do cache todas as ocorrências de chaves que são referenciadas
   * a partir de um determinado prefixo.
   *
   * @param prefix prefixo da chave existente no cache
   */
  invalidatePrefix(prefix: string): Promise<void>;
}
