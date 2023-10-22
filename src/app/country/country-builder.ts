import { CityBuilder } from '../city/city-builder';
import { CityData } from '../city/city-data';
import { Resetable } from '../interfaces/resetable';
import { SpawnerBuilder } from '../spawner/spawner-builder';
import { SpawnerData } from '../spawner/spawner-data';
import { Country } from './country';

/**
 * CountryBuilder is an interface that defines the contract for building Country objects.
 * It extends Resetable, meaning it can be reset to its default state.
 */
export interface CountryBuilder extends Resetable {
	/**
	 * Sets the name for the country being built.
	 * @param name - The name of the country.
	 * @returns The current builder instance.
	 */
	setName(name: string): CountryBuilder;

	/**
	 * Adds a city to the country being built.
	 * @param city - The data for constructing the city.
	 * @param builder - The builder for the city.
	 * @param guardData - The data for constructing the guard unit.
	 * @returns The current builder instance.
	 */
	addCity(city: CityData, builder: CityBuilder, guardData: number): CountryBuilder;

	/**
	 * Sets the spawn conditions for the country.
	 * @param spawn - The data for the spawner.
	 * @param spawnerBuilder - The builder for the spawner.
	 * @returns The current builder instance.
	 */
	setSpawn(spawn: SpawnerData, spawnerBuilder: SpawnerBuilder): CountryBuilder;

	/**
	 * Constructs a new Country object.
	 * @returns The built Country object.
	 */
	build(): Country;
}
