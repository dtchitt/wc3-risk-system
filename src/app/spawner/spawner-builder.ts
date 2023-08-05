import { Coordinates } from '../interfaces/coordinates';
import { Resetable } from '../interfaces/resetable';
import { Spawner } from './spawner';

/**
 * Interface for a SpawnerBuilder.
 * This interface extends the Resetable interface and provides a series of setter methods for defining a Spawner.
 * Each setter method returns a SpawnerBuilder to allow for method chaining, and a build method to create the Spawner when done.
 */
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
