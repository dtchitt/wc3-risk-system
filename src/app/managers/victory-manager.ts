import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import { CITIES_TO_WIN_MULTIPLIER } from 'src/configs/game-settings';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private _ranks: ActivePlayer[];
	private gameTimer: TimerService;

	private constructor() {
		this.players = [];
		this._ranks = [];
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

		if (index > -1) this.players.splice(index, 1);

		this.ranks.push(player);
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

	public get ranks(): ActivePlayer[] {
		return this._ranks;
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

	private endGame() {
		this.players.sort((playerA, playerB) => {
			return playerB.trackedData.cities.cities.length - playerA.trackedData.cities.cities.length;
		});

		this.players.forEach((player) => {
			if (player != this._leader) {
				this.ranks.push(player);
			}

			player.setEndData();
		});

		this.ranks.push(this._leader);
		this.ranks.reverse();

		BlzEnableSelections(false, false);
		this.gameTimer.stop();
	}
}
