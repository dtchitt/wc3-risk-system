import { City } from '../city/city';
import { RegionToCity } from '../city/city-map';
import { UNIT_TYPE } from '../utils/unit-types';

export const EnterRegionEvent: trigger = CreateTrigger();

export function onEnter() {
	TriggerAddCondition(
		EnterRegionEvent,
		Condition(() => {
			if (IsUnitType(GetTriggerUnit(), UNIT_TYPE.TRANSPORT)) return false;

			const city: City = RegionToCity.get(GetTriggeringRegion());

			if (city.isValidGuard(city.guard.unit)) return false;

			if (IsUnitEnemy(GetTriggerUnit(), city.getOwner())) {
				city.setOwner(GetOwningPlayer(GetTriggerUnit()));
			}

			city.guard.replace(GetTriggerUnit());

			return false;
		})
	);
}
