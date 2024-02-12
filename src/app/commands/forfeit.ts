import { PlayerManager } from '../entity/player/player-manager';
import { PLAYER_STATUS } from '../entity/player/status/status-enum';
import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';

export function ForfeitCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-ff', '-forfeit'], () => {
		if (!gameManager.isStateMetaGame()) return;

		playerManager.getPlayerMap().get(GetTriggerPlayer()).getStatus().set(PLAYER_STATUS.DEAD);
	});
}
