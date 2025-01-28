import { ActivePlayer } from 'src/app/player/types/active-player';
import { City } from 'src/app/city/city';
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
import { MatchData } from '../state/match-state';
import { PLAYER_STATUS } from 'src/app/player/status/status-enum';
import {
	EVENT_CITY_CAPTURE,
	EVENT_ON_CITY_CAPTURE,
	EVENT_ON_PLAYER_ALIVE,
	EVENT_ON_PLAYER_DEAD,
	EVENT_ON_PLAYER_FORFEIT,
	EVENT_ON_PLAYER_LEFT,
	EVENT_ON_PLAYER_NOMAD,
	EVENT_ON_PLAYER_STFU,
	EVENT_ON_REMATCH,
	EVENT_PLAYER_ALIVE,
	EVENT_PLAYER_DEAD,
	EVENT_PLAYER_FORFEIT,
	EVENT_PLAYER_LEFT,
	EVENT_PLAYER_NOMAD,
	EVENT_PLAYER_STFU,
	EVENT_REMATCH,
} from 'src/app/utils/events/event-constants';
import { GameMode } from './game-mode';

export abstract class BaseGameMode implements GameMode {
	private _statsController: StatisticsController;
	private _scoreboardManager: ScoreboardManager;

	constructor() {
		this._statsController = StatisticsController.getInstance();
		this._scoreboardManager = ScoreboardManager.getInstance();
	}

	isMatchOver(): boolean {
		return MatchData.matchState == 'postMatch';
	}

	onStartMatch(): void {}

	onEndMatch(): void {
		MatchData.matchState = 'postMatch';
		this.postMatchSetup();
	}

	onStartTurn(turn: number): void {
		this._scoreboardManager.updateFull();
		MatchData.remainingPlayers.forEach((player) => {
			player.giveGold();
		});

		StringToCountry.forEach((country) => {
			country.getSpawn().step();
		});

		this.messageGameState();
	}

	onEndTurn(turn: number): void {
		if (VictoryManager.GAME_VICTORY_STATE == 'DECIDED') {
			MatchData.matchState = 'postMatch';
		}

		this._scoreboardManager.updateFull();
	}

	onTick(tick: number): void {
		VictoryManager.getInstance().updateAndGetGameState();
		this._scoreboardManager.updateScoreboardTitle();
		this._scoreboardManager.updatePartial();
	}

	async onPlayerAlive(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_ALIVE);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.ALIVE);
		this._scoreboardManager.updatePartial();
	}

	async playerAlive(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_ALIVE);
	}

	async onPlayerDead(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_DEAD);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.DEAD);
		if (VictoryManager.getInstance().checkKnockOutVictory()) {
			MatchData.matchState = 'postMatch';
		}
		this._scoreboardManager.updatePartial();
	}

	async playerDead(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_DEAD);
	}

	async onPlayerNomad(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_NOMAD);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.NOMAD);
		this._scoreboardManager.updatePartial();
	}

	async playerNomad(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_NOMAD);
	}

	async onPlayerLeft(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_LEFT);
		let previousStatus = MatchData.getPlayerStatus(player);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.LEFT);
	}

	async playerLeft(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_LEFT);
	}

	async onPlayerSTFU(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_STFU);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.STFU);
		this._scoreboardManager.updatePartial();
	}

	async playerSTFU(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_STFU);
	}

	async onPlayerForfeit(player: ActivePlayer): Promise<void> {
		print(EVENT_ON_PLAYER_FORFEIT);
		MatchData.setPlayerStatus(player, PLAYER_STATUS.DEAD);
		this._scoreboardManager.updatePartial();
	}

	async playerForfeit(player: ActivePlayer): Promise<void> {
		print(EVENT_PLAYER_FORFEIT);
	}

	async onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		print(EVENT_ON_CITY_CAPTURE);
		this._scoreboardManager.updatePartial();
	}

	async cityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): Promise<void> {
		print(EVENT_CITY_CAPTURE);
	}

	async onRematch(): Promise<void> {
		print(EVENT_ON_REMATCH);
		this._statsController.setViewVisibility(false);
	}

	async rematch(): Promise<void> {
		print(EVENT_REMATCH);
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

		// Hide match scoreboard and show score screen
		this._scoreboardManager.destroyBoards();
		MatchData.initialPlayers.forEach((player) => {
			if (SettingsContext.getInstance().isPromode()) {
				NameManager.getInstance().setName(player.getPlayer(), 'acct');
			} else {
				NameManager.getInstance().setName(player.getPlayer(), 'btag');
				player.trackedData.bonus.hideUI();
			}
		});
		if (SettingsContext.getInstance().isPromode()) {
			VictoryManager.getInstance().updateWinTracker();
		} else {
			this._statsController.refreshView();
			this._statsController.setViewVisibility(true);
			this._statsController.writeStatisticsData();
		}
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
