import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';

export function ForfeitCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-ff', '-forfeit'], () => {
		if (!GameManager.isMatchInProgress()) return;

		playerManager.players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.DEAD);
	});
}
