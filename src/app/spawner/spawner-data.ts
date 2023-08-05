import { Coordinates } from '../interfaces/coordinates';

export interface SpawnerData {
	unitData: unit | Coordinates;
	spawnsPerStep?: number;
	spawnsPerPlayer?: number;
	spawnTypeID?: number;
}
