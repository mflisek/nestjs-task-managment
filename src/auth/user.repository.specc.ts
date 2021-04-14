import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcrypt';

const mockCredentialsDto = {
  username: 'TestUsername',
  password: 'TestPassword',
};

describe(`UserRepository`, () => {
  let userRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();

    userRepository = await module.get<UserRepository>(UserRepository);
  });

  describe(`signUp`, () => {
    let save;

    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });

    it(`successfully signUp the user`, () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDto)).resolves.not.toThrow();
    });

    it(`signUp faile user exist`, () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it(`signUp fallil interna serwer error`, () => {
      save.mockRejectedValue({ code: '1313' });
      expect(userRepository.signUp(mockCredentialsDto)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe(`validateUserPassword`, () => {
    let user;

    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = mockCredentialsDto.username;
      user.validatePassword = jest.fn();
    });

    it(`User password validateSuccesfull`, async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(result).toEqual(mockCredentialsDto.username);
      expect(
        userRepository.validateUserPassword(mockCredentialsDto),
      ).resolves.not.toThrow();
    });

    it(`User found wronf passwaord  succefull faild`, async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(user.validatePassword).toHaveBeenCalled();

      expect(result).toBeNull();
    });

    it(`User not found succefull faild`, async () => {
      userRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.validateUserPassword(
        mockCredentialsDto,
      );
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    describe(`hashPassword`, () => {
      it(`calls bcrypt.hash to genreate a hash`, async () => {
        bcrypt.hash = jest.fn().mockResolvedValue('testhasha');
        expect(bcrypt.hash).not.toHaveBeenCalled();
        const result = await userRepository.hashPassword(
          'testPassword',
          'testSalt',
        );
        expect(bcrypt.hash).toHaveBeenCalled();
        expect(result).toEqual('testhasha');
      });
    });
  });
});
