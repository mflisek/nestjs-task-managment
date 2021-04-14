import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

describe(`User entity`, () => {
  let user: User;

  beforeEach(async () => {
    user = new User();
    user.password = 'testpasword';
    user.salt = 'salta';
    bcrypt.hash = jest.fn();
  });

  it(`return true when password is valid`, async () => {
    bcrypt.hash.mockResolvedValue(user.password);
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword(user.password);
    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, user.salt);
    expect(result).toEqual(true);
  });

  it(`return false when password is invalid`, async () => {
    bcrypt.hash.mockResolvedValue('bad passaword');
    expect(bcrypt.hash).not.toHaveBeenCalled();
    const result = await user.validatePassword('bad passaword');
    expect(bcrypt.hash).toHaveBeenCalledWith('bad passaword', user.salt);
    expect(result).toEqual(false);
  });
});
