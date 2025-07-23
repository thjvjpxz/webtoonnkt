export interface LevelTypeResponse {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface LevelTypeRequest {
  name: string;
}

export interface LevelResponse {
  id: string;
  levelNumber: number;
  name: string;
  color: string;
  expRequired: number;
  urlGif: string;
  levelType: LevelTypeResponse;
  createdAt: string;
  updatedAt: string;
}

export interface LevelRequest {
  name: string;
  levelNumber: number;
  color: string;
  expRequired: number;
  levelTypeId: string;
  urlGif: string;
}


