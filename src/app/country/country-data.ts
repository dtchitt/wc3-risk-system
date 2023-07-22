import { CityData } from '../city/city-data';
import { SpawnerData } from '../spawner/spawner-data';

export interface CountryData {
	name: string; //The name of the country.
	spawnerData: SpawnerData; //The rect or center x/y coords of the spawn location for this country
	cities: CityData[];
	guardType?: number; //The default guard type for all Cities in this country. More specific City settings will override this.
}
