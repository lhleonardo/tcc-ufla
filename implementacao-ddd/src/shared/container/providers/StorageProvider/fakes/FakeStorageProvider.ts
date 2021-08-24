import IStorageProvider from '../models/IStorageProvider';

export default class FakeStorageProvider implements IStorageProvider {
  private files: string[] = [];

  async uploadFile(file: string): Promise<string> {
    this.files.push(file);

    return file;
  }

  async deleteFile(file: string): Promise<void> {
    const index = this.files.findIndex(currentFile => currentFile === file);

    this.files.splice(index, 1);
  }
}
