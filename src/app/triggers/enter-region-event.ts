import { CityRegionSize } from 'src/configs/city-settings';
import { City } from '../city/city';
import { RegionToCity, UnitToCity } from '../city/city-map';
import { UNIT_TYPE } from '../utils/unit-types';
import { DistanceBetweenCoords } from '../utils/utils';

export const EnterRegionTrigger: trigger = CreateTrigger();
const guardDistanceAllowed: number = CityRegionSize / 2 + 20;

export function EnterRegionEvent() {
	TriggerAddCondition(
		EnterRegionTrigger,
		Condition(() => {
			if (IsUnitType(GetTriggerUnit(), UNIT_TYPE.TRANSPORT)) return false;

			const city: City = RegionToCity.get(GetTriggeringRegion());

			if (
				city.isValidGuard(city.guard.unit) &&
				DistanceBetweenCoords(GetUnitX(city.guard.unit), GetUnitY(city.guard.unit), city.guard.defaultX, city.guard.defaultY) <
					guardDistanceAllowed
			)
				return false;

			UnitToCity.delete(city.guard.unit);

			if (IsUnitEnemy(GetTriggerUnit(), city.getOwner())) {
				city.setOwner(GetOwningPlayer(GetTriggerUnit()));
			}

			city.guard.replace(GetTriggerUnit());

			UnitToCity.set(city.guard.unit, city);

			return false;
		})
	);
}
