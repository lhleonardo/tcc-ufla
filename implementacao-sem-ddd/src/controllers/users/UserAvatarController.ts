import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import AvatarService from '@services/avatar.service';
import AppError from '@errors/AppError';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    if (!request.file) {
      throw new AppError("Invalid uploaded file")
    }
    const { filename } = request.file;

    const updateAvatarService = container.resolve(AvatarService);

    const updatedUser = await updateAvatarService.updateAvatar({
      userId,
      avatarFilename: filename,
    });

    return response.json(classToClass(updatedUser));
  }
}
