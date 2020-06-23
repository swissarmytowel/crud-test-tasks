import {
    Controller,
    Get,
    Req,
    Param,
    Post,
    Body,
    NotFoundException
  } from '@nestjs/common';
  import { TasksService } from './tasks.service';
  import { TaskRecord } from './taskrecord.dto';
  
  @Controller('tasks')
  export class TasksController {
    constructor(private readonly appService: TasksService) {}
  
    @Get()
    async getAllTasks(
      @Req() req: Request
    ): Promise<firebase.firestore.DocumentData[]> {
      return await this.appService.getAllTasksFromDb();
    }
  
    @Get(':id')
    getTaskByID(@Param() params): firebase.firestore.DocumentData {
      const record = this.appService.getTaskFromDbByID(params.id);
      if (record != null) return record;
      throw new NotFoundException(); // ASK ABOUT EXCEPTIONS
    }
  
    @Post()
    createNewTask(@Body() taskRecord: TaskRecord) {
      this.appService.createTask(taskRecord);
    }
  }
  