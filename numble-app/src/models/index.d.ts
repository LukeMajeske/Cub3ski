import { ModelInit, MutableModel, PersistentModelConstructor } from "@aws-amplify/datastore";





type HighscoresMetaData = {
  readOnlyFields: 'createdAt' | 'updatedAt';
}

export declare class Highscores {
  readonly id: string;
  readonly score?: number | null;
  readonly username?: string | null;
  readonly createdAt?: string | null;
  readonly updatedAt?: string | null;
  constructor(init: ModelInit<Highscores, HighscoresMetaData>);
  static copyOf(source: Highscores, mutator: (draft: MutableModel<Highscores, HighscoresMetaData>) => MutableModel<Highscores, HighscoresMetaData> | void): Highscores;
}