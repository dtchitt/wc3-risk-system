import { ActivePlayer } from '../../types/active-player';
import { StatusStrategy } from './status-strategy';
import { EventEmitter } from 'src/app/utils/events/event-emitter';
import { EVENT_ON_PLAYER_DEAD } from 'src/app/utils/events/event-constants';
import { MatchData } from 'src/app/game/state/match-state';

export class DeadStrategy implements StatusStrategy {
	run(gamePlayer: ActivePlayer): void {
		if (gamePlayer.status.isDead() || gamePlayer.status.isLeft()) return;
		if (MatchData.matchState != 'inProgress') return;
		EventEmitter.getInstance().emit(EVENT_ON_PLAYER_DEAD, gamePlayer);
	}
}
