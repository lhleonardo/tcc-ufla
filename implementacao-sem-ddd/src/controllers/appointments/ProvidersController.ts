import ListProviderServices from '@services/ListProvidersService';
import ProviderService from '@services/provider.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProvidersController {
  async index(request: Request, response: Response): Promise<Response> {
    const userId = request.user.id;

    const service = container.resolve(ProviderService);

    const providers = await service.getProviders({ excludeUserId: userId });

    return response.status(200).json(providers);
  }
}

export default ProvidersController;
