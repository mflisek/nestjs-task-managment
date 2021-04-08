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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
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
  async getTasks(
    @Query(ValidationPipe) filterDto: GetTaskFilterDto,
    @GetUser() user: User,
  ) {
    return this.taskservis.getTask(filterDto, user);
  }
  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.taskservis.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  async creatTask(
    @Body() creatTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskservis.createTask(creatTaskDto, user);
  }

  @Delete('/:id')
  deleteTaskByid(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
  ): Promise<void> {
    return this.taskservis.deleteTaskById(id, user);
  }

  @Patch('/:id/status')
  async updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @GetUser() user: User,
  ): Promise<Task> {
    return await this.taskservis.UpdateTaskStatus(id, status, user);
  }
}
