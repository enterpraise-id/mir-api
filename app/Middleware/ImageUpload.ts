import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ImageHelper from "App/Helpers/ImageHelper";
import UploadHelper from "App/Helpers/UploadHelper";

export default class ImageUpload {
  public async handle(
    { request, response }: HttpContextContract,
    next: () => Promise<void>,
    paths: string[]
  ) {
    const [path] = paths;

    if (path && request.input(path)) {
      const image = UploadHelper.parseBase64(request.input(path));
      if (!image) {
        return response.unprocessableEntity('Invalid image format');
      }
      const filename = UploadHelper.generateFileName("webp");
      const filePath = UploadHelper.generatePath("images", filename);
      ImageHelper.move(filePath, image.data);
      request.updateBody({
        ...request.body(),
        [path]: "images/" + filename,
      });
    } else {
      return response.unprocessableEntity(`payload ${path} not found in body`);
    }

    await next();
  }
}