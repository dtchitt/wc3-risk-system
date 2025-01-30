import { MatchData } from '../game/state/match-state';
import { ChatManager } from '../managers/chat-manager';
import { EventEmitter } from '../utils/events/event-emitter';
import { EVENT_GAME_RESTART } from '../utils/events/event-constants';
import { PlayerManager } from '../player/player-manager';

export function RestartCommand(chatManager: ChatManager) {
	chatManager.addCmd(['-ng'], async () => {
		if (MatchData.matchState != 'postMatch') return;
		EventEmitter.getInstance().emit(EVENT_GAME_RESTART, PlayerManager.getInstance().players.get(GetTriggerPlayer()));
	});
}
