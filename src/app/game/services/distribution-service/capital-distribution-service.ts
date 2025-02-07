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

/**
 * Handles the distribution of cities among active players.
 */
export class CapitalDistributionService implements DistributionService {
	private players: DoublyLinkedList<ActivePlayer>;
	private playerCapitalCities: Map<player, City>;
	private playerCapitalCountries: Map<player, Country>;

	/**
	 * Initializes city pool and player list.
	 */
	constructor(playerCapitalCities: Map<player, City>) {
		this.players = new DoublyLinkedList<ActivePlayer>();
		this.playerCapitalCities = playerCapitalCities;

		PlayerManager.getInstance().players.forEach((player) => {
			this.players.addFirst(player);
		});
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
		this.playerCapitalCountries = new Map();

		debugPrint('playerCaptalCities size: ' + this.playerCapitalCities.size);

		this.playerCapitalCities.forEach((city, player) => {
			if (CityToCountry.has(city)) {
				debugPrint('City has country');
				this.playerCapitalCountries.set(player, CityToCountry.get(city));
				debugPrint('City count by country' + this.playerCapitalCountries.get(player).getCities().length);
			} else {
				debugPrint('City does not have country');
				this.playerCapitalCountries.set(player, null);
			}
		});

		debugPrint('playerCaptalCountries size: ' + this.playerCapitalCountries.size);
		const countries = Array.from(CityToCountry.values());
		debugPrint('countries size: ' + countries.length);

		const playerCountries = new Set(this.playerCapitalCountries.values());
		let filteredCountries = countries.filter((country) => !playerCountries.has(country));
		debugPrint('filteredCountries size: ' + filteredCountries.length);

		ShuffleArray(filteredCountries);

		// players with city == null have not picked any capital yet
		debugPrint('playerCaptalCities size: ' + this.playerCapitalCities.size);
		this.playerCapitalCities.forEach((city, player) => {
			if (city != null) {
				debugPrint('Player named ' + NameManager.getInstance().getDisplayName(player) + ' already has a capital');
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
					debugPrint('Country named ' + country.getName() + ' has only one city, skpping country');
					continue;
				}

				// pop the first element from the remaining country list
				// assign the first city to the player
				ShuffleArray(cities);

				const capital = cities.pop();
				capital.setOwner(player);
				SetUnitOwner(capital.guard.unit, player, true);

				// terminate the loop, a country has been found that can be assigned to the player
				debugPrint('Assigned capital to ' + NameManager.getInstance().getDisplayName(player) + ' in ' + country.getName());
				break;
			}
		});
	}
}
