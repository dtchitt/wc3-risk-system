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
	private modeSelectionState: ModeSelection;
	private preGameState: PreGame;
	private metaGameState: MetaGame;
	private postGameState: PostGame;

	private static instance: GameManager;

	private constructor() {
		this._round = 1;
		this.setCommands();

		this.postGameState = new PostGame();
		this.metaGameState = new MetaGame(this.postGameState);
		this.preGameState = new PreGame(this.metaGameState);
		this.modeSelectionState = new ModeSelection(this.preGameState);

		this.updateState(this.modeSelectionState);
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
		this.updateState(this.preGameState);
	}

	public fullRestart() {
		this.updateState(this.modeSelectionState);
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

			playerManager.players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.DEAD);
		});

		chatManager.addCmd(['-stfu', '-mute'], () => {
			if (!this.isStateMetaGame()) return;

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

		// chatManager.addCmd(['-ng'], () => {
		// 	if (!this.isStatePostGame()) return;

		// 	this.state.end();
		//	this.fastRestart();
		// });

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
