import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { AppError } from '../../../../errors/AppError';
import { IUsersRepository } from '../../repositories/IUsersRepository';

interface IRequest{
  email: string;
  password: string;
}

interface IResponse{
  user: {
    name: string;
    email: string;
  }
  token: string;
}

@injectable()
class AutheticateUserUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) { }

  async execute({ password, email }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw new AppError('Email or password incorrect.');
    }

    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new AppError('Email or password incorrect.');
    }
    const token = sign({}, '52a9008cb2dd017cb33ddc6e4ad9d1e0', { subject: user.id, expiresIn: '1d' });

    const tokenReturn = { token, user: { name: user.name, email: user.email } };
    return tokenReturn;
  }
}

export { AutheticateUserUseCase };
