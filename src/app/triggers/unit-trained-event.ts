import { UnitToCity } from '../city/city-map';
import { PlayerManager } from '../player/player-manager';
import { ActivePlayer } from '../player/types/active-player';

export const UnitTrainedEvent: trigger = CreateTrigger();

export function unitTrained() {
	TriggerAddCondition(
		UnitTrainedEvent,
		Condition(() => {
			const trainerUnit = GetTrainedUnit();
			const player: ActivePlayer = PlayerManager.getInstance().players.get(GetOwningPlayer(trainerUnit));

			player.trackedData.units.set(trainerUnit, trainerUnit);
			UnitToCity.get(GetTriggerUnit()).onUnitTrain(trainerUnit);

			return false;
		})
	);
}
