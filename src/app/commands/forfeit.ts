import { GameManager } from '../game/game-manager';
import { MatchGameLoop } from '../game/match-game-loop';
import { MatchData } from '../game/state/match-state';
import { ChatManager } from '../managers/chat-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';

export function ForfeitCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-ff', '-forfeit'], () => {
		if (MatchData.matchState != 'inProgress') return;

		const playerStatus = MatchData.getPlayerStatus(playerManager.players.get(GetTriggerPlayer()));
		if (playerStatus.isDead() || playerStatus.isLeft() || playerStatus.isSTFU()) return;

		playerManager.players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.DEAD);
		MatchGameLoop.getInstance().onPlayerForfeit(playerManager.players.get(GetTriggerPlayer()));
		MatchGameLoop.getInstance().onPlayerElimination(playerManager.players.get(GetTriggerPlayer()));
	});
}
