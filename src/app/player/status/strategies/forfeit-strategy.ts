import { NameManager } from 'src/app/managers/names/name-manager';
import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { PLAYER_STATUS } from '../status-enum';
import { GlobalMessage } from 'src/app/utils/messages';

export class ForfeitStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isDead() || gamePlayer.status.isForfeit()) return;

		gamePlayer.status.status = PLAYER_STATUS.FORFEIT;
		gamePlayer.setEndData();
		gamePlayer.trackedData.income.income = 2;
		VictoryManager.getInstance().removePlayer(gamePlayer);
		GlobalMessage(
			`${NameManager.getInstance().getDisplayName(gamePlayer.getPlayer())} has forfeit the game!`,
			'Sound\\Interface\\SecretFound.flac'
		);

		//PlayLocalSound('Sounds\\UR_DONE.mp3', gamePlayer.getPlayer());
	}
}
