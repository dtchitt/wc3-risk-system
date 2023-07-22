import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class NomadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		gamePlayer.trackedData.income.income = 2;

		if (gamePlayer.trackedData.units.size == 0) {
			gamePlayer.status.set(PLAYER_STATUS.DEAD);
			return;
		}

		const tick: number = 1;
		const nomadTimer: timer = CreateTimer();
		let duration: number = 60;

		TimerStart(nomadTimer, tick, false, () => {
			if (!gamePlayer.status.isNomad()) {
				PauseTimer(nomadTimer);
				DestroyTimer(nomadTimer);
			}

			if (gamePlayer.status.isNomad()) {
				gamePlayer.status.statusDuration = duration;

				duration--;

				if (duration <= 0 || gamePlayer.trackedData.units.size <= 0) {
					gamePlayer.status.set(PLAYER_STATUS.DEAD);
					PauseTimer(nomadTimer);
					DestroyTimer(nomadTimer);
				}
			}
		});
	}
}
