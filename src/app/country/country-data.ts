import { CityData } from '../city/city-data';
import { SpawnerData } from '../spawner/spawner-data';

/**
 * CountryData is an interface that defines the data structure for Country objects.
 */
export interface CountryData {
	/**
	 * The name of the country.
	 */
	name: string;

	/**
	 * The rect or center x/y coordinates of the spawn location for this country.
	 */
	spawnerData: SpawnerData;

	/**
	 * An array of CityData objects representing the cities in this country.
	 */
	cities: CityData[];

	/**
	 * The default guard type for all Cities in this country.
	 * More specific City settings will override this.
	 * This is an optional property.
	 */
	guardType?: number;
}
