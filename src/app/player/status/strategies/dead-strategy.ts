import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';
import { EventEmitter } from 'src/app/utils/events/event-emitter';
import { EVENT_ON_PLAYER_DEAD } from 'src/app/utils/events/event-constants';

export class DeadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isDead() || gamePlayer.status.isLeft()) return;

		gamePlayer.status.status = PLAYER_STATUS.DEAD;
		gamePlayer.setEndData();
		gamePlayer.trackedData.income.income = 1;
		// VictoryManager.getInstance().removePlayer(gamePlayer, PLAYER_STATUS.DEAD);

		GlobalMessage(
			`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has been defeated!`,
			'Sound\\Interface\\SecretFound.flac'
		);

		EventEmitter.getInstance().emit(EVENT_ON_PLAYER_DEAD, gamePlayer);

		// MatchGameLoop.getInstance().onPlayerDead(gamePlayer);
	}
}
