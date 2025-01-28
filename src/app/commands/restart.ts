import { GameManager } from '../game/game-manager';
import { MatchData } from '../game/state/match-state';
import { ChatManager } from '../managers/chat-manager';
import { EventEmitter } from '../utils/events/event-emitter';
import { EVENT_GAME_RESTART, EVENT_ON_REMATCH } from '../utils/events/event-constants';
import { SettingsContext } from '../settings/settings-context';

export function RestartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], async () => {
		if (MatchData.matchState != 'postMatch') return;
		if (!SettingsContext.getInstance().isPromode()) return;

		const eventEmitter = EventEmitter.getInstance();
		eventEmitter.emit(EVENT_GAME_RESTART);
		eventEmitter.emit(EVENT_ON_REMATCH);
	});
}
