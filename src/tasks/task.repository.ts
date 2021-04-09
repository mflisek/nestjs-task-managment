import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { User } from 'src/auth/user.entity';
import { InternalServerErrorException, Logger } from '@nestjs/common';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  private logger = new Logger('TaskRepository');

  async createTask(creatTaskDto: CreateTaskDto, user: User): Promise<Task> {
    const { title, descrypion } = creatTaskDto;
    const task = new Task();

    task.title = title;
    task.descrypion = descrypion;
    task.status = TaskStatus.OPEN;
    task.user = user;
    try {
      await task.save();
    } catch (error) {
      this.logger.error(
        `Failed to creat a tasl for iser ${user.username}. Data $${creatTaskDto}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    delete task.user;
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto, user: User): Promise<Task[]> {
    console.log(filterDto);
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    query.where('task.userId =:userid', { userid: user.id });

    if (status) {
      query.andWhere('task.status =:status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title like :search Or task.descrypion like :search)',
        { search: `%${search}%` },
      );
    }
    try {
      const task = await query.getMany();
      return task;
    } catch (error) {
      this.logger.error(
        `Failed to get tasks for user "${user.username},DTO:${JSON.stringify(
          filterDto,
        )}`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }
  }
}
