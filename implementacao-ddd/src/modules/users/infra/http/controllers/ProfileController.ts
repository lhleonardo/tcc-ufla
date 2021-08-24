import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { classToClass } from 'class-transformer';
import ShowUserService from '@modules/users/services/ShowUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';

export default class ProfileController {
  async show(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const service = container.resolve(ShowUserService);

    const user = await service.execute(userId);

    return response.status(200).json(classToClass(user));
  }

  async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { name, email, password, oldPassword } = request.body;

    const service = container.resolve(UpdateUserService);

    const result = await service.execute(userId, {
      name,
      email,
      password,
      oldPassword,
    });

    return response.status(200).json(classToClass(result));
  }
}
