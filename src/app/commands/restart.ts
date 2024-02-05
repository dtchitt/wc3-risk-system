import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';

export function RestartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], () => {
		if (!gameManager.isStatePostGame()) return;
		if (!gameManager.isRestartEnabled()) return;

		print('Restarting...');
		gameManager.state.end();

		const resetTimer: timer = CreateTimer();

		TimerStart(resetTimer, 4, false, () => {
			FogEnable(true);
			gameManager.fastRestart();
			DestroyTimer(resetTimer);
		});
	});
}
