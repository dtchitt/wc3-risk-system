import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
import { PlayerManager } from 'src/app/player/player-manager';
import { StringToCountry } from 'src/app/country/country-map';
import { NameManager } from 'src/app/managers/names/name-manager';
import { VictoryProgressState, VictoryManager } from 'src/app/managers/victory-manager';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { HexColors } from 'src/app/utils/hex-colors';
import { GlobalMessage } from 'src/app/utils/messages';
import { CITIES_TO_WIN_WARNING_RATIO } from 'src/configs/game-settings';
import { UNIT_TYPE } from 'src/app/utils/unit-types';
import { PLAYER_SLOTS, NEUTRAL_HOSTILE } from 'src/app/utils/utils';
import { SettingsContext } from 'src/app/settings/settings-context';
import { StatisticsController } from 'src/app/statistics/statistics-controller';
import { GameManager } from '../game-manager';

export interface GameMode {
	isMatchOver: () => boolean;
	onStartMatch: () => void;
	onEndMatch: () => void;
	onStartTurn: (turn: number) => void;
	onEndTurn: (turn: number) => void;
	onTick: (tick: number) => void;

	onCityCapture: (city: City, preOwner: ActivePlayer, owner: ActivePlayer) => void;
	onForfeits: () => void;
	onRematch: () => void;
	onPlayerElimination: (player: ActivePlayer) => void;
}

export abstract class BaseGameMode implements GameMode {
	isMatchOver(): boolean {
		return GameManager.isMatchPostStage();
		// print('isMatchOver');
	}

	onStartMatch(): void {
		print('onStartMatch');
		GameManager.setMatchStage('inProgress');
	}

	onEndMatch(): void {
		print('onEndMatch');
		GameManager.setMatchStage('postMatch');
		this.postMatchSetup();
	}

	onStartTurn(turn: number): void {
		print('onStartTurn');

		ScoreboardManager.updateScoreboardTitle();

		PlayerManager.getInstance().players.forEach((player) => {
			if (!player.status.isDead()) {
				player.giveGold();
			}
		});

		StringToCountry.forEach((country) => {
			country.getSpawn().step();
		});

		this.messageGameState();
	}

	onEndTurn(turn: number): void {
		if (VictoryManager.GAME_VICTORY_STATE == 'DECIDED') {
			GameManager.setMatchStage('postMatch');
		}

		print('onEndTurn');
	}

	onTick(tick: number): void {
		// print('onTick');
		VictoryManager.getInstance().updateAndGetGameState();
	}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {
		print('onCityCapture');
	}

	onForfeits(): void {
		print('onForfeits');
	}

	onRematch(): void {
		print('onRematch');
	}

	onPlayerElimination(): void {
		print('onPlayerElimination');
		if (PlayerManager.getInstance().players.size == 1) {
			GameManager.setMatchStage('postMatch');
		}
	}

	private messageGameState() {
		let playersToAnnounce = VictoryManager.getInstance().getFrontRunnersByThreshold(
			VictoryManager.CITIES_TO_WIN * CITIES_TO_WIN_WARNING_RATIO
		);

		if (playersToAnnounce.length == 0) return;

		function cityCountDescription(candidate: ActivePlayer, state: VictoryProgressState) {
			if (state == 'TIE' && candidate.trackedData.cities.cities.length >= VictoryManager.CITIES_TO_WIN) {
				return `is ${HexColors.RED}TIED|r to win!`;
			} else {
				return `needs ${HexColors.RED}${VictoryManager.CITIES_TO_WIN - candidate.trackedData.cities.cities.length}|r more to win!`;
			}
		}

		function announceCandidate(candidate: ActivePlayer, state: VictoryProgressState): string {
			let line = `${NameManager.getInstance().getDisplayName(candidate.getPlayer())} owns ${HexColors.RED}${
				candidate.trackedData.cities.cities.length
			}|r cities and ${cityCountDescription(candidate, state)}`;

			return line;
		}

		const tiedMessage =
			VictoryManager.GAME_VICTORY_STATE == 'TIE'
				? `${VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}TIED!\nGAME EXTENDED BY ONE ROUND!|r` : ''}`
				: '';
		const overtimeMessage = VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}OVERTIME!|r` : '';
		const playerMessages = playersToAnnounce.map((player) => announceCandidate(player, VictoryManager.GAME_VICTORY_STATE)).join('\n');

		GlobalMessage([tiedMessage, overtimeMessage, playerMessages].join('\n\n'), 'Sound\\Interface\\ItemReceived.flac', 4);
	}

	private postMatchSetup() {
		this.pauseAllUnits();
		VictoryManager.getInstance().saveStats();

		FogEnable(false);
		BlzEnableSelections(false, false);

		if (SettingsContext.getInstance().isPromode()) {
			VictoryManager.getInstance().updateWinTracker();
		} else {
			const statsController: StatisticsController = StatisticsController.getInstance();
			statsController.refreshView();
			statsController.setViewVisibility(true);
			statsController.writeStatisticsData();
		}

		GameManager.getInstance().setRestartEnabled(true);
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
}
