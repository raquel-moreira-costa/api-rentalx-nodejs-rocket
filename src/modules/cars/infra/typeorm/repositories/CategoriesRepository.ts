import { getRepository, Repository } from 'typeorm';

import { ICategoriesRepository } from '../../../repositories/ICategoriesRepository';
import { Category } from '../entities/Category';

interface ICreateCategoryDTO{
  name: string;
  description: string;
}

// Singleton
class CategoriesRepository implements ICategoriesRepository {
  private repository: Repository<Category>;
  // eslint-disable-next-line no-use-before-define
  private static INSTANCE: CategoriesRepository;

  constructor() {
    this.repository = getRepository(Category);
  }

  // public static getInstance() : CategoriesRepository {
  //   if (!CategoriesRepository.INSTANCE) {
  //     CategoriesRepository.INSTANCE = new CategoriesRepository();
  //   }
  //   return CategoriesRepository.INSTANCE;
  // }

  async create({ description, name }: ICreateCategoryDTO): Promise<void> {
    const category = this.repository.create({
      name,
      description,
    });

    await this.repository.save(category);
  }

  async list(): Promise<Category[]> {
    const categories = await this.repository.find();
    return categories;
  }

  async findByName(name: string): Promise<Category> {
    const category = await this.repository.findOne({ name });
    return category;
  }
}

export { CategoriesRepository, ICreateCategoryDTO };
