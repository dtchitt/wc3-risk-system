import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';

export class LeftStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isLeft()) return;

		if (gamePlayer.status.isDead() || gamePlayer.status.isSTFU()) {
			gamePlayer.status.status = PLAYER_STATUS.LEFT;
			return;
		}

		gamePlayer.status.status = PLAYER_STATUS.LEFT;
		gamePlayer.setEndData();
		gamePlayer.trackedData.income.income = 0;
		GlobalMessage(
			`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has left the game!`,
			'Sound\\Interface\\SecretFound.flac'
		);
		VictoryManager.getInstance().removePlayer(gamePlayer);
	}
}
