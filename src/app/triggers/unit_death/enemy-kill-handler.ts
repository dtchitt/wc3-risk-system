import { GetUnitsInRangeByAllegiance, GetUnitsInRangeOfUnitByAllegiance } from 'src/app/utils/guard-filters';
import { LargeSearchRadius, SmallSearchRadius } from './search-radii';
import { City } from 'src/app/city/city';
import { ReplaceGuard } from './replace-guard';

export function EnemyKillHandler(city: City, dyingUnit: unit, killingUnit: unit): boolean {
	if (!IsUnitEnemy(killingUnit, city.getOwner())) return null;

	const searchGroup: group = CreateGroup();

	//Search for city owned units within CoP of city
	GetUnitsInRangeByAllegiance(searchGroup, city, SmallSearchRadius, IsUnitOwnedByPlayer);

	//Found city owned units within CoP
	if (BlzGroupGetSize(searchGroup) >= 1) {
		ReplaceGuard(city, searchGroup);
		return true;
	}

	//No city owned units found, Search for allied units of killer in large radius of dying guard
	GetUnitsInRangeOfUnitByAllegiance(searchGroup, city, LargeSearchRadius, IsUnitAlly, dyingUnit, killingUnit);

	//Could not find valid units within large radius of guard, so we search in small radius by killer
	if (BlzGroupGetSize(searchGroup) <= 0) {
		GetUnitsInRangeOfUnitByAllegiance(searchGroup, city, LargeSearchRadius, IsUnitAlly, dyingUnit, killingUnit);
	}

	//Found valid guard units, set unit as guard
	if (BlzGroupGetSize(searchGroup) >= 1) {
		ReplaceGuard(city, searchGroup);
		return true;
	}

	//Could not find valid allied of guard, clean up and return false.
	DestroyGroup(searchGroup);
	return false;
}
