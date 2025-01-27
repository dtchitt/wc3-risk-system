import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';
import { EventEmitter } from 'src/app/utils/event-emitter';

export class LeftStrategy implements StatusStrategy {
	public static EVENT_ON_PLAYER_LEFT = 'onPlayerLeft';

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

		EventEmitter.getInstance().emit(LeftStrategy.EVENT_ON_PLAYER_LEFT, gamePlayer);
	}
}
