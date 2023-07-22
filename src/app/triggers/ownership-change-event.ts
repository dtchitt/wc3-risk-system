// import { CITIES_TO_WIN } from 'src/configs/game-settings';
// import { City } from '../city/city';
// import { UnitToCity } from '../city/city-map';
// import { Country } from '../country/country';
// import { CityToCountry } from '../country/country-map';
// import { RoundManager } from '../game/round-manager';
// import { NameManager } from '../managers/names/name-manager';
// import { VictoryManager } from '../managers/victory-manager';
// import { PlayerManager } from '../player/player-manager';
// import { PLAYER_STATUS } from '../player/status/player-status-enum';
// import { PlayerRoundDataType } from '../player/trackedData/player-round-data-type';
// import { ActivePlayer } from '../player/types/active-player';
// import { Scoreboards } from '../scoreboard/scoreboard-array';
// import { HexColors } from '../utils/hex-colors';
// import { UNIT_TYPE } from '../utils/unit-types';

// export function onOwnerChange() {
// 	const t: trigger = CreateTrigger();

// 	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
// 		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_CHANGE_OWNER, null);
// 	}

// 	TriggerAddCondition(
// 		t,
// 		Condition(() => {
// 			if (!IsUnitType(GetChangingUnit(), UNIT_TYPE.CITY)) return false;

// 			try {
// 				const city: City = UnitToCity.get(GetChangingUnit());
// 				const country: Country = CityToCountry.get(city);
// 				const prevOwner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(GetChangingUnitPrevOwner());
// 				const owner: ActivePlayer | undefined = PlayerManager.getInstance().players.get(city.getOwner());

// 				if (prevOwner) {
// 					const prevOwnerData: PlayerRoundDataType | undefined = prevOwner.getRoundData().data;

// 					prevOwnerData.cityData.cities.splice(prevOwnerData.cityData.cities.indexOf(city), 1);
// 					prevOwnerData.countries.set(country, prevOwnerData.countries.get(country) - 1);

// 					if (country.getOwner() == prevOwner) {
// 						country.setOwner(null);
// 					}

// 					if (prevOwnerData.cityData.cities.length == 0) {
// 						prevOwner.getStatus().set(prevOwner, PLAYER_STATUS.NOMAD);
// 					}
// 				}

// 				if (owner) {
// 					const ownerData: PlayerRoundDataType = owner.getRoundData().data;

// 					ownerData.cityData.cities.push(city);
// 					ownerData.cityData.maxCities = Math.max(ownerData.cityData.maxCities, ownerData.cityData.cities.length);

// 					if (ownerData.countries.has(country)) {
// 						ownerData.countries.set(country, ownerData.countries.get(country) + 1);
// 					} else {
// 						ownerData.countries.set(country, 1);
// 					}

// 					if (ownerData.countries.get(country) == country.getCities().length) {
// 						country.setOwner(owner);

// 						Scoreboards.forEach((board) => {
// 							board.setAlert(
// 								`${NameManager.getInstance().getDisplayName(owner.getPlayer())} claimed ${HexColors.TANGERINE}${country.getName()}|r`
// 							);
// 						});
// 					}

// 					if (RoundManager.getInstance().isGameActive()) VictoryManager.getInstance().setLeader(owner);

// 					Scoreboards.forEach((board) => {
// 						board.setTitle(
// 							`${NameManager.getInstance().getDisplayName(VictoryManager.getInstance().leader.getPlayer())} ${
// 								VictoryManager.getInstance().leader.getRoundData().data.cityData.cities.length
// 							}/${CITIES_TO_WIN} `
// 						);
// 					});
// 				}
// 			} catch (error) {
// 				print(error);
// 			}

// 			return false;
// 		})
// 	);
// }
