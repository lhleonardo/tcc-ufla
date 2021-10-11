import { container } from 'tsyringe';
import { Response, Request } from 'express';
import AuthService from '@services/auth.service';

export default class SessionsController {
  public async generate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(AuthService);

    const { user, token } = await service.login({ email, password });

    return response.json({ user, token });
  }
}
