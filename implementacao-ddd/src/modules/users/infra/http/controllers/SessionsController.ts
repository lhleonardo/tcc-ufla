import { container } from 'tsyringe';
import { Response, Request } from 'express';
import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

export default class SessionsController {
  public async generate(
    request: Request,
    response: Response,
  ): Promise<Response> {
    const { email, password } = request.body;

    const service = container.resolve(AuthenticateUserService);

    const { user, token } = await service.execute({ email, password });

    return response.json({ user, token });
  }
}
