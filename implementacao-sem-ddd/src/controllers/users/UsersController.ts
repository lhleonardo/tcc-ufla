import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';
import UserService from '@services/user.service';

export default class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;
    const service = container.resolve(UserService);
    const user = await service.createUser({ name, email, password });

    return response.json(classToClass(user));
  }
}
