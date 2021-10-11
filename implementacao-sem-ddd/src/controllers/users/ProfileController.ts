import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';
import UserService from '@services/user.service';

export default class ProfileController {
  async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const service = container.resolve(UserService);

    const user = await service.get(userId);

    return response.status(200).json(classToClass(user));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;

    const service = container.resolve(UserService);

    const result = await service.update(userId, {
      name,
      email,
      password,
      oldPassword,
    });

    return response.status(200).json(classToClass(result));
  }
}
