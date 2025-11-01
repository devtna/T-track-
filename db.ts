import Dexie, { type Table } from 'dexie';
import type { SmokeLog, Goal, GoalType } from './types';

export class TobaccoTrackDB extends Dexie {
  logs!: Table<SmokeLog>;
  goals!: Table<Goal, GoalType>; // GoalType is the key type

  // FIX: Explicitly declare inherited Dexie methods to resolve TypeScript's
  // type inference problems with subclassing Dexie. This makes methods like
  // `transaction` and `version` available on the class and its instances.
  transaction!: Dexie['transaction'];
  version!: Dexie['version'];

  constructor() {
    super('tobaccoTrackDatabase');
    // The previous cast on `this.version` is no longer needed due to the explicit declarations above,
    // which fix the type inference issue for the subclass.
    this.version(1).stores({
      logs: '++id, timestamp', // Primary key 'id' auto-incremented, index 'timestamp'
      goals: 'type', // Primary key 'type'
    });
  }
}

export const db = new TobaccoTrackDB();
