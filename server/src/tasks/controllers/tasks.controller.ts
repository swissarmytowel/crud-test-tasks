import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  UsePipes,
  Req,
  Param,
  Body
} from '@nestjs/common';
import { TasksService } from '../services/tasks.service';
import { TaskRecord } from '../taskrecord.dto';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schemas';
import { TaskValidationPipe } from '../validators/task.validation.pipe';

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
  getTask(@Param() params): firebase.firestore.DocumentData {
    return this.tasksService.getTaskFromDbByID(params.id);
  }

  @Post()
  @UsePipes(new TaskValidationPipe(createTaskSchema))
  createNewTask(@Body() taskRecord: TaskRecord) {
    this.tasksService.createTask(taskRecord);
  }

  @Delete(':id')
  removeTask(@Param('id') id: string) {
    this.tasksService.removeTaskByID(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body(new TaskValidationPipe(updateTaskSchema)) taskRecord: TaskRecord
  ) {
    this.tasksService.updateTaskById(id, taskRecord);
  }
}
