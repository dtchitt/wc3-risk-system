import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import { CITIES_TO_WIN_MULTIPLIER, OVERTIME_MODIFIER } from 'src/configs/game-settings';
import { WinTracker } from '../game/services/win-tracker';
import { PLAYER_SLOTS } from '../utils/utils';
import { UNIT_TYPE } from '../utils/unit-types';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;
	public static OVERTIME_ACTIVE: boolean = false;
	public static OVERTIME_MODE: boolean;
	public static OVERTIME_ACTIVE_AT_TURN: number;
	public static OVERTIME_TOTAL_TURNS: number = 0;
	public static OVERTIME_TURNS_UNTIL_ACTIVE: number = 0;
	public static GAME_ENDED = false;

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;
	private winTracker: WinTracker;

	private constructor() {
		this.players = [];
		this.winTracker = new WinTracker();

		// since gameTimer is not set yet and CalculateCitiesToWin relies on the gameTimer, we need to manually set the cities to win
		VictoryManager.CITIES_TO_WIN = Math.ceil(RegionToCity.size * CITIES_TO_WIN_MULTIPLIER);

		VictoryManager.OVERTIME_ACTIVE = false;
		VictoryManager.OVERTIME_ACTIVE_AT_TURN = 0;
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
		if (VictoryManager.OVERTIME_MODE) {
			VictoryManager.OVERTIME_TURNS_UNTIL_ACTIVE = VictoryManager.OVERTIME_ACTIVE_AT_TURN - this.gameTimer.getTurns();
			VictoryManager.OVERTIME_TOTAL_TURNS = this.gameTimer.getTurns() - VictoryManager.OVERTIME_ACTIVE_AT_TURN;
		}

		if (VictoryManager.OVERTIME_MODE && this.gameTimer.getTurns() >= VictoryManager.OVERTIME_ACTIVE_AT_TURN) {
			VictoryManager.OVERTIME_ACTIVE = true;
			return Math.ceil(RegionToCity.size * CITIES_TO_WIN_MULTIPLIER) - OVERTIME_MODIFIER * VictoryManager.OVERTIME_TOTAL_TURNS;
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
		VictoryManager.OVERTIME_ACTIVE = false;
		VictoryManager.GAME_ENDED = false;
	}

	public updateWinTracker() {
		this.winTracker.addWinForEntity(this._leader.getPlayer());
	}

	private endGame() {
		VictoryManager.GAME_ENDED = true;
		this.players.forEach((player) => {
			if (player.trackedData.turnDied == -1) {
				player.setEndData();
			}
		});

		BlzEnableSelections(false, false);
		this.gameTimer.stop();

		this.pauseAllUnits();
	}

	private pauseAllUnits() {
		const group: group = CreateGroup();

		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const player = Player(i);

			GroupEnumUnitsOfPlayer(
				group,
				player,
				Filter(() => {
					const unit: unit = GetFilterUnit();

					// Cancels units in training by changing ownership
					if (IsUnitType(unit, UNIT_TYPE.BUILDING)) {
						SetUnitOwner(unit, Player((i + 1) % PLAYER_SLOTS), false);
						SetUnitOwner(unit, player, false);
					} else {
						PauseUnit(unit, true);
					}

					// Prevents neutral buildings from attacking post-game
					SetUnitInvulnerable(unit, true);
				})
			);
			DestroyGroup(group);
		}
		GroupClear(group);
	}
}
