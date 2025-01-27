import { GameManager } from '../game/game-manager';
import { MatchData } from '../game/state/match-state';
import { ChatManager } from '../managers/chat-manager';
import { EventEmitter } from '../utils/event-emitter';

export function RestartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], async () => {
		if (MatchData.matchState != 'postMatch') return;
		if (!gameManager.isRestartEnabled()) return;

		const eventEmitter = EventEmitter.getInstance();
		eventEmitter.emit('gameRestart');
		eventEmitter.emit('onRematch');
	});
}
