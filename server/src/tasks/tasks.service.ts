import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase';
import * as dbConfig from './database.config.json';
import { TaskRecord } from './taskrecord.dto';

@Injectable()
export class TasksService {
  private readonly _db: firebase.firestore.Firestore;

  public constructor() {
    // Init firebase cloud storage
    const firebaseApp = firebase.initializeApp(dbConfig.FIREBASE_AUTH_CONFIG);
    this._db = firebase.firestore();
  }

  // Return all tasks from the cloud storage
  async getAllTasksFromDb(): Promise<firebase.firestore.DocumentData[]> {
    return await this._db
      .collection('tasks')
      .orderBy('date')
      .limit(100) //TODO: get rid of results limit (?)
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          const record = doc.data();
          record['date'] = record['date'].toDate().toISOString();
          return record;
        }),
      );
  }

  getTaskFromDbByID(id: string): firebase.firestore.DocumentData {
    console.log(id);
    return this._db
      .collection('tasks')
      .doc(id)
      .get()
      .then(doc => {
        if (doc.exists) {
          return doc.data();
        }
        console.error('No such task!');
        return null;
      })
      .catch(error => console.error('Error retrieving document', error));
  }

  createTask(taskRecord: TaskRecord) {
    taskRecord.date = new Date();
    this._db
      .collection('tasks')
      .add({ ...taskRecord })
      .then(doc => {
        console.log(`Task created. ID: ${doc.id}`);
      })
      .catch(function(error) {
        console.error('Error creating task: ', error);
      });
  }
}
