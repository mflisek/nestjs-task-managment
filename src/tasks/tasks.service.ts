import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v1 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTaskFilterDto): Task[] {
    const { status, search } = filterDto;
    let mytasks = this.getAllTasks();

    if (status) {
      mytasks = mytasks.filter((task) => task.status === status);
    }

    if (search) {
      mytasks = mytasks.filter(
        (task) =>
          task.title.includes(search) || task.descrypion.includes(search),
      );
    }

    return mytasks;
  }

  getTaskById(id: string): Task {
    const tasksfound = this.tasks.find((task) => task.id === id);

    if (!tasksfound) {
      throw new NotFoundException(`Task witth ID "${id}" not found`);
    }
    return tasksfound;
  }

  createTask(creatTaskDto: CreateTaskDto): Task {
    const { title, descrypion } = creatTaskDto;
    const task: Task = {
      title,
      descrypion,
      status: TaskStatus.OPEN,
      id: uuid(),
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string) {
    const tasktodelete = this.getTaskById(id);
    if (!tasktodelete) throw new Error('Task no found');
    delete this.tasks[this.tasks.indexOf(tasktodelete)];
  }

  UpdateTaskStatus(id: string, status: TaskStatus): Task {
    console.log(id);
    const task = this.getTaskById(id);
    if (!task) throw new Error('Task no found');
    task.status = status;
    return task;
  }
}
