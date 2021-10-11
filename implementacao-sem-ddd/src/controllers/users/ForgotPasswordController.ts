import AuthService from '@services/auth.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPassword = container.resolve(AuthService);

    await sendForgotPassword.forgotPassword({ email });

    return response.status(204).json();
  }
}
