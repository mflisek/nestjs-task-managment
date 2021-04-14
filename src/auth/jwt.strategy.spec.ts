import { UnauthorizedException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';

const mockUserRepository = () => ({
  findOne: jest.fn(),
});

describe(`JwtStrategy`, () => {
  let jwtStrategy: JwtStrategy;
  let userRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JwtStrategy,
        { provide: UserRepository, useFactory: mockUserRepository },
      ],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
    jwtStrategy = await module.get<JwtStrategy>(JwtStrategy);
  });

  describe(`validate`, () => {
    it(`it  use jwt playload to call userRepon.findeOne from database and rerutrn user`, async () => {
      expect(userRepository.findOne).not.toHaveBeenCalled();
      const user = new User();
      user.username = 'TestUser';
      userRepository.findOne.mockResolvedValue(user);
      const result = await jwtStrategy.validate({ username: user.username });
      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        username: user.username,
      });
    });

    it(`it  use jwt playload to call userRepon.findeOne  and not finde user throw UnauthorizedException`, async () => {
      const user = new User();
      user.username = 'TestUser';
      userRepository.findOne.mockResolvedValue(null);
      expect(jwtStrategy.validate({ username: user.username })).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });
});
