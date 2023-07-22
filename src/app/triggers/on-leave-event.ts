import { City } from '../city/city';
import { RegionToCity } from '../city/city-map';
import { UNIT_ID } from '../../configs/unit-id';
import { UNIT_TYPE } from '../utils/unit-types';
import { FilterOwnedUnits, FilterAlliedUnits } from '../utils/guard-filters';
import { CityRegionSize } from 'src/configs/city-settings';

export const LeaveRegionEvent: trigger = CreateTrigger();

export function onLeave() {
	TriggerAddCondition(
		LeaveRegionEvent,
		Condition(() => {
			if (!IsUnitType(GetTriggerUnit(), UNIT_TYPE.GUARD)) return false;

			const city: City = RegionToCity.get(GetTriggeringRegion());
			let g: group = CreateGroup();
			let guardChoice: unit = city.guard.unit;

			//Filter for owned guards
			FilterOwnedUnits(g, city, CityRegionSize);

			//No valid owned guards found, check for allies
			if (BlzGroupGetSize(g) == 0) FilterAlliedUnits(g, city, CityRegionSize);

			//No valid owned or allied guards found, create a dummy for city owner.
			if (BlzGroupGetSize(g) == 0 && !city.isValidGuard(guardChoice)) {
				guardChoice = CreateUnit(city.getOwner(), UNIT_ID.DUMMY_GUARD, city.guard.defaultX, city.guard.defaultY, 270);
			} else {
				ForGroup(g, () => {
					// guardChoice = CompareUnitByValue(GetEnumUnit(), guardChoice); // TODO
				});
			}

			city.guard.replace(guardChoice);

			DestroyGroup(g);
			g = null;
			guardChoice = null;

			return false;
		})
	);
}
