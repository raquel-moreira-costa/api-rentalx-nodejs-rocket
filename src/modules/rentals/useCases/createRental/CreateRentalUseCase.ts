import { inject, injectable } from 'tsyringe';

import { IDateProvider } from '../../../../shared/container/providers/DateProvider/IDateProvider';
import { AppError } from '../../../../shared/errors/AppError';
import { ICarsRepository } from '../../../cars/repositories/ICarsRepository';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalsRepository } from '../../repositories/IRentalsRepository';

interface IRequest{
  car_id: string;
  user_id: string;
  expect_end_date: Date;
}

@injectable()
class CreateRentalUseCase {
  constructor(
    @inject('RentalsRepository')
    private rentalsRepository: IRentalsRepository,
    @inject('DayjsDateProvider')
    private dateProvider: IDateProvider,
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
  ) { }
  async execute({ car_id, user_id, expect_end_date }: IRequest): Promise<Rental> {
    const minimumHour = 24;
    const carUnavailable = await this.rentalsRepository.findOpenRentalByCar(car_id);
    if (carUnavailable) {
      throw new AppError('Car is unavailable');
    }

    const rentalOpenToUser = await this.rentalsRepository.findOpenRentalByUser(user_id);
    if (rentalOpenToUser) {
      throw new AppError("There's a rental in progress for user");
    }
    const dateNow = this.dateProvider.dateNow();
    const compare = this.dateProvider.compareInHours(expect_end_date, dateNow);
    if (compare < minimumHour) {
      throw new AppError('Invalid return time');
    }
    const rental = await this.rentalsRepository.create({
      car_id,
      user_id,
      expect_end_date,
    });
    await this.carsRepository.updateAvailable(car_id, false);
    return rental;
  }
}

export { CreateRentalUseCase };
