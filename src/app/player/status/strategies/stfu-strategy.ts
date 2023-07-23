import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class STFUStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isNomad() || gamePlayer.status.isAlive() || gamePlayer.status.isSTFU()) return;

		const oldStatus = gamePlayer.status.status;
		gamePlayer.status.status = PLAYER_STATUS.STFU;

		SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_OBSERVER, 1);

		gamePlayer.status.statusDuration = 300;
		const muteTimer: timer = CreateTimer();
		const tick: number = 1;

		TimerStart(muteTimer, tick, true, () => {
			if (gamePlayer.status.statusDuration <= 0) {
				SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_OBSERVER, 0);
				gamePlayer.status.status = oldStatus;
				PauseTimer(muteTimer);
				DestroyTimer(muteTimer);
			}

			gamePlayer.status.statusDuration--;
		});
	}
}
