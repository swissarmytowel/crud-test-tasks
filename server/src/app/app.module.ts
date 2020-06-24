import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TasksService } from '../tasks/services/tasks.service';
import { TasksController } from '../tasks/controllers/tasks.controller';

@Module({
  imports: [],
  controllers: [AppController, TasksController],
  providers: [AppService, TasksService]
})
export class AppModule {}
