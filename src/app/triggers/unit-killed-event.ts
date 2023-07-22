// import { UnitToCity } from '../city/city-map';
// import { LandCity } from '../city/land-city';
// import { SeaCity } from '../city/sea-city';
// import { TransportManager } from '../managers/transport-manager';
// import { PlayerManager } from '../player/player-manager';
// import { GamePlayer } from '../player/types/game-player';
// import { SPANWER_UNITS } from '../spawner/spawner-map';
// import { CompareUnitByValue } from '../utils/unit-comparisons';
// import { UNIT_ID } from '../../configs/unit-id';
// import { UNIT_TYPE } from '../utils/unit-types';
// import { FilterOwnedUnits, FilterAlliedUnits, FilterEnemyUnitsFromCity, FilterEnemyUnitsFromUnit } from '../utils/guard-filters';
// import { RoundManager } from '../game/round-manager';

// export function onDeath() {
// 	const t: trigger = CreateTrigger();

// 	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
// 		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
// 	}

// 	TriggerAddCondition(
// 		t,
// 		Condition(() => {
// 			if (!RoundManager.getInstance().isGameActive()) return false;

// 			const dyingUnit: unit = GetTriggerUnit();
// 			const killingUnit: unit = GetKillingUnit();
// 			const dUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(dyingUnit));
// 			const kUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(killingUnit));

// 			if (kUnitOwner) kUnitOwner.onKill(GetOwningPlayer(dyingUnit), dyingUnit);
// 			if (dUnitOwner) dUnitOwner.onDeath(GetOwningPlayer(killingUnit), dyingUnit);
// 			if (IsUnitType(dyingUnit, UNIT_TYPE.GUARD)) guardDeath(dyingUnit, killingUnit);

// 			TransportManager.getInstance().onDeath(killingUnit, dyingUnit);

// 			if (!dUnitOwner) return false;
// 			if (SPANWER_UNITS.has(dyingUnit)) SPANWER_UNITS.get(dyingUnit).onDeath(dUnitOwner, dyingUnit);

// 			return false;
// 		})
// 	);
// }

// //TODO add logic to prevent arts from being able to auto move to guard
// function guardDeath(dyingUnit: unit, killingUnit: unit) {
// 	const city: LandCity | SeaCity = UnitToCity.get(dyingUnit);

// 	if (!city) return;

// 	let g: group = CreateGroup();
// 	let guardChoice: unit = null;
// 	let radius: number = 235;

// 	if (city.getOwner() == GetOwningPlayer(killingUnit) || IsPlayerAlly(city.getOwner(), GetOwningPlayer(killingUnit))) {
// 		radius = 600;
// 	}

// 	FilterOwnedUnits(g, city, radius);

// 	if (BlzGroupGetSize(g) == 0) FilterAlliedUnits(g, city, radius);

// 	if (BlzGroupGetSize(g) == 0) {
// 		if (IsUnitType(killingUnit, UNIT_TYPE.SHIP)) {
// 			radius = 700;
// 		} else {
// 			radius = 600;
// 		}

// 		FilterEnemyUnitsFromCity(g, city, radius);
// 	}

// 	if (BlzGroupGetSize(g) == 0 && UnitAlive(killingUnit)) {
// 		FilterEnemyUnitsFromUnit(g, city, killingUnit);
// 	}

// 	if (BlzGroupGetSize(g) == 0 && !IsUnitType(killingUnit, UNIT_TYPE.CITY)) {
// 		guardChoice = CreateUnit(GetOwningPlayer(killingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
// 	} else {
// 		guardChoice = GroupPickRandomUnit(g);

// 		ForGroup(g, () => {
// 			guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice);
// 		});
// 	}

// 	if (IsUnitEnemy(guardChoice, GetOwningPlayer(city.guard.unit))) {
// 		city.changeOwner(GetOwningPlayer(guardChoice));
// 	}

// 	city.guard.replace(guardChoice);

// 	UnitToCity.delete(dyingUnit);
// 	UnitToCity.set(guardChoice, city);
// 	DestroyGroup(g);
// }
