import { UnitToCity } from '../city/city-map';
import { GamePlayer } from '../entity/player/game-player';
import { PlayerManager } from '../entity/player/player-manager';
import { UNIT_TYPE } from '../utils/unit-types';

export const UnitTrainedTrigger: trigger = CreateTrigger();

export function UnitTrainedEvent() {
	TriggerAddCondition(
		UnitTrainedTrigger,
		Condition(() => {
			const trainedUnit = GetTrainedUnit();

			UnitToCity.get(GetTriggerUnit()).onUnitTrain(trainedUnit);

			const player: GamePlayer = PlayerManager.getInstance().getPlayerMap().get(GetOwningPlayer(trainedUnit));

			if (!IsUnitType(trainedUnit, UNIT_TYPE.TRANSPORT)) {
				player.getData().getUnits().add(trainedUnit);
			}

			return false;
		})
	);
}
