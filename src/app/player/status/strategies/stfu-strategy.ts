import { TimedEventManager } from 'src/app/libs/timer/timed-event-manager';
import { ActivePlayer } from '../../types/active-player';
import { PLAYER_STATUS } from '../status-enum';
import { StatusStrategy } from './status-strategy';
import { TimedEvent } from 'src/app/libs/timer/timed-event';

const STFU_DURATION: number = 300;

export class STFUStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isNomad() || gamePlayer.status.isAlive() || gamePlayer.status.isSTFU()) return;
		const oldStatus = gamePlayer.status.status;
		gamePlayer.status.status = PLAYER_STATUS.STFU;
		SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_OBSERVER, 1);
		gamePlayer.status.statusDuration = STFU_DURATION;

		const timedEventManager: TimedEventManager = TimedEventManager.getInstance();

		const event: TimedEvent = timedEventManager.registerTimedEvent(gamePlayer.status.statusDuration, () => {
			if (GetPlayerSlotState(gamePlayer.getPlayer()) == PLAYER_SLOT_STATE_LEFT) {
				gamePlayer.status.set(PLAYER_STATUS.LEFT);
				timedEventManager.removeTimedEvent(event);
			} else if (gamePlayer.status.statusDuration <= 1) {
				SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_OBSERVER, 0);
				gamePlayer.status.status = oldStatus;
				timedEventManager.removeTimedEvent(event);
			} else if (gamePlayer.status.isAlive()) {
				SetPlayerState(gamePlayer.getPlayer(), PLAYER_STATE_OBSERVER, 0);
				timedEventManager.removeTimedEvent(event);
			}

			gamePlayer.status.statusDuration--;
		});
	}
}
