import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import { CITIES_TO_WIN_MULTIPLIER } from 'src/configs/game-settings';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;

	private constructor() {
		this.players = [];
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

	public checkCityVictory() {
		this.players.forEach((player) => {
			if (player.trackedData.cities.cities.length >= VictoryManager.CITIES_TO_WIN) {
				this._leader = player;
				this.endGame();
			}
		});
	}

	public checkKnockOutVictory() {
		if (this.players.length == 1) {
			this._leader = this.players[0];
			this.endGame();
		}
	}

	// public capitalsVictory(): ActivePlayer | null {}
	// public checkPointVictory(): ActivePlayer | null {}

	public setTimer(timer: TimerService) {
		this.gameTimer = timer;
	}

	public reset() {
		this.players = [];
	}

	private endGame() {
		this.players.sort((playerA, playerB) => {
			return playerA.trackedData.cities.cities.length - playerB.trackedData.cities.cities.length;
		});

		this.players.forEach((player) => {
			if (player.trackedData.turnDied == -1) {
				player.setEndData();
			}
		});

		BlzEnableSelections(false, false);
		this.gameTimer.stop();
	}
}
