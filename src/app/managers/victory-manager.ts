import { CITIES_TO_WIN } from 'src/configs/game-settings';
import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';

export class VictoryManager {
	private static instance: VictoryManager;
	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;

	private constructor() {
		this.players = [];
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
	}

	public setLeader(player: ActivePlayer) {
		if (this.leader.trackedData.cities.cities.length > player.trackedData.cities.cities.length) {
			this._leader = player;
		}
	}

	public get leader(): ActivePlayer {
		return this._leader;
	}

	public checkCityVictory() {
		this.players.forEach((player) => {
			if (player.trackedData.cities.cities.length >= CITIES_TO_WIN) {
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
		BlzEnableSelections(false, false);
		this.gameTimer.stop();
		//Display Victory Message
		//Show Victory Scoareboard

		//TODO gametimer can observe victory manager, alert gametimer when this is ran
	}
}
