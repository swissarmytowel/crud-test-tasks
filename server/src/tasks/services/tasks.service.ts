import {
  Injectable,
  NotFoundException,
  BadRequestException
} from '@nestjs/common';
import { FIREBASE_AUTH_CONFIG } from '../database.config.json';
import { TaskRecord } from '../taskrecord.dto';
import * as firebase from 'firebase';

type DocumentData = firebase.firestore.DocumentData;

const collectionID = 'tasks';

/**
 * Return formatted document data (currently format Timestamp to ISO Date)
 * @param doc Firebase document
 */
function getFormattedDocData(doc: DocumentData): DocumentData {
  const record = doc.data();
  record.id = doc.id;
  record['date'] = record['date'].toDate().toISOString();
  return record;
}

@Injectable()
export class TasksService {
  private readonly cloudStoreRootRef: firebase.firestore.Firestore;

  public constructor() {
    // Init firebase cloud storage
    const firebaseApp = firebase.initializeApp(FIREBASE_AUTH_CONFIG);
    this.cloudStoreRootRef = firebase.firestore();
  }

  // Return all tasks from the cloud storage
  async getAllTasksFromDb(): Promise<DocumentData[]> {
    return await this.cloudStoreRootRef
      .collection(collectionID)
      .orderBy('date')
      .limit(100) //TODO: get rid of results limit (?)
      .get()
      .then(snapshot =>
        snapshot.docs.map(doc => {
          return getFormattedDocData(doc);
        })
      );
  }

  getTaskFromDbByID(id: string): Promise<DocumentData> {
    return this.cloudStoreRootRef
      .collection(collectionID)
      .doc(id)
      .get()
      .then(doc => {
        if (!doc.exists) {
          throw new NotFoundException('No such task!');
        }
        return getFormattedDocData(doc);
      })
      .catch(err => {
        console.error('Error retrieving document: ', err);
        return null;
      });
  }

  createTask(taskRecord: TaskRecord) {
    // TODO: Validate date properly!
    const typeOfDateProperty = typeof taskRecord.date;
    if (typeOfDateProperty == 'undefined') {
      taskRecord.date = new Date();
    } else if (typeOfDateProperty != typeof Date) {
      throw new BadRequestException('Date format is not valid!');
    }
    this.cloudStoreRootRef
      .collection(collectionID)
      .add({ ...taskRecord })
      .catch(err => {
        console.error('Error creating task: ', err);
      });
  }

  removeTaskByID(id: string) {
    this.cloudStoreRootRef
      .collection(collectionID)
      .doc(id)
      .delete()
      .catch(err => {
        console.error('Error deleting document: ', err);
      });
  }

  updateTaskById(id: string, taskRecord: TaskRecord) {
    this.cloudStoreRootRef
      .collection(collectionID)
      .doc(id)
      .update({ ...taskRecord })
      .catch(err => {
        console.error('Error updating document: ', err);
      });
  }
}
