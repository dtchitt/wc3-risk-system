import { Coordinates } from '../interfaces/coordinates';

/**
 * Interface for defining spawner data.
 */
export interface SpawnerData {
	/** The unit or coordinates for the spawner. */
	unitData: unit | Coordinates;

	/** The number of units to spawn per step.
	 * Optional, calculated based off number of cities in country if not set.
	 */
	spawnsPerStep?: number;

	/** The number of units to spawn per player.
	 * Optional, uses default setting if not set
	 */
	spawnsPerPlayer?: number;

	/** The type ID of the spawn.
	 * Optional, uses default setting if not set.
	 */
	spawnTypeID?: number;
}
