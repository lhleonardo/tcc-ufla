import ICacheProvider from '../models/ICacheProvider';

interface ICacheStore {
  key: string;
  value: string;
}

export default class FakeCacheProvider implements ICacheProvider {
  private cache: ICacheStore[] = [];

  /**
   * Encontra uma determinada chave dentro do cache e retorna o índice da chave
   * caso exista na relação.
   *
   * Se não existir a chave na relação retorna `-1`.
   * @param key chave de referência de um valor no cache
   */
  private findIndexOfKey(key: string): number {
    const index = this.cache.findIndex(item => item.key === key);

    return index;
  }

  public async save(key: string, value: any): Promise<void> {
    const info: ICacheStore = {
      key,
      value: JSON.stringify(value),
    };

    const existInfoIndex = this.findIndexOfKey(info.key);

    // encontrou uma chave já relacionada ao cache
    if (existInfoIndex !== -1) {
      this.cache[existInfoIndex] = info;
    } else {
      this.cache.push(info);
    }
  }
  public async recovery<T>(key: string): Promise<T | null> {
    const index = this.findIndexOfKey(key);

    if (index === -1) {
      return null;
    }

    const info = this.cache[index];

    return JSON.parse(info.value) as T;
  }

  public async invalidate(key: string): Promise<void> {
    const index = this.findIndexOfKey(key);

    if (index >= 0) {
      this.cache.splice(index, 1);
    }
  }
  public async invalidatePrefix(prefix: string): Promise<void> {
    const keys = this.cache
      .filter(info => info.key.startsWith(`${prefix}:`))
      .map(info => info.key);

    keys.forEach(key => this.invalidate(key));
  }
}
