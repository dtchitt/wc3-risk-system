import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ErrorMsg } from '../utils/messages';
import { ShuffleArray } from '../utils/utils';
import { GameState } from './state/game-state';
import { MetaGame } from './state/meta-game';
import { ModeSelection } from './state/mode-selection';
import { PostGame } from './state/post-game';
import { PreGame } from './state/pre-game';

export class GameManager {
	private _state: GameState;
	private _round: number;

	private static instance: GameManager;

	private constructor() {
		this._round = 1;
		this.setCommands();
		this.updateState(new ModeSelection(new PreGame(new MetaGame(new PostGame()))));
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameManager();
		}

		return this.instance;
	}

	public updateState(state: GameState) {
		this._state = state;
		this._state.setObserver(this);
		this._state.start();
	}

	public isStateMetaGame() {
		return this._state instanceof MetaGame;
	}

	public isStatePostGame() {
		return this._state instanceof PostGame;
	}

	public fastRestart() {
		this.updateState(new PreGame(new MetaGame(new PostGame())));
	}

	public fullRestart() {
		this.updateState(new ModeSelection(new PreGame(new MetaGame(new PostGame()))));
	}

	public get state(): GameState {
		return this._state;
	}

	public get round(): number {
		return this._round;
	}

	private setCommands() {
		const chatManager: ChatManager = ChatManager.getInstance();
		const playerManager: PlayerManager = PlayerManager.getInstance();
		const nameManager: NameManager = NameManager.getInstance();

		chatManager.addCmd(['-ff', '-forfeit'], () => {
			if (!this.isStateMetaGame()) return;

			playerManager.players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.FORFEIT);
		});

		chatManager.addCmd(['-stfu', '-mute'], () => {
			if (!this.isStateMetaGame()) return;

			const players: player[] = nameManager.getPlayerByNameFromArray(GetEventPlayerChatString().split(' ')[1], [
				...playerManager.players.keys(),
			]);

			const player: player = GetTriggerPlayer();

			if (players.length >= 2) {
				ErrorMsg(player, 'Multiple players found, be more specific!');
				return;
			} else if (players.length <= 0) {
				ErrorMsg(player, 'Player not found!', 2);
				return;
			} else if (playerManager.players.get(players[0]).isAdmin()) {
				ErrorMsg(player, "You can't mute that player! :P");
			} else {
				playerManager.players.get(players[0]).status.set(PLAYER_STATUS.STFU);
			}
		});

		chatManager.addCmd(['-ng'], () => {
			if (!this.isStatePostGame()) return;
		});

		chatManager.addCmd(['-names', '-players'], () => {
			if (!this.isStateMetaGame()) return;

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
}
