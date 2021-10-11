import { container } from 'tsyringe';
import { Response, Request } from 'express';
import AuthService from '@services/auth.service';

export default class ResetPasswordController {
  public async store(request: Request, response: Response): Promise<Response> {
    const { token, password } = request.body;
    const resetPassword = container.resolve(AuthService);

    await resetPassword.resetPassword({ token, password });

    return response.status(204).json();
  }
}
