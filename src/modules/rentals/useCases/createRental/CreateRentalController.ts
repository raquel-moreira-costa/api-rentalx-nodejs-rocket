import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from './CreateRentalUseCase';

class CreateRentalController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { car_id, expect_end_date } = req.body;
    const { id } = req.user;
    const createRentalUseCase = container.resolve(CreateRentalUseCase);
    const rental = await createRentalUseCase.execute({
      car_id,
      expect_end_date,
      user_id: id,
    });
    return res.status(201).json(rental);
  }
}

export { CreateRentalController };
