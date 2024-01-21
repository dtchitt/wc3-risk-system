import { STARTING_INCOME } from 'src/configs/game-settings';
import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class AliveStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (GetPlayerSlotState(gamePlayer.getPlayer()) == PLAYER_SLOT_STATE_LEFT) return gamePlayer.status.set(PLAYER_STATUS.LEFT);

		gamePlayer.status.status = PLAYER_STATUS.ALIVE;
		gamePlayer.trackedData.income.income = STARTING_INCOME;

		if (gamePlayer.trackedData.income.max == 0) {
			gamePlayer.trackedData.income.max = STARTING_INCOME;
		}
	}
}
