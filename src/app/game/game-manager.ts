import { ChatManager } from '../managers/chat-manager';
import { NameManager } from '../managers/names/name-manager';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ErrorMsg } from '../utils/utils';
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

	public get state(): GameState {
		return this._state;
	}

	public get round(): number {
		return this._round;
	}

	private setCommands() {
		ChatManager.getInstance().addCmd(['-ff', '-forfeit'], () => {
			if (!this.isStateMetaGame()) return;

			PlayerManager.getInstance().players.get(GetTriggerPlayer()).status.set(PLAYER_STATUS.FORFEIT);
		});

		ChatManager.getInstance().addCmd(['-stfu', '-mute'], () => {
			if (!this.isStateMetaGame()) return;

			const players: player[] = NameManager.getInstance().getPlayerByName(GetEventPlayerChatString().split(' ')[1], [
				...PlayerManager.getInstance().players.keys(),
			]);

			const player: player = GetTriggerPlayer();

			if (players.length >= 2) {
				ErrorMsg(player, 'Multiple players found, be more specific!');
				return;
			} else if (players.length <= 0) {
				ErrorMsg(player, 'Player not found!', 2);
				return;
			} else if (PlayerManager.getInstance().players.get(players[0]).isAdmin()) {
				ErrorMsg(player, "You can't mute that player! :P");
			} else {
				PlayerManager.getInstance().players.get(players[0]).status.set(PLAYER_STATUS.STFU);
			}
		});
	}
}
