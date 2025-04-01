export type LevelTypeResponse = {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
};

export type LevelTypeRequest = {
  name: string;
};

export type LevelResponse = {
  id: string;
  levelNumber: number;
  name: string;
  color: string;
  expRequired: number;
  urlGif: string;
  levelType: LevelTypeResponse;
  createdAt: string;
  updatedAt: string;
};

export type LevelRequest = {
  name: string;
  levelNumber: number;
  color: string;
  expRequired: number;
  levelTypeId: string;
  urlGif: string;
};
