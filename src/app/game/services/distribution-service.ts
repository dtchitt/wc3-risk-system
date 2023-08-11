import { City } from 'src/app/city/city';
import { Country } from 'src/app/country/country';
import { CityToCountry } from 'src/app/country/country-map';
import { PlayerManager } from 'src/app/player/player-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { GetRandomElementFromArray } from 'src/app/utils/utils';

export class DistributionService {
	private maxCitiesPerPlayer: number;
	private cities: City[];

	constructor() {
		this.maxCitiesPerPlayer = 20;
		this.cities = this.buildCityPool();
	}

	public standardDistro() {
		try {
			const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
			const ownedCities: City[] = [];

			this.maxCitiesPerPlayer = Math.min(Math.floor(this.cities.length / players.length), 20);

			while (players.length > 0) {
				let city: City = GetRandomElementFromArray(this.cities);
				let country: Country = CityToCountry.get(city);
				let player: ActivePlayer = players.shift();

				if (this.isCityValidForPlayer(player, country)) {
					this.changeCityOwner(city, player);
				} else {
					const swapCity: City = this.getRandomValidCity(player, ownedCities);
					const swapCountry: Country = CityToCountry.get(swapCity);
					const swapPlayer: ActivePlayer = this.getRandomValidPlayer(
						swapCountry,
						[...PlayerManager.getInstance().players.values()],
						player
					);

					this.changeCityOwner(city, swapPlayer);
					this.changeCityOwner(swapCity, player);
				}

				ownedCities.push(city);

				if (player.trackedData.cities.cities.length < this.maxCitiesPerPlayer) {
					players.push(player);
				}
			}
		} catch (error) {
			print('Error in StandardDistro' + error);
		}
	}

	private getRandomValidPlayer(country: Country, players: ActivePlayer[], currPlayer: ActivePlayer): ActivePlayer {
		let result: ActivePlayer | null = null;

		while (!result) {
			const randomIndex = Math.floor(Math.random() * players.length);
			const randomPlayer: ActivePlayer = players[randomIndex];

			if (currPlayer === randomPlayer) continue;
			if (!this.isCityValidForPlayer(randomPlayer, country)) continue;
			if (randomPlayer.trackedData.cities.cities.length >= this.maxCitiesPerPlayer) continue;

			result = randomPlayer;
		}

		return result;
	}

	private getRandomValidCity(player: ActivePlayer, cities: City[]): City {
		let result: City | null = null;

		while (!result) {
			const randomIndex = Math.floor(Math.random() * cities.length);
			const randomCity: City = cities[randomIndex];

			if (randomCity.getOwner() != player.getPlayer() && this.isCityValidForPlayer(player, CityToCountry.get(randomCity))) {
				result = randomCity;
			}
		}

		return result;
	}

	private isCityValidForPlayer(player: ActivePlayer, country: Country) {
		if (!player.trackedData.countries.has(country)) {
			player.trackedData.countries.set(country, 0);
		}

		return player.trackedData.countries.get(country) < Math.floor(country.getCities().length / 2);
	}

	private buildCityPool(): City[] {
		const result: City[] = [];

		CityToCountry.forEach((country, city) => {
			if (country.getCities().length > 1) {
				result.push(city);
			}
		});

		return result;
	}

	private changeCityOwner(city: City, player: ActivePlayer) {
		city.setOwner(player.getPlayer());
		SetUnitOwner(city.guard.unit, player.getPlayer(), true);
	}
}
