import { CITIES_TO_WIN } from 'src/configs/game-settings';
import { City } from '../city/city';
import { UnitToCity } from '../city/city-map';
import { Country } from '../country/country';
import { CityToCountry } from '../country/country-map';
import { NameManager } from '../managers/names/name-manager';
import { VictoryManager } from '../managers/victory-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ActivePlayer } from '../player/types/active-player';
import { Scoreboards } from '../scoreboard/scoreboard-array';
import { HexColors } from '../utils/hex-colors';
import { UNIT_TYPE } from '../utils/unit-types';
import { TrackedData } from '../player/data/tracked-data';
import { GameManager } from '../game/game-manager';

export function onOwnerChange() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_CHANGE_OWNER, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			if (!IsUnitType(GetChangingUnit(), UNIT_TYPE.CITY)) return false;

			try {
				const city: City = UnitToCity.get(GetChangingUnit());
				const country: Country = CityToCountry.get(city);
				const prevOwner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(GetChangingUnitPrevOwner());
				const owner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(city.getOwner());

				if (prevOwner) {
					const prevOwnerData: TrackedData = prevOwner.trackedData;

					prevOwnerData.cities.cities.splice(prevOwnerData.cities.cities.indexOf(city), 1);
					prevOwnerData.countries.set(country, prevOwnerData.countries.get(country) - 1);

					if (country.getOwner() == prevOwner.getPlayer()) {
						country.setOwner(null);
					}

					if (prevOwnerData.cities.cities.length == 0) {
						prevOwner.status.set(PLAYER_STATUS.NOMAD);
					}
				}

				if (owner) {
					const ownerData: TrackedData = owner.trackedData;

					ownerData.cities.cities.push(city);
					ownerData.cities.max = Math.max(ownerData.cities.max, ownerData.cities.cities.length);

					if (ownerData.countries.has(country)) {
						ownerData.countries.set(country, ownerData.countries.get(country) + 1);
					} else {
						ownerData.countries.set(country, 1);
					}

					if (ownerData.countries.get(country) == country.getCities().length) {
						country.setOwner(owner.getPlayer());

						Scoreboards.forEach((board) => {
							board.setAlert(
								`${NameManager.getInstance().getDisplayName(owner.getPlayer())} claimed ${HexColors.TANGERINE}${country.getName()}|r`
							);
						});
					}

					if (GameManager.getInstance().isStateMetaGame()) {
						VictoryManager.getInstance().setLeader(owner);

						Scoreboards.forEach((board) => {
							board.setTitle(
								`${NameManager.getInstance().getDisplayName(VictoryManager.getInstance().leader.getPlayer())} ${
									VictoryManager.getInstance().leader.trackedData.cities.cities.length
								}/${CITIES_TO_WIN} `
							);
						});
					}
				}
			} catch (error) {
				print(error);
			}

			return false;
		})
	);
}