import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { PLAYER_SLOTS, NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { BaseGameMode } from './game-mode';
import { VictoryManager, VictoryProgressState } from 'src/app/managers/victory-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { TimerService } from '../services/timer-service';
import { WinTracker } from '../services/win-tracker';
import { PlayerManager } from 'src/app/player/player-manager';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { RegionToCity } from 'src/app/city/city-map';
import { CITIES_TO_WIN_RATIO, OVERTIME_MODIFIER } from 'src/configs/game-settings';

export class GameModeStandard extends BaseGameMode {
	public CITIES_TO_WIN: number;
	public OVERTIME_ACTIVE: boolean = false;
	public OVERTIME_MODE: boolean;
	public OVERTIME_ACTIVE_AT_TURN: number;
	public OVERTIME_TOTAL_TURNS: number = 0;
	public OVERTIME_TURNS_UNTIL_ACTIVE: number = 0;
	private GAME_VICTORY_STATE: VictoryProgressState = 'UNDECIDED';

	private _leader: ActivePlayer;
	private players: ActivePlayer[];
	private gameTimer: TimerService;
	private winTracker: WinTracker;

	IsMatchOver(): boolean {
		return this.GAME_VICTORY_STATE == 'DECIDED';
	}

	OnStartTurn(turn: number): void {}

	OnStartMatch(): void {
		this.players = [];
		this._leader = null;
		VictoryManager.OVERTIME_ACTIVE = false;
		VictoryManager.GAME_VICTORY_STATE = 'UNDECIDED';
	}
	OnEndMatch(): void {
		this.GAME_VICTORY_STATE = 'DECIDED';
		this.players.forEach((player) => {
			if (player.trackedData.turnDied == -1) {
				player.setEndData();
			}
		});

		BlzEnableSelections(false, false);

		PlayerManager.getInstance().players.forEach((val, key) => {
			const data: TrackedData = val.trackedData;
			if (data.turnDied == -1) data.turnDied = this.getTurnCount();
			if (data.cities.end == 0) data.cities.end = data.cities.cities.length;
		});

		this.pauseAllUnits();
	}

	OnEndTurn(turn: number): void {
		this.GAME_VICTORY_STATE = this.updateAndGetGameState();
	}

	OnCityCapture(): void {
		this.updateRequiredCityCount();
	}

	private pauseAllUnits() {
		// Players
		for (let i = 0; i < PLAYER_SLOTS; i++) {
			const player = Player(i);

			const group: group = CreateGroup();
			GroupEnumUnitsOfPlayer(
				group,
				player,
				Filter(() => {
					const unit: unit = GetFilterUnit();

					// Cancels units in training by changing ownership
					if (IsUnitType(unit, UNIT_TYPE.BUILDING)) {
						SetUnitOwner(unit, NEUTRAL_HOSTILE, false);
						SetUnitOwner(unit, player, false);
					}

					// Prevents neutral buildings from attacking post-game
					IssueImmediateOrder(unit, 'holdposition');
					SetUnitInvulnerable(unit, true);
				})
			);
			DestroyGroup(group);
			GroupClear(group);
		}

		// Neutral
		const group: group = CreateGroup();
		GroupEnumUnitsOfPlayer(
			group,
			NEUTRAL_HOSTILE,
			Filter(() => {
				const unit: unit = GetFilterUnit();

				// Prevents defenders from being attacked
				if (IsUnitType(unit, UNIT_TYPE.GUARD)) {
					IssueImmediateOrder(unit, 'holdposition');
					SetUnitInvulnerable(unit, true);
				}
			})
		);
		DestroyGroup(group);
		GroupClear(group);
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

	public victors(): ActivePlayer[] {
		let potentialVictors = this.players.filter((x) => x.trackedData.cities.cities.length >= VictoryManager.CITIES_TO_WIN);

		if (potentialVictors.length == 0) {
			return [];
		}

		let max = potentialVictors.sort((x) => x.trackedData.cities.cities.length)[0].trackedData.cities.cities.length;
		return potentialVictors.filter((x) => x.trackedData.cities.cities.length == max);
	}
}
