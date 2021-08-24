import SendForgotPasswordEmailService from '@modules/users/services/SendForgotPasswordEmailService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

export default class ForgotPasswordController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { email } = request.body;

    const sendForgotPassword = container.resolve(
      SendForgotPasswordEmailService,
    );

    await sendForgotPassword.execute({ email });

    return response.status(204).json();
  }
}
