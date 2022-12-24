import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {AuthenticateUserUseCase} from "./AuthenticateUserUseCase";
import {IncorrectEmailOrPasswordError} from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate User', () => {
  beforeAll(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);

    await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });
  });

  it('should be able to authenticate a valid user', async () => {
    const authenticate = await authenticateUserUseCase.execute({
      email: 'johndoe@localhost',
      password: '123123'
    });

    expect(authenticate).toHaveProperty('token');
  });

  it('should not be able to authenticate an user using an incorrect email', async () => {
    expect.assertions(1);

    try {
      await authenticateUserUseCase.execute({
        email: 'hello@world',
        password: '123123',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(IncorrectEmailOrPasswordError);
    }
  });

  it('should not be able to authenticate an user using an incorrect password', async () => {
    expect.assertions(1);

    try {
      await authenticateUserUseCase.execute({
        email: 'johndoe@localhost',
        password: '999999',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(IncorrectEmailOrPasswordError);
    }
  });
});
