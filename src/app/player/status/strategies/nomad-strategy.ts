import { NOMAD_DURATION } from 'src/configs/game-settings';
import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';
import { EventEmitter } from 'src/app/utils/event-emitter';
import { AliveStrategy } from './alive-strategy';
import { LeftStrategy } from './left-strategy';
import { DeadStrategy } from './dead-strategy';

export class NomadStrategy implements StatusStrategy {
	public static EVENT_ON_PLAYER_NOMAD = 'onPlayerNomad';

	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isLeft()) return;
		if (gamePlayer.trackedData.units.size <= 0) {
			gamePlayer.status.set(PLAYER_STATUS.DEAD);
			EventEmitter.getInstance().emit(DeadStrategy.EVENT_ON_PLAYER_DEAD, gamePlayer);
			return;
		}

		gamePlayer.status.status = PLAYER_STATUS.NOMAD;
		EventEmitter.getInstance().emit(NomadStrategy.EVENT_ON_PLAYER_NOMAD, gamePlayer);
		gamePlayer.trackedData.income.income = 4;

		const tick: number = 1;
		const nomadTimer: timer = CreateTimer();
		gamePlayer.status.statusDuration = NOMAD_DURATION;

		TimerStart(nomadTimer, tick, true, () => {
			if (!gamePlayer.status.isAlive() && gamePlayer.trackedData.cities.cities.length >= 1) {
				if (GetPlayerSlotState(gamePlayer.getPlayer()) == PLAYER_SLOT_STATE_LEFT) {
					gamePlayer.status.set(PLAYER_STATUS.LEFT);
					EventEmitter.getInstance().emit(LeftStrategy.EVENT_ON_PLAYER_LEFT, gamePlayer);
				} else {
					gamePlayer.status.set(PLAYER_STATUS.ALIVE);
					EventEmitter.getInstance().emit(AliveStrategy.EVENT_ON_PLAYER_ALIVE, gamePlayer);
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
					EventEmitter.getInstance().emit(LeftStrategy.EVENT_ON_PLAYER_LEFT, gamePlayer);
				} else {
					gamePlayer.status.set(PLAYER_STATUS.DEAD);
					EventEmitter.getInstance().emit(DeadStrategy.EVENT_ON_PLAYER_DEAD, gamePlayer);
				}

				PauseTimer(nomadTimer);
				DestroyTimer(nomadTimer);
			} else if (gamePlayer.status.isNomad()) {
				gamePlayer.status.statusDuration--;

				if (gamePlayer.status.statusDuration <= 0 || gamePlayer.trackedData.units.size <= 0) {
					gamePlayer.status.set(PLAYER_STATUS.DEAD);
					EventEmitter.getInstance().emit(DeadStrategy.EVENT_ON_PLAYER_DEAD, gamePlayer);
					PauseTimer(nomadTimer);
					DestroyTimer(nomadTimer);
				}
			}
		});
	}
}
