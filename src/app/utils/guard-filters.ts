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
