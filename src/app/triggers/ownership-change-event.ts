import { City } from '../city/city';
import { UnitToCity } from '../city/city-map';
import { Country } from '../country/country';
import { CityToCountry } from '../country/country-map';
import { NameManager } from '../managers/names/name-manager';
import { VictoryManager } from '../managers/victory-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ActivePlayer } from '../player/types/active-player';
import { UNIT_TYPE } from '../utils/unit-types';
import { TrackedData } from '../player/data/tracked-data';
import { GameManager } from '../game/game-manager';
import { CountryToRegion } from '../region/region-map';
import { Region } from '../region/region';
import { ScoreboardManager } from '../scoreboard/scoreboard-manager';
import { SettingsContext } from '../settings/settings-context';
import { TeamManager } from '../teams/team-manager';

export function OwnershipChangeEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_CHANGE_OWNER, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			if (!IsUnitType(GetChangingUnit(), UNIT_TYPE.CITY)) return false;
			if (GameManager.getInstance().isStatePostGame()) return false;

			const city: City = UnitToCity.get(GetChangingUnit());
			const country: Country = CityToCountry.get(city);
			const region: Region = CountryToRegion.get(country);
			const prevOwner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(GetChangingUnitPrevOwner());
			const owner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(city.getOwner());

			if (prevOwner) {
				const prevOwnerData: TrackedData = prevOwner.trackedData;

				prevOwnerData.cities.cities.splice(prevOwnerData.cities.cities.indexOf(city), 1);
				prevOwnerData.countries.set(country, prevOwnerData.countries.get(country) - 1);

				if (country.getOwner() == prevOwner.getPlayer()) {
					country.setOwner(null);

					if (prevOwner.status.isAlive()) {
						prevOwner.trackedData.income.income -= country.getCities().length;
						prevOwner.trackedData.income.delta -= country.getCities().length;
					}
				}

				if (region && region.owner == prevOwner.getPlayer()) {
					region.setOwner(null);
					prevOwner.trackedData.income.income -= region.goldBonus;
					prevOwner.trackedData.income.delta -= region.goldBonus;
				}

				if (prevOwnerData.cities.cities.length == 0) {
					prevOwner.status.set(PLAYER_STATUS.NOMAD);
				}

				if (!SettingsContext.getInstance().isFFA()) {
					TeamManager.getInstance().getTeamFromPlayer(prevOwner.getPlayer())?.updateCityCount(-1);
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

				if (GameManager.getInstance().isStateMetaGame()) {
					VictoryManager.getInstance().setLeader(owner);
				}

				if (ownerData.countries.get(country) == country.getCities().length) {
					country.setOwner(owner.getPlayer());

					if (owner.status.isAlive()) {
						ownerData.income.income += country.getCities().length;
						ownerData.income.delta += country.getCities().length;

						if (ownerData.income.income > ownerData.income.max) {
							ownerData.income.max = ownerData.income.income;
						}

						if (region && region.isOwnedByPlayer(owner.getPlayer())) {
							region.setOwner(owner.getPlayer());
							ownerData.income.income += region.goldBonus;
							ownerData.income.delta += region.goldBonus;
						}
					}

					ScoreboardManager.getInstance().setAlert(owner.getPlayer(), country.getName());
				}

				if (!SettingsContext.getInstance().isFFA()) {
					TeamManager.getInstance().getTeamFromPlayer(prevOwner.getPlayer())?.updateCityCount(1);
				}

				ScoreboardManager.getInstance().setTitle(
					`${NameManager.getInstance().getDisplayName(VictoryManager.getInstance().leader.getPlayer())} ${
						VictoryManager.getInstance().leader.trackedData.cities.cities.length
					}/${VictoryManager.CITIES_TO_WIN} `
				);
			}

			return false;
		})
	);
}
