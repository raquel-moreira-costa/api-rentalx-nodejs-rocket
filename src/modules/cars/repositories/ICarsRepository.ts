import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IRequestDTO } from '../dtos/IRequestDTO';
import { Car } from '../infra/typeorm/entities/Car';

interface ICarsRepository {
  create(data: ICreateCarDTO): Promise<Car>;
  findByLicensePlace(license_plate: string): Promise<Car>;
  findAvaliable({ brand, category_id, name }: IRequestDTO): Promise<Car[]>;
  findById(id: string): Promise<Car>;
}

export { ICarsRepository };