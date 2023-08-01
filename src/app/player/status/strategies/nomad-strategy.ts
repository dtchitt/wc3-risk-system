import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';

export class NomadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isLeft()) return;
		if (gamePlayer.trackedData.units.size <= 0) return gamePlayer.status.set(PLAYER_STATUS.DEAD);

		gamePlayer.status.status = PLAYER_STATUS.NOMAD;
		gamePlayer.trackedData.income.income = 4;

		const tick: number = 1;
		const nomadTimer: timer = CreateTimer();
		gamePlayer.status.statusDuration = 60;

		TimerStart(nomadTimer, tick, true, () => {
			if (!gamePlayer.status.isNomad() || gamePlayer.trackedData.cities.cities.length >= 1) {
				gamePlayer.status.set(PLAYER_STATUS.ALIVE);
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
