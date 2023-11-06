import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';

export class DeadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isDead() || gamePlayer.status.isLeft()) return;

		gamePlayer.status.status = PLAYER_STATUS.DEAD;
		gamePlayer.setEndData();
		gamePlayer.trackedData.income.income = 1;
		VictoryManager.getInstance().removePlayer(gamePlayer);
		GlobalMessage(
			`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has been defeated!`,
			'Sound\\Interface\\SecretFound.flac'
		);
	}
}
