import { NOMAD_DURATION, TURN_DURATION_SECONDS } from 'src/configs/game-settings';
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
		gamePlayer.status.statusDuration = NOMAD_DURATION;

		TimerStart(nomadTimer, tick, true, () => {
			if (!gamePlayer.status.isAlive() && gamePlayer.trackedData.cities.cities.length >= 1) {
				if (GetPlayerSlotState(gamePlayer.getPlayer()) == PLAYER_SLOT_STATE_LEFT) {
					gamePlayer.status.set(PLAYER_STATUS.LEFT);
				} else {
					gamePlayer.status.set(PLAYER_STATUS.ALIVE);

					gamePlayer.trackedData.countries.forEach((val, country) => {
						if (country.getOwner() == gamePlayer.getPlayer()) {
							gamePlayer.trackedData.income.income += country.getCities().length;
						}
					});
				}

				PauseTimer(nomadTimer);
				DestroyTimer(nomadTimer);
			} else if (gamePlayer.trackedData.cities.cities.length <= 0 && gamePlayer.trackedData.units.size <= 0) {
				if (GetPlayerSlotState(gamePlayer.getPlayer()) == PLAYER_SLOT_STATE_LEFT) {
					gamePlayer.status.set(PLAYER_STATUS.LEFT);
				} else {
					gamePlayer.status.set(PLAYER_STATUS.DEAD);
				}

				PauseTimer(nomadTimer);
				DestroyTimer(nomadTimer);
			} else if (gamePlayer.status.isNomad()) {
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
