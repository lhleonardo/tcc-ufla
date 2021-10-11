import ListProviderMonthAvailabilityService from '@services/ListProviderMonthAvailabilityService';
import ProviderService from '@services/provider.service';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { year, month } = request.query;

    const service = container.resolve(ProviderService);

    const availability = await service.findByMonthAvailability({
      providerId,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
