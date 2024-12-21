import { ActivePlayer } from '../player/types/active-player';
import { TimerService } from '../game/services/timer-service';
import { RegionToCity } from '../city/city-map';
import { CITIES_TO_WIN_RATIO, OVERTIME_MODIFIER } from 'src/configs/game-settings';
import { WinTracker } from '../game/services/win-tracker';
import { NEUTRAL_HOSTILE, PLAYER_SLOTS } from '../utils/utils';
import { UNIT_TYPE } from '../utils/unit-types';

export type VictoryProgressState = 'UNDECIDED' | 'TIE' | 'DECIDED';

export class VictoryManager {
	private static instance: VictoryManager;
	public static CITIES_TO_WIN: number;
	public static OVERTIME_ACTIVE: boolean = false;
	public static OVERTIME_MODE: boolean;
	public static OVERTIME_ACTIVE_AT_TURN: number;
	public static OVERTIME_TOTAL_TURNS: number = 0;
	public static OVERTIME_TURNS_UNTIL_ACTIVE: number = 0;
	public static GAME_VICTORY_STATE: VictoryProgressState = 'UNDECIDED';

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;
	private winTracker: WinTracker;

	private constructor() {
		this.players = [];
		this.winTracker = new WinTracker();

		// since gameTimer is not set yet and CalculateCitiesToWin relies on the gameTimer, we need to manually set the cities to win
		VictoryManager.CITIES_TO_WIN = Math.ceil(RegionToCity.size * CITIES_TO_WIN_RATIO);

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
	public getFrontRunnersByThreshold(threshold: number): ActivePlayer[] {
		return this.players
			.filter((player) => player.trackedData.cities.cities.length >= threshold)
			.sort((player) => player.trackedData.cities.cities.length);
	}

	public victors(): ActivePlayer[] {
		let potentialVictors = this.players.filter((x) => x.trackedData.cities.cities.length >= VictoryManager.CITIES_TO_WIN);

		if (potentialVictors.length == 0) {
			return [];
		}

		let max = potentialVictors.sort((x) => x.trackedData.cities.cities.length)[0].trackedData.cities.cities.length;
		return potentialVictors.filter((x) => x.trackedData.cities.cities.length == max);
	}

	public updateAndGetGameState(): VictoryProgressState {
		this.updateRequiredCityCount();

		let playerWinCandidates = this.victors();

		if (playerWinCandidates.length == 0) {
			VictoryManager.GAME_VICTORY_STATE = 'UNDECIDED';
		} else if (playerWinCandidates.length == 1) {
			VictoryManager.GAME_VICTORY_STATE = 'DECIDED';
		} else {
			VictoryManager.GAME_VICTORY_STATE = 'TIE';
		}

		return VictoryManager.GAME_VICTORY_STATE;
	}

	public updateRequiredCityCount() {
		VictoryManager.CITIES_TO_WIN = this.calculateCitiesToWin();
	}

	private calculateCitiesToWin(): number {
		if (VictoryManager.OVERTIME_MODE) {
			VictoryManager.OVERTIME_TURNS_UNTIL_ACTIVE = VictoryManager.OVERTIME_ACTIVE_AT_TURN - this.gameTimer.getTurns();
			VictoryManager.OVERTIME_TOTAL_TURNS = this.gameTimer.getTurns() - VictoryManager.OVERTIME_ACTIVE_AT_TURN;
		}

		if (VictoryManager.OVERTIME_MODE && this.gameTimer.getTurns() >= VictoryManager.OVERTIME_ACTIVE_AT_TURN) {
			VictoryManager.OVERTIME_ACTIVE = true;
			return Math.ceil(RegionToCity.size * CITIES_TO_WIN_RATIO) - OVERTIME_MODIFIER * VictoryManager.OVERTIME_TOTAL_TURNS;
		}

		return Math.ceil(RegionToCity.size * CITIES_TO_WIN_RATIO);
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
		this._leader = null;
		VictoryManager.OVERTIME_ACTIVE = false;
		VictoryManager.GAME_VICTORY_STATE = 'UNDECIDED';
	}

	public updateWinTracker() {
		this.winTracker.addWinForEntity(this._leader.getPlayer());
	}

	public endGame() {
		VictoryManager.GAME_VICTORY_STATE = 'DECIDED';
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
		this.players.forEach((player) => {
			const activePlayer = player.getPlayer();

			GroupEnumUnitsOfPlayer(
				group,
				activePlayer,
				Filter(() => {
					const unit: unit = GetFilterUnit();

					// Cancels units in training by changing ownership
					if (IsUnitType(unit, UNIT_TYPE.BUILDING)) {
						SetUnitOwner(unit, NEUTRAL_HOSTILE, false);
						SetUnitOwner(unit, activePlayer, false);
					}

					// Prevents neutral buildings from attacking post-game
					IssueImmediateOrder(unit, 'holdposition');
					SetUnitInvulnerable(unit, true);
				})
			);
			DestroyGroup(group);
		});

		GroupClear(group);
	}
}
