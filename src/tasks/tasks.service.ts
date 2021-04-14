import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/user.entity';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TaskRepository } from './task.repository';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository,
  ) {}

  getTasks(filterDto: GetTaskFilterDto, user: User) {
    return this.taskRepository.getTasks(filterDto, user);
  }

  async getTaskById(id: number, user: User): Promise<Task> {
    const found = await this.taskRepository.findOne({
      where: { id, userId: user.id },
    });
    if (!found) {
      throw new NotFoundException(`Task witth ID "${id}" not found`);
    }
    return found;
  }

  async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
    return await this.taskRepository.createTask(creatTaskDto, user);
  }

  async deleteTaskById(id: number, user: User): Promise<void> {
    const rowsdeleted = await this.taskRepository.delete({
      id,
      userId: user.id,
    });
    console.log(rowsdeleted);
    if (rowsdeleted.affected === 0) {
      throw new NotFoundException(`Task to delte witth ID "${id}" not found`);
    }
  }

  async UpdateTaskStatus(
    id: number,
    status: TaskStatus,
    user: User,
  ): Promise<Task> {
    const task = await this.getTaskById(id, user);
    task.status = status;
    await task.save();
    return task;
  }
}
