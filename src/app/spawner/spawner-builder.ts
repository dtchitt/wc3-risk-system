import { Coordinates } from '../interfaces/coordinates';
import { Resetable } from '../interfaces/resetable';
import { Spawner } from './spawner';

export interface SpawnerBuilder extends Resetable {
	/**
	 * Sets the unit or coordinates for the Spawner.
	 * @param {unit | Coordinates} unitData - The unit data or coordinates.
	 * @returns The instance of SpawnerBuilder.
	 */
	setUnit(unitData: unit | Coordinates): SpawnerBuilder;

	/**
	 * Sets the country name for the Spawner.
	 * @param {string} countryName - The name of the country.
	 * @returns The instance of SpawnerBuilder.
	 */
	setCountry(countryName: string): SpawnerBuilder;

	/**
	 * Sets the spawns per step for the Spawner.
	 * @param {number} spawnsPerStep - The number of spawns per step.
	 * @returns The instance of SpawnerBuilder.
	 */
	setSpawnsPerStep(spawnsPerStep: number): SpawnerBuilder;

	/**
	 * Sets the maximum number of spawns per player for the Spawner.
	 * @param {number} spawnsPerPlayer - The maximum number of spawns per player. Optional parameter.
	 * @returns The instance of SpawnerBuilder.
	 */
	setMaxSpawnPerPlayer(spawnsPerPlayer?: number): SpawnerBuilder;

	/**
	 * Sets the spawn type ID for the Spawner.
	 * @param {number} spawnTypeID - The type ID of the spawn.
	 * @returns The instance of SpawnerBuilder.
	 */
	setSpawnType(spawnTypeID: number): SpawnerBuilder;

	/**
	 * Builds the Spawner with the set parameters.
	 * @returns The Spawner instance.
	 */
	build(): Spawner;
}
