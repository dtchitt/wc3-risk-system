import { City } from '../city/city';

export function GetUnitsInRangeByAllegiance(
	g: group,
	city: City,
	radius: number,
	allegianceCheck: (filterUnit: unit, player: player) => boolean,
	unit?: unit
) {
	const x: number = !unit ? city.guard.defaultX : GetUnitX(unit);
	const y: number = !unit ? city.guard.defaultY : GetUnitY(unit);

	GroupEnumUnitsInRange(
		g,
		x,
		y,
		radius,
		Filter(() => city.isValidGuard(GetFilterUnit()) && allegianceCheck(GetFilterUnit(), city.getOwner()))
	);
}

// export function GetOwnedUnitsInRangeOfCity(g: group, city: City, range: number) {
// 	GroupEnumUnitsInRange(
// 		g,
// 		city.guard.defaultX,
// 		city.guard.defaultY,
// 		range,
// 		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitOwnedByPlayer(GetFilterUnit(), city.getOwner()))
// 	);
// }

// export function GetAlliedUnitsInRangeOfCity(g: group, city: City, range: number) {
// 	GroupEnumUnitsInRange(
// 		g,
// 		city.guard.defaultX,
// 		city.guard.defaultY,
// 		range,
// 		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitAlly(GetFilterUnit(), city.getOwner()))
// 	);
// }

// export function GetEnemyUnitsInRangeOfCity(g: group, city: City, range: number) {
// 	GroupEnumUnitsInRange(
// 		g,
// 		city.guard.defaultX,
// 		city.guard.defaultY,
// 		range,
// 		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitEnemy(GetFilterUnit(), city.getOwner()))
// 	);
// }

export function GetEnemyUnitsInRangeOfUnit(g: group, city: City, radius: number, unit: unit) {
	GroupEnumUnitsInRange(
		g,
		GetUnitX(unit),
		GetUnitY(unit),
		radius,
		Filter(() => city.isValidGuard(GetFilterUnit()) && IsUnitEnemy(GetFilterUnit(), city.getOwner()))
	);
}
