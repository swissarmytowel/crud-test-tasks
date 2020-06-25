import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UsePipes,
  UseFilters,
  Req,
  Param,
  Body
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskRecordDTO } from './taskrecord.dto';
import { createTaskSchema, updateTaskSchema } from './schemas/task.schemas';
import { TaskValidationPipe } from './validators/task.validation.pipe';
import { HttpExceptionFilter } from '../http-exception.filter';
import { Request } from 'express';

type DocumentData = firebase.firestore.DocumentData;

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(@Req() req: Request): Promise<DocumentData[]> {
    return await this.tasksService.getAllTasksFromDb();
  }

  @Get(':id')
  @UseFilters(HttpExceptionFilter)
  async getTask(@Param('id') id: string): Promise<DocumentData> {
    return await this.tasksService.getTaskFromDbByID(id);
  }

  @Post()
  @UsePipes(new TaskValidationPipe(createTaskSchema))
  @UseFilters(HttpExceptionFilter)
  async createNewTask(@Body() taskRecord: TaskRecordDTO) {
    this.tasksService.createTask(taskRecord);
  }

  @Delete(':id')
  @UseFilters(HttpExceptionFilter)
  async removeTask(@Param('id') id: string) {
    this.tasksService.removeTaskByID(id);
  }

  @Patch(':id')
  @UseFilters(HttpExceptionFilter)
  async updateTask(
    @Param('id') id: string,
    @Body(new TaskValidationPipe(updateTaskSchema)) taskRecord: TaskRecordDTO
  ) {
    this.tasksService.updateTaskById(id, taskRecord);
  }
}
