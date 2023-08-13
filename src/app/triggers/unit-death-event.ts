import { UNIT_ID } from 'src/configs/unit-id';
import { UnitToCity } from '../city/city-map';
import { LandCity } from '../city/land-city';
import { PortCity } from '../city/port-city';
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
const largeRadius: number = 550;

export function UnitDeathEvent() {
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

//TODO refactor this mess
function guardDeath(dyingUnit: unit, killingUnit: unit) {
	const city: LandCity | PortCity = UnitToCity.get(dyingUnit);

	if (!city) return;

	const g: group = CreateGroup();
	let guardChoice: unit = null;

	if (IsUnitEnemy(killingUnit, city.getOwner())) {
		GetUnitsInRangeByAllegiance(g, city, smallRadius, IsUnitOwnedByPlayer);

		if (BlzGroupGetSize(g) >= 1) {
			guardChoice = GroupPickRandomUnit(g);
		} else {
			GetUnitsInRangeByAllegiance(g, city, smallRadius, IsUnitAlly);

			if (BlzGroupGetSize(g) >= 1) {
				guardChoice = GroupPickRandomUnit(g);
			} else {
				GetUnitsInRangeByAllegiance(g, city, largeRadius, IsUnitEnemy, dyingUnit);

				if (BlzGroupGetSize(g) >= 1) {
					guardChoice = GroupPickRandomUnit(g);
				} else if (IsUnitType(killingUnit, UNIT_TYPE.CITY)) {
					guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
				}
			}
		}
	} else {
		GetUnitsInRangeByAllegiance(g, city, largeRadius, IsUnitOwnedByPlayer, dyingUnit);

		if (BlzGroupGetSize(g) >= 1) {
			guardChoice = GroupPickRandomUnit(g);
		} else {
			GetUnitsInRangeByAllegiance(g, city, largeRadius, IsUnitAlly, dyingUnit);

			if (BlzGroupGetSize(g) >= 1) {
				guardChoice = GroupPickRandomUnit(g);
			}
		}
	}

	if (guardChoice == null) {
		GroupEnumUnitsInRange(
			g,
			GetUnitX(killingUnit),
			GetUnitY(killingUnit),
			smallRadius,
			Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitOwnedByPlayer(GetFilterUnit(), GetOwningPlayer(killingUnit)))
		);

		if (BlzGroupGetSize(g) >= 1) {
			guardChoice = GroupPickRandomUnit(g);
			foundValidUnits(g, city, guardChoice);
		} else {
			if (IsUnitType(killingUnit, UNIT_TYPE.SHIP) && !city.isPort()) {
				guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
			} else {
				if (IsUnitType(killingUnit, UNIT_TYPE.CITY)) {
					guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
				} else {
					guardChoice = CreateUnit(GetOwningPlayer(killingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
				}
			}

			foundValidUnits(g, city, guardChoice);
		}
	} else {
		foundValidUnits(g, city, guardChoice);
	}

	UnitToCity.delete(dyingUnit);
	DestroyGroup(g);
}

function foundValidUnits(group: group, city: City, guardChoice: unit) {
	if (BlzGroupGetSize(group) <= 0) {
		GroupAddUnit(group, guardChoice);
	}

	ForGroup(group, () => {
		guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice);
	});

	if (IsUnitEnemy(guardChoice, city.getOwner())) {
		city.changeOwner(GetOwningPlayer(guardChoice));
	}

	city.guard.replace(guardChoice);
	UnitToCity.set(guardChoice, city);
}
