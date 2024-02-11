import { Resetable } from '../interfaces/resetable';
import { UnitData } from '../interfaces/unit-data';
import { City } from './city';
import { CityType } from './city-type';

export interface CityBuilder extends Resetable {
	/**
	 * Sets the barracks for the city.
	 * @param building - The unit or `UnitData` object representing the barracks.
	 * @returns The `CityBuilder` instance.
	 */
	setBarracks(building: unit | UnitData): CityBuilder;

	/**
	 * Sets the guard for the city.
	 * @param guard - The unique identifier for the guard.
	 * @returns The `CityBuilder` instance.
	 */
	setGuard(guard: number): CityBuilder;

	/**
	 * Sets the name of the city.
	 * @param name - The name for the city. Optional.
	 * @returns The `CityBuilder` instance.
	 */
	setName(name?: string): CityBuilder;

	/**
	 * Sets the Circle of Power (COP) for the city.
	 * @param cop - The unit representing the COP. Optional.
	 * @returns The `CityBuilder` instance.
	 */
	setCOP(cop?: unit): CityBuilder;

	/**
	 * Sets the type of the city.
	 * @param cityType - The `CityType` for the city. Optional.
	 * @returns The `CityBuilder` instance.
	 */
	setCityType(cityType?: CityType): CityBuilder;

	/**
	 * Constructs the `City` object with the properties that have been set, and returns it.
	 * @returns The newly created `City` instance.
	 */
	build(): City;
}
