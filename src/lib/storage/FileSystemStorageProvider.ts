import { IStorageProvider } from '@/interfaces/IStorageProvider';
import { writeFile, unlink, readFile } from 'fs/promises';
import { join } from 'path';

const UPLOAD_DIR = join(process.cwd(), 'public', 'uploads');

export class FileSystemStorageProvider implements IStorageProvider {
  async upload(key: string, data: Buffer): Promise<string> {
    const filePath = join(UPLOAD_DIR, key);
    await writeFile(filePath, data);
    return `/uploads/${key}`;
  }

  async download(key: string): Promise<Buffer | null> {
    try {
      const filePath = join(UPLOAD_DIR, key);
      return await readFile(filePath);
    } catch {
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    const filePath = join(UPLOAD_DIR, key);
    await unlink(filePath);
  }

  getUrl(key: string): string {
    return `/uploads/${key}`;
  }
}
