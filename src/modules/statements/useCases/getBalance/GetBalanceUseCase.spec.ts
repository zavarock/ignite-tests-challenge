import {ICreateStatementDTO} from "../createStatement/ICreateStatementDTO";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {User} from "../../../users/entities/User";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {CreateStatementError} from "../createStatement/CreateStatementError";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {GetBalanceUseCase} from "./GetBalanceUseCase";
import {GetBalanceError} from "./GetBalanceError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;
let user: User;

describe('Get Balance', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementRepository, inMemoryUsersRepository);
  });

  it('should be able to get an user balance', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit',
      amount: 1_000,
      description: 'First deposit'
    } as ICreateStatementDTO);

    const balance = await getBalanceUseCase.execute({
      user_id: statement.user_id
    });

    expect(balance).toHaveProperty('balance');
  });

  it('should not be able to get a balance from a nonexistent user', async () => {
    expect.assertions(1);

    try {
      await getBalanceUseCase.execute({
        user_id: 'XXXXXXXXXXXXXXXXXXXXXX',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(GetBalanceError);
    }
  });
});
