import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import console from 'node:console';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskservis: TasksService) {}

  @Get()
  async getTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]> {
    if (Object.keys(filterDto).length) {
      return await this.taskservis.getTaskWithFilters(filterDto);
    } else {
      return await this.taskservis.getAllTasks();
    }
  }

  @Get('/:id')
  async getTaslById(@Param('id') id: string): Promise<Task> {
    return await this.taskservis.getTaskById(id);
  }

  @Post()
  async creatTask(@Body() creatTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskservis.createTask(creatTaskDto);
  }

  @Delete('/:id')
  deleteTaskByid(@Param('id') id: string) {
    this.taskservis.deleteTaskById(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Promise<Task> {
    return await this.taskservis.UpdateTaskStatus(id, status);
  }
}
