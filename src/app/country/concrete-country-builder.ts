import { DefaultSpawnType } from 'src/configs/country-settings';
import { City } from '../city/city';
import { CityBuilder } from '../city/city-builder';
import { CityData } from '../city/city-data';
import { Country } from './country';
import { CountryBuilder } from './country-builder';
import { CityToCountry, StringToCountry } from './country-map';
import { Spawner } from '../spawner/spawner';
import { SpawnerBuilder } from '../spawner/spawner-builder';
import { SpawnerData } from '../spawner/spawner-data';

export class ConcreteCountryBuilder implements CountryBuilder {
	private name: string;
	private cities: City[] = [];
	private spawn: Spawner;

	public setName(name: string): CountryBuilder {
		this.name = name;

		return this;
	}

	public addCity(city: CityData, builder: CityBuilder, guardData: number): CountryBuilder {
		builder.setBarracks(city.barrack);
		if (city.name) builder.setName(city.name);
		builder.setCOP(city.cop);

		if (!city.guard) {
			city.guard = guardData;
		}

		builder.setGuard(city.guard);
		builder.setCityType(city.cityType);

		const result: City = builder.build();
		this.cities.push(result);

		return this;
	}

	public setSpawn(spawn: SpawnerData, builder: SpawnerBuilder): CountryBuilder {
		builder.setUnit(spawn.unitData);
		builder.setCountry(this.name);

		if (!spawn.spawnTypeID) {
			builder.setSpawnType(DefaultSpawnType);
		} else {
			builder.setSpawnType(spawn.spawnTypeID);
		}

		if (!spawn.spawnsPerStep) {
			builder.setSpawnsPerStep(Math.floor((this.cities.length + 1) >>> 1));
		} else {
			builder.setSpawnsPerStep(spawn.spawnsPerStep);
		}

		builder.setMaxSpawnPerPlayer(spawn.spawnsPerPlayer);

		this.spawn = builder.build();

		return this;
	}

	public build(): Country {
		if (!this.name || this.cities.length === 0 || !this.spawn) {
			print('Country builder is missing required components.');
		}

		const country = new Country(this.name, this.cities, this.spawn);

		StringToCountry.set(this.name, country);

		this.cities.forEach((city) => {
			CityToCountry.set(city, country);
		});

		this.reset();
		return country;
	}

	public reset(): void {
		this.name = null;
		this.cities = [];
		this.spawn = null;
	}
}
