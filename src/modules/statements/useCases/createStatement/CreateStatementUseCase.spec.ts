import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {CreateStatementUseCase} from "./CreateStatementUseCase";
import {User} from "../../../users/entities/User";
import {ICreateStatementDTO} from "./ICreateStatementDTO";
import {CreateStatementError} from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let user: User;

describe('Create Statement', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);

    user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });
  });

  it('should be able to make a deposit', async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit',
      amount: 100.00,
      description: 'First deposit'
    } as ICreateStatementDTO);

    expect(statement).toHaveProperty('id');
  });

  it('should not be able to make a deposit to a nonexistent user', async () => {
    expect.assertions(1);

    try {
      await createStatementUseCase.execute({
        user_id: 'XXXXXXXXXXXXXXXXXXXXXX',
        type: 'deposit',
        amount: 100.00,
        description: 'First deposit'
      } as ICreateStatementDTO);
    } catch (e) {
      expect(e).toBeInstanceOf(CreateStatementError.UserNotFound);
    }
  });

  it('should not be able to make a withdraw without enough funds', async () => {
    expect.assertions(1);

    try {
      await createStatementUseCase.execute({
        user_id: user.id,
        type: 'withdraw',
        amount: 200.00,
        description: 'First withdraw'
      } as ICreateStatementDTO);
    } catch (e) {
      expect(e).toBeInstanceOf(CreateStatementError.InsufficientFunds);
    }
  });
});
