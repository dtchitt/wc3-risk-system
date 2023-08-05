import { Coordinates } from '../interfaces/coordinates';
import { Resetable } from '../interfaces/resetable';
import { Spawner } from './spawner';

export interface SpawnerBuilder extends Resetable {
	setUnit(unitData: unit | Coordinates): SpawnerBuilder;
	setCountry(countryName: string): SpawnerBuilder;
	setSpawnsPerStep(spawnsPerStep: number): SpawnerBuilder;
	setMaxSpawnPerPlayer(spawnsPerPlayer?: number): SpawnerBuilder;
	setSpawnType(spawnTypeID: number): SpawnerBuilder;
	build(): Spawner;
}
