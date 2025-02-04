import { City } from '../city/city';
import { UnitToCity } from '../city/city-map';
import { debugPrint } from '../utils/debug-print';
import { EVENT_ON_CITY_SELECTED } from '../utils/events/event-constants';
import { EventEmitter } from '../utils/events/event-emitter';
import { PLAYER_SLOTS } from '../utils/utils';

export function CapitalSelectedEvent() {
	const t: trigger = CreateTrigger();
	debugPrint('CapitalSelectedEvent');

	for (let i = 0; i < PLAYER_SLOTS; i++) {
		debugPrint('RegisteringPlayerUnitEvent');
		TriggerRegisterPlayerUnitEvent(t, Player(i), EVENT_PLAYER_UNIT_SELECTED);
		debugPrint('RegisteredPlayerUnitEvent');
	}

	TriggerAddCondition(
		t,
		Condition(() => {
			debugPrint('CapitalSelectedEvent');
			const city: City = UnitToCity.get(GetTriggerUnit());
			EventEmitter.getInstance().emit(EVENT_ON_CITY_SELECTED, city, GetTriggerPlayer());
		})
	);
}
