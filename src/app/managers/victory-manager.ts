import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import {
	CITIES_TO_WIN_MULTIPLIER,
	THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN,
	THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_MODIFIER,
} from 'src/configs/game-settings';
import { WinTracker } from '../game/services/win-tracker';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;
	public static PASSED_THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT: boolean;

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;
	private winTracker: WinTracker;

	private constructor() {
		this.players = [];
		this.winTracker = new WinTracker();

		// since gameTimer is not set yet and CalculateCitiesToWin relies on the gameTimer, we need to manually set the cities to win
		VictoryManager.CITIES_TO_WIN = Math.ceil(RegionToCity.size * CITIES_TO_WIN_MULTIPLIER);
	}

	public static getInstance(): VictoryManager {
		if (this.instance == null) {
			this.instance = new VictoryManager();
		}

		return this.instance;
	}

	public addPlayer(player: ActivePlayer) {
		this.players.push(player);

		if (!this._leader) {
			this._leader = player;
		}
	}

	public removePlayer(player: ActivePlayer) {
		const index: number = this.players.indexOf(player);

		if (index > -1) {
			this.players.splice(index, 1);
		}

		this.checkKnockOutVictory();
	}

	public setLeader(player: ActivePlayer) {
		if (player.trackedData.cities.cities.length > this.leader.trackedData.cities.cities.length) {
			this._leader = player;
		}
	}

	public get leader(): ActivePlayer {
		return this._leader;
	}

	public checkCityVictory(): boolean {
		this.updateCityToWin();

		this.players.forEach((player) => {
			if (player.trackedData.cities.cities.length >= VictoryManager.CITIES_TO_WIN) {
				this._leader = player;
				this.endGame();
				return true;
			}
		});

		return false;
	}

	public updateCityToWin() {
		VictoryManager.CITIES_TO_WIN = this.calculateCitiesToWin();
	}

	private calculateCitiesToWin(): number {
		if (this.gameTimer.getTurns() >= THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN) {
			VictoryManager.PASSED_THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT = true;
			let turnsSinceThreshold = this.gameTimer.getTurns() - THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN;
			return Math.ceil(
				RegionToCity.size * (CITIES_TO_WIN_MULTIPLIER - turnsSinceThreshold * THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_MODIFIER)
			);
		}

		return Math.ceil(RegionToCity.size * CITIES_TO_WIN_MULTIPLIER);
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
			if (player.trackedData.turnDied == -1) {
				player.setEndData();
			}
		});

		BlzEnableSelections(false, false);
		this.gameTimer.stop();
	}
}
