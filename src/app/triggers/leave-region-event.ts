import { City } from '../city/city';
import { RegionToCity, UnitToCity } from '../city/city-map';
import { UNIT_ID } from '../../configs/unit-id';
import { UNIT_TYPE } from '../utils/unit-types';
import { CityRegionSize } from 'src/configs/city-settings';
import { CompareUnitByValue } from '../utils/unit-comparisons';
import { GetUnitsInRangeByAllegiance } from '../utils/guard-filters';

export const LeaveRegionTrigger: trigger = CreateTrigger();

export function LeaveRegionEvent() {
	TriggerAddCondition(
		LeaveRegionTrigger,
		Condition(() => {
			if (!IsUnitType(GetTriggerUnit(), UNIT_TYPE.GUARD)) return false;

			const city: City = RegionToCity.get(GetTriggeringRegion());
			let g: group = CreateGroup();
			let guardChoice: unit = city.getGuard().getUnit();

			//Filter for owned guards
			GetUnitsInRangeByAllegiance(g, city, CityRegionSize, IsUnitOwnedByPlayer);

			//No valid owned guards found, check for allies
			if (BlzGroupGetSize(g) == 0) GetUnitsInRangeByAllegiance(g, city, CityRegionSize, IsUnitAlly);

			//No valid owned or allied guards found, create a dummy for city owner.
			if (BlzGroupGetSize(g) == 0 && !city.isValidGuard(guardChoice)) {
				guardChoice = CreateUnit(city.getOwner(), UNIT_ID.DUMMY_GUARD, city.getGuard().getDefaultX(), city.getGuard().getDefaultY(), 270);
			} else {
				ForGroup(g, () => {
					guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice);
				});
			}

			UnitToCity.delete(city.getGuard().getUnit());
			city.getGuard().replace(guardChoice);
			UnitToCity.set(guardChoice, city);
			DestroyGroup(g);
			g = null;
			guardChoice = null;

			return false;
		})
	);
}
