import {CreateUserUseCase} from "./CreateUserUseCase";
import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserError} from "./CreateUserError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create User', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('should be able to create a user', async () => {
    const result = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });

    expect(result).toHaveProperty('id');
  });

  it('should not be able to create an existent user', async () => {
    expect.assertions(1);

    try {
      await createUserUseCase.execute({
        name: 'John Doe',
        email: 'johndoe@localhost',
        password: '123123',
      });
    } catch (e) {
      expect(e).toBeInstanceOf(CreateUserError);
    }
  });
});
