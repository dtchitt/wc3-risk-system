import { UnitData } from '../interfaces/unit-data';
import { CityType } from './city-type';

export interface CityData {
	/**
	 * The name of the city.
	 * Optional, defaults to name set in world editor.
	 */
	name?: string;

	/**
	 * The barracks for the city, represented by a unit or `UnitData` object.
	 */
	barrack: unit | UnitData;

	/**
	 * The unique identifier for the city's guard.
	 * Optional, defualts to guard type in settings.
	 */
	guard?: number;

	/**
	 * The Circle of Power (COP) for the city, represented by a unit.
	 * Optional, defualts to cop generated in country builder.
	 */
	cop?: unit;

	/**
	 * The `CityType` for the city.
	 * Optional, defaults to "land" type
	 */
	cityType?: CityType;
}
