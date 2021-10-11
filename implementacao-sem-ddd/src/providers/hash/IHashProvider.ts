export default interface IHashProvider {
  generateHash(payload: string): Promise<string>;
  compare(payload: string, hashed: string): Promise<boolean>;
}
