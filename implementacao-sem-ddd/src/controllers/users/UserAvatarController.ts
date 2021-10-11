import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';
import AvatarService from '@services/avatar.service';

export default class UserAvatarController {
  public async update(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;
    const { filename } = request.file;

    const updateAvatarService = container.resolve(AvatarService);

    const updatedUser = await updateAvatarService.updateAvatar({
      userId,
      avatarFilename: filename,
    });

    return response.json(classToClass(updatedUser));
  }
}
