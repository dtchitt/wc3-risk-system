import { GameManager } from '../game/game-manager';
import { MatchGameLoop } from '../game/match-game-loop';
import { MatchData } from '../game/state/match-state';
import { ChatManager } from '../managers/chat-manager';

export function RestartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], async () => {
		if (MatchData.matchState != 'postMatch') return;
		if (!gameManager.isRestartEnabled()) return;

		print('Restarting...');
		MatchGameLoop.getInstance().onRematch();
		gameManager.fastRestart();
	});
}
