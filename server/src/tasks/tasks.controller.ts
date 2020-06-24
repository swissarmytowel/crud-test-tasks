import {
  Controller,
  Get,
  Post,
  Delete,
  Put,
  UsePipes,
  Req,
  Param,
  Body,
  NotFoundException
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskRecord } from './taskrecord.dto';
import { createTaskSchema } from './tasks.schema';
import { TaskValidationPipe } from './validation.pipe';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async getAllTasks(
    @Req() req: Request
  ): Promise<firebase.firestore.DocumentData[]> {
    return await this.tasksService.getAllTasksFromDb();
  }

  @Get(':id')
  getTaskByID(@Param() params): firebase.firestore.DocumentData {
    return this.tasksService.getTaskFromDbByID(params.id);
  }

  @Post()
  @UsePipes(new TaskValidationPipe(createTaskSchema))
  createNewTask(@Body() taskRecord: TaskRecord) {
    this.tasksService.createTask(taskRecord);
  }

  @Delete(':id')
  removeTaskById(@Param('id') id: string) {
    this.tasksService.removeTaskByID(id);
  }
}
