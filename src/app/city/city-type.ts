import { City } from './city';
import { Barracks } from './components/barracks';
import { Guard } from './components/guard';
import { LandCity } from './land-city';
import { PortCity } from './port-city';

/**
 * Type for the different possible types of cities: 'land' or 'port'.
 */
export type CityType = 'land' | 'port';

/**
 * Type alias for a constructor of a `City`.
 * Requires `Barracks`, `Guard`, and a `unit` (representing the Circle of Power) as parameters.
 */
type CityConstructor = new (barracks: Barracks, guard: Guard, cop: unit) => City;

/**
 * A Record (an object with string keys and specific value type) that associates each `CityType` to a corresponding `CityConstructor`.
 */
export const CityTypes: Record<CityType, CityConstructor> = {
	land: LandCity,
	port: PortCity,
};
