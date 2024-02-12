import { PlayerManager } from '../entity/player/player-manager';
import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { ShuffleArray } from '../utils/utils';

export function NamesCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager, nameManager: NameManager) {
	chatManager.addCmd(['-names', '-players'], () => {
		if (!gameManager.isStateMetaGame()) return;

		const player: player = GetTriggerPlayer();
		const nameList: player[] = [];

		playerManager.getPlayerMap().forEach((player) => {
			if (player.getStatus().isAlive() || player.getStatus().isNomad()) {
				nameList.push(player.getPlayer());
			}
		});

		ShuffleArray(nameList);

		const namesTimer: timer = CreateTimer();

		TimerStart(namesTimer, 0.75, true, () => {
			if (nameList.length > 0) {
				DisplayTimedTextToPlayer(player, 0, 0, 5, `${nameManager.getBtag(nameList.pop())}`);
			} else {
				PauseTimer(namesTimer);
				DestroyTimer(namesTimer);
			}
		});
	});
}
