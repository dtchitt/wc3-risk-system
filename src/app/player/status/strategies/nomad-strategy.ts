import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class NomadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		gamePlayer.status.status = PLAYER_STATUS.NOMAD;
		gamePlayer.trackedData.income.income = 2;

		if (gamePlayer.trackedData.units.size == 0) {
			gamePlayer.status.set(PLAYER_STATUS.DEAD);
			return;
		}

		const tick: number = 1;
		const nomadTimer: timer = CreateTimer();
		gamePlayer.status.statusDuration = 60;

		TimerStart(nomadTimer, tick, true, () => {
			if (!gamePlayer.status.isNomad()) {
				PauseTimer(nomadTimer);
				DestroyTimer(nomadTimer);
			}

			if (gamePlayer.status.isNomad()) {
				gamePlayer.status.statusDuration--;

				if (gamePlayer.status.statusDuration <= 0 || gamePlayer.trackedData.units.size <= 0) {
					gamePlayer.status.set(PLAYER_STATUS.DEAD);
					PauseTimer(nomadTimer);
					DestroyTimer(nomadTimer);
				}
			}
		});
	}
}
