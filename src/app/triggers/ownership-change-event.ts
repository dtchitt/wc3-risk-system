import { City } from '../city/city';
import { UnitToCity } from '../city/city-map';
import { Country } from '../country/country';
import { CityToCountry } from '../country/country-map';
import { GamePlayer } from '../entity/player/game-player';
import { PlayerData } from '../entity/player/player-data';
import { PlayerManager } from '../entity/player/player-manager';
import { PLAYER_STATUS } from '../entity/player/status/status-enum';
import { GameManager } from '../game/game-manager';
import { NameManager } from '../managers/names/name-manager';
import { VictoryManager } from '../managers/victory-manager';
import { Region } from '../region/region';
import { CountryToRegion } from '../region/region-map';
import { ScoreboardManager } from '../scoreboard/scoreboard-manager';
import { SettingsContext } from '../settings/settings-context';
import { TeamManager } from '../teams/team-manager';
import { UNIT_TYPE } from '../utils/unit-types';

export function OwnershipChangeEvent() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_CHANGE_OWNER, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			//TODO
			// 		if (!IsUnitType(GetChangingUnit(), UNIT_TYPE.CITY)) return false;
			// 		if (GameManager.getInstance().isStatePostGame()) return false;
			// 		const city: City = UnitToCity.get(GetChangingUnit());
			// 		const country: Country = CityToCountry.get(city);
			// 		const region: Region = CountryToRegion.get(country);
			// 		const prevOwner: GamePlayer | undefined = PlayerManager.getInstance().getPlayerMap().get(GetChangingUnitPrevOwner());
			// 		const owner: GamePlayer | undefined = PlayerManager.getInstance().getPlayerMap().get(city.getOwner());
			// 		const teamManager: TeamManager = SettingsContext.getInstance().isFFA() ? null : TeamManager.getInstance();
			// 		if (prevOwner) {
			// 			const prevOwnerData: PlayerData = prevOwner.getData();
			// 			const prevOwnerHandle: player = prevOwner.getPlayer();
			// 			prevOwnerData.cities.cities.splice(prevOwnerData.cities.cities.indexOf(city), 1);
			// 			prevOwnerData.getCountries().set(country, prevOwnerData.getCountries().get(country) - 1);
			// 			if (country.getOwner() == prevOwnerHandle) {
			// 				country.setOwner(null);
			// 				if (prevOwner.getStatus().isAlive()) {
			// 					prevOwner.getData().getIncome().income -= country.getCities().length;
			// 					prevOwner.getData().getIncome().delta -= country.getCities().length;
			// 				}
			// 				if (teamManager) {
			// 					teamManager.getTeamFromPlayer(prevOwnerHandle).updateIncome(-country.getCities().length);
			// 				}
			// 			}
			// 			if (region && region.owner == prevOwnerHandle) {
			// 				region.setOwner(null);
			// 				prevOwner.getData().getIncome().income -= region.goldBonus;
			// 				prevOwner.getData().getIncome().delta -= region.goldBonus;
			// 				if (teamManager) {
			// 					teamManager.getTeamFromPlayer(prevOwnerHandle).updateIncome(-region.goldBonus);
			// 				}
			// 			}
			// 			if (prevOwnerData.cities.cities.length == 0) {
			// 				prevOwner.getStatus().set(PLAYER_STATUS.NOMAD);
			// 			}
			// 			if (teamManager) {
			// 				teamManager.getTeamFromPlayer(prevOwnerHandle).updateCityCount(-1);
			// 			}
			// 		}
			// 		if (owner) {
			// 			const ownerData: PlayerData = owner.getData();
			// 			const ownerHandle: player = owner.getPlayer();
			// 			ownerData.cities.cities.push(city);
			// 			ownerData.cities.max = Math.max(ownerData.cities.max, ownerData.cities.cities.length);
			// 			if (ownerData.countries.has(country)) {
			// 				ownerData.countries.set(country, ownerData.countries.get(country) + 1);
			// 			} else {
			// 				ownerData.countries.set(country, 1);
			// 			}
			// 			if (GameManager.getInstance().isStateMetaGame()) {
			// 				VictoryManager.getInstance().setLeader(owner);
			// 			}
			// 			if (ownerData.countries.get(country) == country.getCities().length) {
			// 				country.setOwner(ownerHandle);
			// 				if (owner.getStatus().isAlive()) {
			// 					ownerData.getIncome().income += country.getCities().length;
			// 					ownerData.getIncome().delta += country.getCities().length;
			// 					if (region && region.isOwnedByPlayer(ownerHandle)) {
			// 						region.setOwner(ownerHandle);
			// 						ownerData.getIncome().income += region.goldBonus;
			// 						ownerData.getIncome().delta += region.goldBonus;
			// 					}
			// 				}
			// 				if (ownerData.getIncome().income > ownerData.getIncome().max) {
			// 					ownerData.getIncome().max = ownerData.getIncome().income;
			// 				}
			// 				if (teamManager) {
			// 					teamManager.getTeamFromPlayer(ownerHandle).updateIncome(country.getCities().length);
			// 					if (region && region.isOwnedByPlayer(ownerHandle)) {
			// 						teamManager.getTeamFromPlayer(ownerHandle).updateIncome(region.goldBonus);
			// 					}
			// 				}
			// 				ScoreboardManager.getInstance().setAlert(ownerHandle, country.getName());
			// 			}
			// 			if (teamManager) {
			// 				teamManager.getTeamFromPlayer(ownerHandle).updateCityCount(1);
			// 			}
			// 			ScoreboardManager.getInstance().setTitle(
			// 				`${NameManager.getInstance().getDisplayName(VictoryManager.getInstance().leader.getPlayer())} ${
			// 					VictoryManager.getInstance().leader.trackedData.cities.cities.length
			// 				}/${VictoryManager.CITIES_TO_WIN} `
			// 			);
			// 		}
			// 		return false;
		})
	);
}
