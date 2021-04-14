import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasl.dto';
const mockUser = { username: 'Test user', id: 1 };
const mockTask = { title: 'test task', description: 'test desc' };

const mockTaskRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
  createTask: jest.fn(),
  delete: jest.fn(),
});

describe('TasksService', () => {
  let tasksService;
  let taskRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TaskRepository, useFactory: mockTaskRepository },
      ],
    }).compile();

    tasksService = await module.get<TasksService>(TasksService);
    taskRepository = await module.get<TaskRepository>(TaskRepository);
  });

  describe('getTasks', () => {
    it('gets all tasks from the repository', async () => {
      taskRepository.getTasks.mockResolvedValue('someValue');

      expect(taskRepository.getTasks).not.toHaveBeenCalled();
      const filters: GetTaskFilterDto = {
        status: TaskStatus.IN_PROGRESS,
        search: 'Some search query',
      };
      const result = await tasksService.getTasks(filters, mockUser);
      expect(taskRepository.getTasks).toHaveBeenCalled();
      expect(result).toEqual('someValue');
    });
  });

  describe('getTaskById', () => {
    it('it call taskrepo.findOne() and succesfufuly retirive and return task', async () => {
      taskRepository.findOne.mockResolvedValue(mockTask);

      const result = await tasksService.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);

      expect(taskRepository.findOne).toHaveBeenCalledWith({
        where: {
          id: 1,
          userId: mockUser.id,
        },
      });
    });

    it('throw an error as tasks is not foundL', () => {
      taskRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`createTask `, () => {
    it(`it call taskRepo and add user to database`, async () => {
      const mockcreateTaskDto: CreateTaskDto = {
        title: 'Some title',
        descrypion: 'Some descprtion',
      };

      expect(taskRepository.createTask).not.toHaveBeenCalled();

      taskRepository.createTask.mockResolvedValue(mockcreateTaskDto, mockUser);

      const result = await tasksService.createTask(mockcreateTaskDto, mockUser);

      expect(taskRepository.createTask).toHaveBeenCalledWith(
        mockcreateTaskDto,
        mockUser,
      );

      expect(result).toEqual(mockcreateTaskDto);
    });
  });

  describe(`deleteTaskById`, () => {
    it(`it call teskRepo and delete user in databse`, async () => {
      expect(taskRepository.delete).not.toHaveBeenCalled();

      taskRepository.delete.mockResolvedValue({ affected: 1 });

      await tasksService.deleteTaskById(1, mockUser);

      expect(taskRepository.delete).toHaveBeenCalledWith({
        id: 1,
        userId: mockUser.id,
      });
    });

    it(`It call taskPepo and trhow NotFoundException`, async () => {
      taskRepository.delete.mockResolvedValue({ affected: 0 });

      expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe(`UpdateTaskStatus`, () => {
    it(`It call taskRepoa and update status oft he taska`, async () => {
      const save = jest.fn().mockResolvedValue(true);

      tasksService.getTaskById = jest.fn().mockResolvedValue({
        status: TaskStatus.IN_PROGRESS,
        save,
      });

      expect(tasksService.getTaskById).not.toHaveBeenCalled();

      const result = await tasksService.UpdateTaskStatus(
        1,
        TaskStatus.IN_PROGRESS,
        mockUser,
      );
      expect(save).toHaveBeenCalled();

      expect(tasksService.getTaskById).toHaveBeenCalled();

      expect(save).toHaveBeenCalled();
      expect(result.status).toEqual(TaskStatus.IN_PROGRESS);
    });
  });
});
