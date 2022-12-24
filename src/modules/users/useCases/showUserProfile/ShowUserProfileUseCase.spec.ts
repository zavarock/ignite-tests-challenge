import {InMemoryUsersRepository} from "../../repositories/in-memory/InMemoryUsersRepository";
import {CreateUserUseCase} from "../createUser/CreateUserUseCase";
import {ShowUserProfileUseCase} from "./ShowUserProfileUseCase";
import {ShowUserProfileError} from "./ShowUserProfileError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe('Show User Profile', () => {
  beforeAll(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it('should be able to show a valid user profile', async () => {
    const user = await createUserUseCase.execute({
      name: 'John Doe',
      email: 'johndoe@localhost',
      password: '123123',
    });

    const profile = await showUserProfileUseCase.execute(user.id as string);

    expect(profile).toHaveProperty('id');
  });

  it('should not be able to show an nonexistent user profile', async () => {
    expect.assertions(1);

    try {
      await showUserProfileUseCase.execute('XXXXXXXXXXXXXXXXXXXXX');
    } catch (e) {
      expect(e).toBeInstanceOf(ShowUserProfileError);
    }
  });
});
