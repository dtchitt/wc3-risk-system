import { Coordinates } from './coordinates';

/**
 * Interface for a unit's data, extends from `Coordinates`.
 * @property typeId - The unique identifier for the unit type, if available.
 */
export interface UnitData extends Coordinates {
	typeId?: number;
}
