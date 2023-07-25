import { UnitToCity } from '../city/city-map';
import { PlayerManager } from '../player/player-manager';
import { ActivePlayer } from '../player/types/active-player';
import { UNIT_TYPE } from '../utils/unit-types';

export const UnitTrainedEvent: trigger = CreateTrigger();

export function unitTrained() {
	TriggerAddCondition(
		UnitTrainedEvent,
		Condition(() => {
			const trainerUnit = GetTrainedUnit();

			UnitToCity.get(GetTriggerUnit()).onUnitTrain(trainerUnit);

			const player: ActivePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(trainerUnit));

			if (!IsUnitType(trainerUnit, UNIT_TYPE.TRANSPORT)) {
				player.trackedData.units.add(trainerUnit);
			}

			return false;
		})
	);
}
