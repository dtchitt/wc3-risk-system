import { PlayerManager } from '../entity/player/player-manager';
import { GameManager } from '../game/game-manager';
import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { CamCommand } from './cam';
import { ForfeitCommand } from './forfeit';
import { GoldCommand } from './gold';
import { HelpCommand } from './help';
import { MuteCommand } from './mute';
import { NamesCommand } from './names';
import { RestartCommand } from './restart';

export function SetCommands(gameManager: GameManager) {
	const chatManager: ChatManager = ChatManager.getInstance();
	const playerManager: PlayerManager = PlayerManager.getInstance();
	const nameManager: NameManager = NameManager.getInstance();

	CamCommand(chatManager);
	ForfeitCommand(chatManager, gameManager, playerManager);
	MuteCommand(chatManager, gameManager, nameManager, playerManager);
	RestartCommand(chatManager, gameManager);
	NamesCommand(chatManager, gameManager, playerManager, nameManager);
	GoldCommand(chatManager, gameManager, nameManager);
	HelpCommand(chatManager);
}
