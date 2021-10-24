import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';
import AppError from "@shared/errors/AppError"

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    if (!request.file) {
      throw new AppError("Invalid uploaded file")
    }

    const { filename } = request.file;

    const updateAvatarService = container.resolve(UpdateUserAvatarService);

    const updatedUser = await updateAvatarService.execute({
      userId,
      avatarFilename: filename,
    });

    return response.json(classToClass(updatedUser));
  }
}
