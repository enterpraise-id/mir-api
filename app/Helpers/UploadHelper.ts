import { resolve } from 'path'
import fs from 'fs'

export default class UploadHelper {
    public static generateFileName(ext: string) {
        return Date.now() + '.' + ext
    }

    public static parseBase64(base64: string) {
        const data = base64.split(';base64,')
        const fileType = data[0].split('/')
        return {
            type: fileType[0].split(':')[1],
            ext: fileType[1],
            data: data[1]
        }
    }

    public static generatePath(path: string, filename: string) {
        const uploadPath = resolve(__dirname, '../../upload', path);

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true })
        }

        return uploadPath + '/' + filename
    }
}