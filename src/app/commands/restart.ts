import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';

export function RestartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], async () => {
		if (!GameManager.isMatchPostStage()) return;
		if (!gameManager.isRestartEnabled()) return;

		print('Restarting...');
		gameManager.fastRestart();
	});
}
