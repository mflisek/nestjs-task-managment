import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateTaskDto } from './dto/create-tasl.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private taskservis: TasksService) {}

  @Get()
  async getTasks(@Query(ValidationPipe) filterDto: GetTaskFilterDto) {
    return this.taskservis.getTask(filterDto);
  }
  @Get('/:id')
  getTaslById(@Param('id', ParseIntPipe) id: number): Promise<Task> {
    return this.taskservis.getTaskById(id);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async creatTask(@Body() creatTaskDto: CreateTaskDto): Promise<Task> {
    return await this.taskservis.createTask(creatTaskDto);
  }

  @Delete('/:id')
  deleteTaskByid(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskservis.deleteTaskById(id);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
  ): Promise<Task> {
    return await this.taskservis.UpdateTaskStatus(id, status);
  }
}
