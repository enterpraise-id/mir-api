import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import User from "App/Models/User";
import LoginValidator from "App/Validators/LoginValidator";
import RegisterValidator from "App/Validators/RegisterValidator";

export default class AuthController {
  public async register({ request }: HttpContextContract) {
    const payload = await request.validate(RegisterValidator);

    const user = await User.create(payload);

    return user;
  }

  public async login({ request, auth }: HttpContextContract) {
    const payload = await request.validate(LoginValidator);

    return auth.attempt(payload.email, payload.password)
  }
}
