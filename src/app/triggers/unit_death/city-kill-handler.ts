import { SmallSearchRadius } from './search-radii';
import { City } from 'src/app/city/city';
import { ReplaceGuard } from './replace-guard';
import { UNIT_ID } from 'src/configs/unit-id';

export function CityKillHandler(city: City, dyingUnit: unit, killingUnit: unit): boolean {
	if (!IsUnitType(killingUnit, UNIT_TYPE_STRUCTURE)) return null;

	const searchGroup: group = CreateGroup();

	//Search for owned units in small radius of dying guard
	const x: number = GetUnitX(dyingUnit);
	const y: number = GetUnitY(dyingUnit);

	GroupEnumUnitsInRange(
		searchGroup,
		x,
		y,
		SmallSearchRadius,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitAlly(GetFilterUnit(), city.getOwner()))
	);

	//Could not find valid units within small radius of guard
	if (BlzGroupGetSize(searchGroup) <= 0) {
		CreateUnit(city.getOwner(), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
	}

	//Found valid guard units, set unit as guard
	if (BlzGroupGetSize(searchGroup) >= 1) {
		ReplaceGuard(city, searchGroup);
		DestroyGroup(searchGroup);
		return true;
	}

	DestroyGroup(searchGroup);
	return false;
}
