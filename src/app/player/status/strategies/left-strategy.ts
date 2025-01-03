import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';
import { GameManager } from 'src/app/game/game-manager';

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
		GameManager.getInstance().removePlayer(gamePlayer);
	}
}
