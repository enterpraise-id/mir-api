import sharp from 'sharp'
import { resolve } from 'path'
import fs from 'fs'

export default class ImageHelper {
  public static async move(path: string, data: string) {
    const buffer = Buffer.from(data, 'base64');

    await sharp(buffer)
      .webp({
        quality: 80
      })
      .toFile(path)
  }

  public static async delete(path: string) {
    const uploadPath = resolve(__dirname, '../../upload/', path);
    if (fs.existsSync(uploadPath)) {
      fs.rmSync(uploadPath)
    }
  }
}