import { Injectable, NotFoundException } from '@nestjs/common';
import { FIREBASE_AUTH_CONFIG } from './database.config.json';
import { TaskRecord } from './taskrecord.dto';
import * as firebase from 'firebase';

type DocumentData = firebase.firestore.DocumentData;

const collectionID = 'tasks';

/**
 * Return formatted document data (currently format Timestamp to ISO Date)
 * @param doc Firebase document
 */
function getFormattedDocData(doc: DocumentData): DocumentData {
  const record = doc.data();
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
      .catch(error => {
        console.error('Error retrieving document: ', error);
        return null;
      });
  }

  createTask(taskRecord: TaskRecord) {
    taskRecord.date = new Date();
    this.cloudStoreRootRef
      .collection(collectionID)
      .add({ ...taskRecord })
      .then(doc => {
        console.log(`Task created. ID: ${doc.id}`);
      })
      .catch(function(error) {
        console.error('Error creating task: ', error);
      });
  }

  removeTaskByID(id: string) {
    this.cloudStoreRootRef.collection(collectionID)
      .doc(id)
      .delete()
      .then(v => {
        console.log(`Task ${id} is deleted successfully`);
      })
      .catch(err => {
        console.error('Error deleting document: ', err);
      })
  }
}
