import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class AliveStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		gamePlayer.status.status = PLAYER_STATUS.ALIVE;
		gamePlayer.trackedData.income.income = 4;
	}
}
