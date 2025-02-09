import { City } from 'src/app/city/city';
import { Country } from 'src/app/country/country';
import { CityToCountry } from 'src/app/country/country-map';
import { ShuffleArray } from 'src/app/utils/utils';
import { DistributionService } from './distribution-service';
import { debugPrint } from 'src/app/utils/debug-print';
import { NameManager } from 'src/app/managers/names/name-manager';
import { LocalMessage } from 'src/app/utils/messages';

/**
 * Handles the distribution of cities among active players.
 */
export class CapitalDistributionService implements DistributionService {
	public playerCapitalCities: Map<player, City>;

	/**
	 * Initializes city pool and player list.
	 */
	constructor(playerCapitalCities: Map<player, City>) {
		this.playerCapitalCities = playerCapitalCities;
	}

	/**
	 * Executes the distribution algorithm.
	 * @param callback - Function to call after distribution is complete.
	 */
	public runDistro(callback: () => void): void {
		this.distribute();
		callback();
	}

	/**
	 * Implements the distribution algorithm.
	 */
	public distribute() {
		let playerCapitalCountries = new Map<player, Country>();

		const countries = Array.from(CityToCountry.values());

		const playerCountries = new Set(playerCapitalCountries.values());
		let filteredCountries = countries.filter((country) => !playerCountries.has(country));

		ShuffleArray(filteredCountries);

		this.playerCapitalCities.forEach((city, player) => {
			if (city != null) {
				debugPrint('Player named ' + NameManager.getInstance().getDisplayName(player) + ' already has a capital');
				LocalMessage(player, `Your chosen capital is in ${CityToCountry.get(city).getName()}.`, 'Sound\\Interface\\Error.flac');

				city.setOwner(player);
				SetUnitOwner(city.guard.unit, player, true);

				// Set the country spawn multiplier to 2
				CityToCountry.get(city).getSpawn().setMultiplier(2);

				return;
			}

			debugPrint('Player named ' + NameManager.getInstance().getDisplayName(player) + ' does not have a capital');

			while (true) {
				debugPrint('Assigning capital to ' + NameManager.getInstance().getDisplayName(player));

				// get the first country that has not been picked yet - ensure this country has more than 1 city
				// shuffle the cities and pick the first one
				const country = filteredCountries.pop();
				let cities = country.getCities();
				if (cities.length <= 1) {
					continue;
				}

				cities = cities.filter((city) => !city.isPort());

				// pop the first element from the remaining country list
				// assign the first city to the player
				ShuffleArray(cities);

				const capital = cities[0];
				capital.setOwner(player);
				SetUnitOwner(capital.guard.unit, player, true);

				// Set the country spawn multiplier to 2
				CityToCountry.get(capital).getSpawn().setMultiplier(2);

				this.playerCapitalCities.set(player, capital);

				// terminate the loop, a country has been found that can be assigned to the player
				LocalMessage(player, `You have been randomly assigned a capital in ${country.getName()}.`, 'Sound\\Interface\\Error.flac');

				break;
			}
		});
	}
}
