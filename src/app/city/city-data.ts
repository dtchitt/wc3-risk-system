import { UnitData } from '../libs/unit-data';
import { CityType } from './city-type';

/**
 * Data pattern for City creation settings. These settings are set in CountrySetttings.ts.
 */
export interface CityData {
	/**
	 * Set the name of the barracks.
	 * Optional, defaults to: Unit name set in World Editor.
	 */
	name?: string;

	/**
	 * Sets the barrack for the city.
	 * This can be a preplaced unit or a generated unit.
	 */
	barrack: unit | UnitData;

	/**
	 * Sets the guard for the city.
	 * The guards default position in the CoP is automatic and cannot be changed.
	 * Optional, defaults to: Default guard typed provided via country settings.
	 */
	guard?: number;

	/**
	 * Sets the cop for the city.
	 * This can be a preplaced unit or a generated unit.
	 * Optional, defaults to: automatically placed cop based on barracks & guard position
	 */
	cop?: unit;

	/**
	 * Sets the city type for the city.
	 * This is a pre-defined CityType
	 * Optional, defaults to: "land"
	 */
	cityType?: CityType;
}
