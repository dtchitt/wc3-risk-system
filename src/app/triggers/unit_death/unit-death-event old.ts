// import { UNIT_ID } from 'src/configs/unit-id';
// import { UnitToCity } from '../../city/city-map';
// import { LandCity } from '../../city/land-city';
// import { PortCity } from '../../city/port-city';
// import { GetUnitsInRangeByAllegiance } from '../../utils/guard-filters';
// import { UNIT_TYPE } from '../../utils/unit-types';

// function guardDeath(dyingUnit: unit, killingUnit: unit) {
// 	const city: LandCity | PortCity = UnitToCity.get(dyingUnit);

// 	if (!city) return;

// 	const g: group = CreateGroup();
// 	let guardChoice: unit = null;

// 	if (IsUnitEnemy(killingUnit, city.getOwner())) {
// 		GetUnitsInRangeByAllegiance(g, city, smallRadius, IsUnitOwnedByPlayer);

// 		if (BlzGroupGetSize(g) >= 1) {
// 			guardChoice = GroupPickRandomUnit(g);
// 		} else {
// 			GetUnitsInRangeByAllegiance(g, city, smallRadius, IsUnitAlly);

// 			if (BlzGroupGetSize(g) >= 1) {
// 				guardChoice = GroupPickRandomUnit(g);
// 			} else {
// 				GetUnitsInRangeByAllegiance(
// 					g,
// 					city,
// 					largeRadius,
// 					(filterUnit, player) => IsUnitEnemy(filterUnit, player) && IsUnitAlly(filterUnit, GetOwningPlayer(dyingUnit)),
// 					dyingUnit
// 				);

// 				if (BlzGroupGetSize(g) >= 1) {
// 					guardChoice = GroupPickRandomUnit(g);
// 				} else if (IsUnitType(killingUnit, UNIT_TYPE.CITY)) {
// 					guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
// 				}
// 			}
// 		}
// 	}

// 	if (guardChoice == null) {
// 		GroupEnumUnitsInRange(
// 			g,
// 			GetUnitX(killingUnit),
// 			GetUnitY(killingUnit),
// 			smallRadius,
// 			Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitOwnedByPlayer(GetFilterUnit(), GetOwningPlayer(killingUnit)))
// 		);

// 		if (BlzGroupGetSize(g) >= 1) {
// 			guardChoice = GroupPickRandomUnit(g);
// 			foundValidUnits(g, city, guardChoice);
// 		} else {
// 			if (IsUnitType(killingUnit, UNIT_TYPE.SHIP) && !city.isPort()) {
// 				guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
// 				//TODO look for nearby friendly unis to killer
// 			} else {
// 				if (IsUnitType(killingUnit, UNIT_TYPE.CITY)) {
// 					guardChoice = CreateUnit(GetOwningPlayer(dyingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
// 				} else {
// 					guardChoice = CreateUnit(GetOwningPlayer(killingUnit), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
// 				}
// 			}

// 			foundValidUnits(g, city, guardChoice);
// 		}
// 	} else {
// 		foundValidUnits(g, city, guardChoice);
// 	}

// 	UnitToCity.delete(dyingUnit);
// 	DestroyGroup(g);
// }
