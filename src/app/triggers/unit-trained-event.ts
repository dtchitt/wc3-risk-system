import { UnitToCity } from '../city/city-map';

export const UnitTrainedEvent: trigger = CreateTrigger();

export function unitTrained() {
	TriggerAddCondition(
		UnitTrainedEvent,
		Condition(() => {
			//PlayerManager.getInstance().players.get(this.getOwner()).getRoundData().data.units.set(unit, unit); // TODO
			UnitToCity.get(GetTriggerUnit()).onUnitTrain(GetTrainedUnit());

			return false;
		})
	);
}
