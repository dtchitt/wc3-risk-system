import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import { CITIES_TO_WIN_MULTIPLIER } from 'src/configs/game-settings';
import { WinTracker } from '../game/services/win-tracker';
import { GamePlayer } from '../entity/player/game-player';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;

	private _leader: GamePlayer;
	private players: GamePlayer[];
	private gameTimer: TimerService;
	private winTracker: WinTracker;

	private constructor() {
		this.players = [];
		this.winTracker = new WinTracker();
		VictoryManager.CITIES_TO_WIN = Math.ceil(RegionToCity.size * CITIES_TO_WIN_MULTIPLIER);
	}

	public static getInstance(): VictoryManager {
		if (this.instance == null) {
			this.instance = new VictoryManager();
		}

		return this.instance;
	}

	public addPlayer(player: GamePlayer) {
		this.players.push(player);

		if (!this._leader) {
			this._leader = player;
		}
	}

	public removePlayer(player: GamePlayer) {
		const index: number = this.players.indexOf(player);

		if (index > -1) {
			this.players.splice(index, 1);
		}

		this.checkKnockOutVictory();
	}

	public setLeader(player: GamePlayer) {
		if (player.getData().getCities().cities.length > this.leader.getData().getCities().cities.length) {
			this._leader = player;
		}
	}

	public get leader(): GamePlayer {
		return this._leader;
	}

	public checkCityVictory(): boolean {
		this.players.forEach((player) => {
			if (player.getData().getCities().cities.length >= VictoryManager.CITIES_TO_WIN) {
				this._leader = player;
				this.endGame();
				return true;
			}
		});

		return false;
	}

	public checkKnockOutVictory(): boolean {
		if (this.players.length == 1) {
			this._leader = this.players[0];
			this.endGame();
			return true;
		}

		return false;
	}

	// public capitalsVictory(): ActivePlayer | null {}
	// public checkPointVictory(): ActivePlayer | null {}

	public setTimer(timer: TimerService) {
		this.gameTimer = timer;
	}

	public reset() {
		this.players = [];
	}

	public updateWinTracker() {
		this.winTracker.addWinForEntity(this._leader.getPlayer());
	}

	private endGame() {
		this.players.forEach((player) => {
			if (player.getData().getTurnDied() == -1) {
				player.setEndData();
			}
		});

		BlzEnableSelections(false, false);
		this.gameTimer.stop();
	}
}
