import { CityBuilder } from '../city/city-builder';
import { CityData } from '../city/city-data';
import { Resetable } from '../libs/resetable';
import { SpawnerBuilder } from '../spawner/spawner-builder';
import { SpawnerData } from '../spawner/spawner-data';
import { Country } from './country';

export interface CountryBuilder extends Resetable {
	setName(name: string): CountryBuilder;
	addCity(city: CityData, builder: CityBuilder, guardData: number): CountryBuilder;
	setSpawn(spawn: SpawnerData, spawnerBuilder: SpawnerBuilder): CountryBuilder;
	build(): Country;
}
