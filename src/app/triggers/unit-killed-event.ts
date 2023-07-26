import { UNIT_ID } from 'src/configs/unit-id';
import { UnitToCity } from '../city/city-map';
import { LandCity } from '../city/land-city';
import { SeaCity } from '../city/sea-city';
import { GameManager } from '../game/game-manager';
import { TransportManager } from '../managers/transport-manager';
import { PlayerManager } from '../player/player-manager';
import { GamePlayer } from '../player/types/game-player';
import { SPANWER_UNITS } from '../spawner/spawner';
import { GetUnitsInRangeByAllegiance } from '../utils/guard-filters';
import { UNIT_TYPE } from '../utils/unit-types';
import { CompareUnitByValue } from '../utils/unit-comparisons';
import { City } from '../city/city';

const smallRadius: number = 235;
const largeRadius: number = 600;

export function onDeath() {
	const t: trigger = CreateTrigger();

	for (let i = 0; i < bj_MAX_PLAYER_SLOTS; i++) {
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_DEATH, null);
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			if (!GameManager.getInstance().isStateMetaGame()) return false;

			const dyingUnit: unit = GetTriggerUnit();
			const killingUnit: unit = GetKillingUnit();
			const dUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(dyingUnit));
			const kUnitOwner: GamePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(killingUnit));

			if (kUnitOwner) kUnitOwner.onKill(GetOwningPlayer(dyingUnit), dyingUnit);
			if (dUnitOwner) dUnitOwner.onDeath(GetOwningPlayer(killingUnit), dyingUnit);
			if (IsUnitType(dyingUnit, UNIT_TYPE.GUARD)) guardDeath(dyingUnit, killingUnit);

			TransportManager.getInstance().onDeath(killingUnit, dyingUnit);

			if (!dUnitOwner) return false;

			if (SPANWER_UNITS.has(dyingUnit)) SPANWER_UNITS.get(dyingUnit).onDeath(dUnitOwner.getPlayer(), dyingUnit);

			return false;
		})
	);
}

function guardDeath(dyingUnit: unit, killingUnit: unit) {
	const city: LandCity | SeaCity = UnitToCity.get(dyingUnit);

	if (!city) return;

	const g: group = CreateGroup();
	const radius = IsUnitAlly(killingUnit, city.getOwner()) || GetOwningPlayer(killingUnit) == city.getOwner() ? largeRadius : smallRadius;
	const allegianceChecks = [IsUnitOwnedByPlayer, IsUnitAlly, IsUnitEnemy];

	for (let func of allegianceChecks) {
		if (radius == smallRadius) {
			GetUnitsInRangeByAllegiance(g, city, radius, func);
		} else {
			GetUnitsInRangeByAllegiance(g, city, radius, func, dyingUnit);
		}

		if (BlzGroupGetSize(g) >= 1) {
			UnitToCity.delete(dyingUnit);
			foundValidUnits(g, city);
			return;
		}
	}

	if (UnitAlive(killingUnit)) {
		GetUnitsInRangeByAllegiance(g, city, smallRadius, IsUnitEnemy, killingUnit);
		if (BlzGroupGetSize(g) >= 1) {
			UnitToCity.delete(dyingUnit);
			foundValidUnits(g, city);
			return;
		}
	}

	let guard: unit = CreateUnit(GetOwningPlayer(killingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);

	if (IsUnitEnemy(guard, city.getOwner())) {
		city.changeOwner(GetOwningPlayer(guard));
	}

	city.guard.replace(guard);
	UnitToCity.delete(dyingUnit);
	UnitToCity.set(guard, city);
	DestroyGroup(g);
}

function foundValidUnits(group: group, city: City) {
	let guardChoice: unit = GroupPickRandomUnit(group);

	ForGroup(group, () => {
		guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice);
	});

	if (IsUnitEnemy(guardChoice, city.getOwner())) {
		city.changeOwner(GetOwningPlayer(guardChoice));
	}

	city.guard.replace(guardChoice);

	UnitToCity.set(guardChoice, city);
	DestroyGroup(group);
}
