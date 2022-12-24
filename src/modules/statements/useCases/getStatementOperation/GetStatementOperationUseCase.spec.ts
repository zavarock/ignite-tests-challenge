import {ICreateStatementDTO} from "../createStatement/ICreateStatementDTO";
import {InMemoryStatementsRepository} from "../../repositories/in-memory/InMemoryStatementsRepository";
import {User} from "../../../users/entities/User";
import {CreateStatementUseCase} from "../createStatement/CreateStatementUseCase";
import {CreateUserUseCase} from "../../../users/useCases/createUser/CreateUserUseCase";
import {InMemoryUsersRepository} from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import {GetStatementOperationUseCase} from "./GetStatementOperationUseCase";
import {GetStatementOperationError} from "./GetStatementOperationError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let user: User;

describe('Get Statement Operation', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementRepository);

    user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });
  });

  it('should be able to get a statement operation', async () => {
    const statement = await createStatementUseCase.execute({
      user_id: user.id,
      type: 'deposit',
      amount: 1_000,
      description: 'First deposit'
    } as ICreateStatementDTO);

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string
    });

    expect(statementOperation).toHaveProperty('id');
  });

  it('should not be able to get a statement operation from a nonexistent user', async () => {
    expect.assertions(1);

    try {
      await getStatementOperationUseCase.execute({
        user_id: 'XXXXXXXXXXXXXXXXXXXXXX',
        statement_id: 'XXXXXXXXXXXXXXXXXXXXXX'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(GetStatementOperationError.UserNotFound);
    }
  });

  it('should not be able to get a nonexistent statement operation', async () => {
    expect.assertions(1);

    try {
      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: 'XXXXXXXXXXXXXXXXXXXXXX'
      });
    } catch (e) {
      expect(e).toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    }
  });
});
