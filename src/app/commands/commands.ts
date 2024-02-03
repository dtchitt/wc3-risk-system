import { GameManager } from '../game/game-manager';
import CameraManager from '../managers/camera-manager';
import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ErrorMsg } from '../utils/messages';
import { ShuffleArray } from '../utils/utils';

export function SetCommands(gameManager: GameManager) {
	const chatManager: ChatManager = ChatManager.getInstance();
	const playerManager: PlayerManager = PlayerManager.getInstance();
	const nameManager: NameManager = NameManager.getInstance();

	camCommand(chatManager);
	forfeitCommand(chatManager, gameManager, playerManager);
	muteCommand(chatManager, gameManager, nameManager, playerManager);
	restartCommand(chatManager, gameManager);
	playersCommand(chatManager, gameManager, playerManager, nameManager);
}

function camCommand(chatManager: ChatManager) {
	chatManager.addCmd(['-cam', '-zoom'], () => CameraManager.getInstance().update(GetTriggerPlayer()));
}

function forfeitCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-ff', '-forfeit'], () => {
		if (!gameManager.isStateMetaGame()) return;

		playerManager.players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.DEAD);
	});
}

function muteCommand(chatManager: ChatManager, gameManager: GameManager, nameManager: NameManager, playerManager: PlayerManager) {
	chatManager.addCmd(['-stfu', '-mute'], () => {
		if (!gameManager.isStateMetaGame()) return;

		const players: player[] = nameManager.getPlayersByAnyName(GetEventPlayerChatString().split(' ')[1]);
		const player: player = GetTriggerPlayer();

		if (players.length >= 2) {
			ErrorMsg(player, 'Multiple players found, be more specific!');
		} else if (players.length <= 0) {
			ErrorMsg(player, 'Player not found!', 2);
		} else if (playerManager.players.get(players[0]).isAdmin()) {
			ErrorMsg(player, "You can't mute that player! :P");
		} else {
			playerManager.players.get(players[0]).status.set(PLAYER_STATUS.STFU);
		}
	});
}

function restartCommand(chatManager: ChatManager, gameManager: GameManager) {
	chatManager.addCmd(['-ng'], () => {
		if (!gameManager.isStatePostGame()) return;
		if (!gameManager.isRestartEnabled()) return;

		//TODO player feedback via a message.
		gameManager.state.end();

		const resetTimer: timer = CreateTimer();

		TimerStart(resetTimer, 4, false, () => {
			FogEnable(true);
			gameManager.fastRestart();
			DestroyTimer(resetTimer);
		});
	});
}

function playersCommand(chatManager: ChatManager, gameManager: GameManager, playerManager: PlayerManager, nameManager: NameManager) {
	chatManager.addCmd(['-names', '-players'], () => {
		if (!gameManager.isStateMetaGame()) return;

		const player: player = GetTriggerPlayer();
		const nameList: player[] = [];

		playerManager.players.forEach((player) => {
			if (player.status.isAlive() || player.status.isNomad()) {
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
