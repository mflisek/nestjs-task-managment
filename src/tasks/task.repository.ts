import { Task } from './task.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { TaskStatus } from './task-status.enum';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';

@EntityRepository(Task)
export class TaskRepository extends Repository<Task> {
  async createTask(creatTaskDto: CreateTaskDto): Promise<Task> {
    const { title, descrypion } = creatTaskDto;
    const task = new Task();

    task.title = title;
    task.descrypion = descrypion;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }

  async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
    console.log(filterDto);
    const { status, search } = filterDto;

    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status =:status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title like :search Or task.descrypion like :search)',
        { search: `%${search}%` },
      );
    }
    const task = await query.getMany();
    return task;
  }
}
