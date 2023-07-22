import { City } from '../city/city';

export function FilterOwnedUnits(g: group, city: City, range: number) {
	GroupEnumUnitsInRange(
		g,
		city.guard.defaultX,
		city.guard.defaultY,
		range,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitOwnedByPlayer(GetFilterUnit(), city.getOwner()))
	);
}

export function FilterAlliedUnits(g: group, city: City, range: number) {
	GroupEnumUnitsInRange(
		g,
		city.guard.defaultX,
		city.guard.defaultY,
		range,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitAlly(GetFilterUnit(), city.getOwner()))
	);
}

export function FilterEnemyUnitsFromCity(g: group, city: City, range: number) {
	GroupEnumUnitsInRange(
		g,
		city.guard.defaultX,
		city.guard.defaultY,
		range,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitEnemy(GetFilterUnit(), city.getOwner()))
	);
}

export function FilterEnemyUnitsFromUnit(g: group, city: City, unit: unit) {
	GroupEnumUnitsInRange(
		g,
		GetUnitX(unit),
		GetUnitY(unit),
		200,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitEnemy(GetFilterUnit(), city.getOwner()))
	);
}
