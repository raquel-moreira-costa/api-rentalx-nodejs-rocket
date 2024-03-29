import { jest } from '@jest/globals';

import { DayjsDateProvider } from '../../../../shared/container/providers/DateProvider/implementations/DaysjsDateProvider';
import { MailProviderInMemory } from '../../../../shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import { AppError } from '../../../../shared/errors/AppError';
import { UsersRepositoryInMemory } from '../../repositories/in-memory/UsersRepositoryInMemory';
import { UsersTokenRepositoryInMemory } from '../../repositories/in-memory/UsersTokenRepositoryInMemory';
import { SendForgotPasswordEmailUseCase } from './SendForgotPasswordMailUseCase';

let sendForgotPasswordEmailUseCase: SendForgotPasswordEmailUseCase;
let usersRepositoryInMemory: UsersRepositoryInMemory;
let usersTokenRepositoryInMemory: UsersTokenRepositoryInMemory;
let dayJsProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;

describe('Send Forgot Mail', () => {
  beforeEach(() => {
    usersRepositoryInMemory = new UsersRepositoryInMemory();
    usersTokenRepositoryInMemory = new UsersTokenRepositoryInMemory();
    dayJsProvider = new DayjsDateProvider();
    mailProviderInMemory = new MailProviderInMemory();
    sendForgotPasswordEmailUseCase = new SendForgotPasswordEmailUseCase(
      usersRepositoryInMemory,
      usersTokenRepositoryInMemory,
      dayJsProvider,
      mailProviderInMemory,
    );
  });
  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = jest.spyOn(mailProviderInMemory, 'sendMail');
    await usersRepositoryInMemory.create({
      driver_license: '349596',
      name: 'Bertie Sanchez',
      email: 'isgumnel@pamubke.bb',
      password: 'r9uvgD3K',
    });
    await sendForgotPasswordEmailUseCase.execute('isgumnel@pamubke.bb');
    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send email if user does not exists', async () => {
    await expect(sendForgotPasswordEmailUseCase.execute('topocin@segipse.bj')).rejects.toEqual(new AppError('Users does not exists!'));
  });

  it('should be able to create an users token', async () => {
    const generateTokenMail = jest.spyOn(usersTokenRepositoryInMemory, 'create');
    await usersRepositoryInMemory.create({
      driver_license: '349596',
      name: 'Bertie Sanchez',
      email: 'isgumnel@pamubke.bb',
      password: 'r9uvgD3K',
    });
    await sendForgotPasswordEmailUseCase.execute('isgumnel@pamubke.bb');
    expect(generateTokenMail).toHaveBeenCalled();
  });
});
