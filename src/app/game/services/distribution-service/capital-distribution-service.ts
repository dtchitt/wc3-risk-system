import { City } from 'src/app/city/city';
import { Country } from 'src/app/country/country';
import { CityToCountry } from 'src/app/country/country-map';
import { PlayerManager } from 'src/app/player/player-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { ShuffleArray } from 'src/app/utils/utils';
import { DoublyLinkedList } from 'src/app/utils/doubly-linked-list';
import { DistributionService } from './distribution-service';
import { debugPrint } from 'src/app/utils/debug-print';
import { NameManager } from 'src/app/managers/names/name-manager';
import { LocalMessage } from 'src/app/utils/messages';

/**
 * Handles the distribution of cities among active players.
 */
export class CapitalDistributionService implements DistributionService {
	private playerCapitalCities: Map<player, City>;

	/**
	 * Initializes city pool and player list.
	 */
	constructor(playerCapitalCities: Map<player, City>) {
		this.playerCapitalCities = playerCapitalCities;
	}

	/**
	 * Executes the distribution algorithm.
	 * It will run the correct algorithm based on game settings.
	 * @param callback - Function to call after distribution is complete.
	 */
	public runDistro(callback: () => void) {
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

				// terminate the loop, a country has been found that can be assigned to the player
				LocalMessage(player, `You have been randomly assigned a capital in ${country.getName()}.`, 'Sound\\Interface\\Error.flac');

				break;
			}
		});
	}
}
