import { City } from 'src/app/city/city';
import { RegionToCity } from 'src/app/city/city-map';
import { Country } from 'src/app/country/country';
import { CityToCountry } from 'src/app/country/country-map';
import { PlayerManager } from 'src/app/player/player-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { MultiMap } from 'src/app/utils/multi-map';
import { ShuffleArray } from 'src/app/utils/utils';

export class DistributionService {
	private cityMax: number;

	constructor() {
		this.cityMax = 20;
	}

	public standardDistro() {
		const cities: City[] = [...RegionToCity.values()];
		const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
		const countryData: MultiMap<Country, ActivePlayer, number> = new MultiMap<Country, ActivePlayer, number>();

		this.cityMax = Math.min(Math.floor(cities.length / players.length), 20);
		ShuffleArray(cities);
		ShuffleArray(players);

		try {
			while (players.length > 0) {
				let city: City = this.getRandomCity(cities);
				let player: ActivePlayer = players.pop();
				let country: Country = CityToCountry.get(city);

				if (!countryData.has(country, player)) countryData.set(country, player, 0);

				if (countryData.get(country, player) < Math.floor(country.getCities().length / 2)) {
					this.changeCityOwner(city, player, countryData);
				} else {
					for (let counter = 0; counter <= 50; counter++) {
						cities.push(city);
						city = this.getRandomCity(cities);
						country = CityToCountry.get(city);

						if (!countryData.has(country, player)) countryData.set(country, player, 0);

						if (countryData.get(country, player) < Math.floor(country.getCities().length / 2) || city == null) {
							break;
						}
					}

					this.changeCityOwner(city, player, countryData);
				}

				if (player.trackedData.cities.cities.length < this.cityMax) {
					players.push(player);
				}
			}
		} catch (error) {
			print('Error in StandardDistro' + error);
		}
	}

	private getRandomCity(cities: City[]): City {
		const randomIndex = Math.floor(Math.random() * cities.length);
		let city: City = cities.splice(randomIndex, 1)[0];

		if (CityToCountry.get(city).getCities().length == 1) {
			city = this.getRandomCity(cities);
		}

		return city;
	}

	private changeCityOwner(city: City, player: ActivePlayer, countryData: MultiMap<Country, ActivePlayer, number>) {
		const country: Country = CityToCountry.get(city);

		city.setOwner(player.getPlayer());
		SetUnitOwner(city.guard.unit, player.getPlayer(), true);
		countryData.set(country, player, countryData.get(country, player) + 1);
	}
}
