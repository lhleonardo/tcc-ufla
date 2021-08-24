export default interface IStorageProvider {
  uploadFile(file: string): Promise<string>;
  deleteFile(file: string): Promise<void>;
}
