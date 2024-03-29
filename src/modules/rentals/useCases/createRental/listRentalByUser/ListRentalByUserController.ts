import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalByUserUseCase } from './ListRentalByUserUseCase';

class ListRentalByUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: user_id } = req.user;
    const listRentalByUserUseCase = container.resolve(ListRentalByUserUseCase);
    const rentals = await listRentalByUserUseCase.execute({ user_id });
    return res.status(200).json(rentals);
  }
}

export { ListRentalByUserController };
