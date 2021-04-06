import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

  getTask(filterDto: GetTaskFilterDto) {
    return this.taskRepository.getTasks(filterDto);
  }

  async getTaskById(id: number): Promise<Task> {
    const found = await this.taskRepository.findOne(id);
    if (!found) {
      throw new NotFoundException(`Task witth ID "${id}" not found`);
    }
    return found;
  }

  async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskRepository.createTask(creatTaskDto);
  }

  async deleteTaskById(id: number): Promise<void> {
    const rowsdeleted = await this.taskRepository.delete(id);
    console.log(rowsdeleted);
    if (rowsdeleted.affected === 0) {
      throw new NotFoundException(`Task to delte witth ID "${id}" not found`);
    }
  }

  async UpdateTaskStatus(id: number, status: TaskStatus): Promise<Task> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
