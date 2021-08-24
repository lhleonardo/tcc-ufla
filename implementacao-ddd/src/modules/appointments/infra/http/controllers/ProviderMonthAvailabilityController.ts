import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

class ProviderMonthAvailabilityController {
  public async index(request: Request, response: Response): Promise<Response> {
    const { providerId } = request.params;
    const { year, month } = request.query;

    const service = container.resolve(ListProviderMonthAvailabilityService);

    const availability = await service.execute({
      providerId,
      month: Number(month),
      year: Number(year),
    });

    return response.json(availability);
  }
}

export default ProviderMonthAvailabilityController;
