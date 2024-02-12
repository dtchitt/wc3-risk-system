import { PlayerManager } from '../entity/player/player-manager';
import { PLAYER_STATUS } from '../entity/player/status/status-enum';
import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { ErrorMsg } from '../utils/messages';

export function MuteCommand(chatManager: ChatManager, gameManager: GameManager, nameManager: NameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-stfu', '-mute'], () => {
		if (!gameManager.isStateMetaGame()) return;

		const players: player[] = nameManager.getPlayersByAnyName(GetEventPlayerChatString().split(' ')[1]);
		const player: player = GetTriggerPlayer();

		if (players.length >= 2) {
			ErrorMsg(player, 'Multiple players found, be more specific!');
		} else if (players.length <= 0) {
			ErrorMsg(player, 'Player not found!', 2);
		} else if (playerManager.getPlayerMap().get(players[0]).isAdmin()) {
			ErrorMsg(player, "You can't mute that player! :P");
		} else {
			playerManager.getPlayerMap().get(players[0]).getStatus().set(PLAYER_STATUS.STFU);
		}
	});
}
