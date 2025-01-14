import { GameMode } from './game-mode/game-mode';
import { City } from '../city/city';
import { ActivePlayer } from '../player/types/active-player';
import { PlayerManager } from '../player/player-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ScoreboardManager } from '../scoreboard/scoreboard-manager';
import { SettingsContext } from '../settings/settings-context';
import { CountdownMessage } from '../utils/messages';
import { NEUTRAL_HOSTILE, PLAYER_SLOTS, PlayGlobalSound } from '../utils/utils';
import { TURN_DURATION_IN_SECONDS, TICK_DURATION_IN_SECONDS } from 'src/configs/game-settings';
import { File } from 'w3ts';
import { CityToCountry, StringToCountry } from '../country/country-map';
import { Wait } from '../utils/wait';
import { VictoryManager } from '../managers/victory-manager';
import { HexColors } from '../utils/hex-colors';
import { TreeManager } from './services/tree-service';
import { DistributionService } from './services/distribution-service';
import { RegionToCity } from '../city/city-map';
import { MatchData } from './state/match-state';
import { UNIT_TYPE } from '../utils/unit-types';

export class MatchGameLoop {
	private static instance: MatchGameLoop;
	private _gameMode: GameMode;
	private _matchLoopTimer: timer;
	private distributionService: DistributionService;
	private playerManager: PlayerManager;

	private constructor() {
		this._matchLoopTimer = CreateTimer();
		this.playerManager = PlayerManager.getInstance();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new MatchGameLoop();
		}

		return this.instance;
	}

	public injectGameMode(gameMode: GameMode) {
		this._gameMode = gameMode;
	}

	public onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer) {
		this._gameMode.onCityCapture(city, preOwner, owner);
	}

	public onPlayerElimination(player: ActivePlayer) {
		this._gameMode.onPlayerElimination(player);
	}

	public async resetMatch() {
		FogEnable(true);

		MatchData.prepareMatchData();

		if (MatchData.matchCount == 1) {
			print(`Preparing round #${MatchData.matchCount}`);
		} else {
			print(`Preparing next round #${MatchData.matchCount}`);

			// this.playerManager.players.forEach((player) => {
			// 	player.reset();
			// });

			print('Removing units...');
			await this.removeUnits();
			await Wait.forSeconds(1);
			print('Resuming units...');
			await this.resumingUnits();
			await Wait.forSeconds(1);
			print('Resetting countries...');
			await this.resetCountries();
			await Wait.forSeconds(1);
			print('Resetting trees...');
			await TreeManager.getInstance().reset();
			await Wait.forSeconds(1);
		}

		EnableSelect(false, false);
		EnableDragSelect(false, false);
		FogEnable(true);

		this.distributionService = new DistributionService();
		this.distributionService.runDistro(() => {
			RegionToCity.forEach((city) => {
				city.guard.reposition();
				//Prevent guards from moving and update unit counts
				IssueImmediateOrder(city.guard.unit, 'stop');

				if (GetOwningPlayer(city.guard.unit) != NEUTRAL_HOSTILE) {
					this.playerManager.players.get(GetOwningPlayer(city.guard.unit)).trackedData.units.add(city.guard.unit);
				}

				SetUnitInvulnerable(city.guard.unit, false);
			});
		});
	}

	public async startGameMode() {
		await this.resetMatch().then();
		await Wait.forSeconds(2);
		try {
			const players: ActivePlayer[] = [...PlayerManager.getInstance().players.values()];
			players.forEach((player) => {
				SetPlayerState(player.getPlayer(), PLAYER_STATE_RESOURCE_GOLD, 0);
				player.status.set(PLAYER_STATUS.ALIVE);
				player.trackedData.bonus.showForPlayer(player.getPlayer());
				player.trackedData.bonus.repositon();
				VictoryManager.getInstance().addPlayer(player);
			});
			const scoreboardManager: ScoreboardManager = ScoreboardManager.getInstance();
			const settingsContext: SettingsContext = SettingsContext.getInstance();
			if (settingsContext.isFFA() || players.length <= 2) {
				scoreboardManager.ffaSetup(players);
			} else {
				scoreboardManager.teamSetup();
			}
			scoreboardManager.obsSetup(players, [...PlayerManager.getInstance().observers.keys()]);
			settingsContext.applyStrategy('Fog');
			if (settingsContext.isPromode()) {
				await this.setTempVision(PlayerManager.getInstance().players);
			}
			PlayGlobalSound('Sound\\Interface\\ArrangedTeamInvitation.flac');
			const startDelayTimer: timer = CreateTimer();
			let duration: number = 3;
			TimerStart(startDelayTimer, 1, true, () => {
				CountdownMessage(`The Game will start in:\n${duration}`);
				if (duration == 3) {
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), true);
				}
				if (duration <= 0) {
					PauseTimer(startDelayTimer);
					DestroyTimer(startDelayTimer);
					BlzFrameSetVisible(BlzGetFrameByName('CountdownFrame', 0), false);
					EnableSelect(true, true);
					EnableDragSelect(true, true);
					this.run();
					PlayGlobalSound('Sound\\Interface\\Hint.flac');
				}
				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	private run() {
		this._gameMode.onStartMatch();
		print('DOING IT');
		this._gameMode.onStartTurn(MatchData.turnCount);
		// Start a timer that executes the game loop every second
		TimerStart(this._matchLoopTimer, TICK_DURATION_IN_SECONDS, true, () => {
			try {
				// Check if the match is over
				if (this._gameMode.isMatchOver()) {
					PauseTimer(this._matchLoopTimer);
					this._gameMode.onEndMatch();
					return;
				}

				// Check if a turn has ended
				this._gameMode.onTick(MatchData.tickCounter);

				if (MatchData.tickCounter <= 0) {
					this._gameMode.onEndTurn(MatchData.turnCount);
				}

				// Stop game loop if match is over
				if (this._gameMode.isMatchOver()) {
					PauseTimer(this._matchLoopTimer);
					return;
				}

				MatchData.tickCounter--;

				if (MatchData.tickCounter <= 0) {
					this._gameMode.onEndTurn(MatchData.turnCount);
					MatchData.tickCounter = TURN_DURATION_IN_SECONDS;
					MatchData.turnCount++;
					this._gameMode.onStartTurn(MatchData.turnCount);
				}
				this.updateUI();
			} catch (error) {
				File.write('errors', error as string);
				print('Error in Timer ' + error);
			}
		});
	}

	private async setTempVision(players: Map<player, ActivePlayer>) {
		const visionMap = new Map<unit, player[]>();

		DisplayTextToForce(bj_FORCE_ALL_PLAYERS, `Revealing blocks`);

		for (const activePlayer of players.values()) {
			const playerHandle: player = activePlayer.getPlayer();

			const allies: player[] = [];
			for (const otherPlayer of players.values()) {
				const otherPlayerHandle: player = otherPlayer.getPlayer();
				if (IsPlayerAlly(playerHandle, otherPlayerHandle)) {
					allies.push(otherPlayerHandle);
				}
			}

			activePlayer.trackedData.cities.cities.forEach((playerCity) => {
				const country = CityToCountry.get(playerCity);

				country.getCities().forEach((countryCity) => {
					const unit: unit = countryCity.cop;

					if (GetOwningPlayer(unit) !== NEUTRAL_HOSTILE) {
						UnitShareVision(unit, playerHandle, true);

						const playersWithVision = visionMap.get(unit) || [];

						playersWithVision.push(playerHandle);

						allies.forEach((ally) => {
							UnitShareVision(unit, ally, true);
							playersWithVision.push(ally);
						});

						visionMap.set(unit, playersWithVision);
					}
				});
			});
		}

		await Wait.forSeconds(4);

		for (const [unit, players] of visionMap.entries()) {
			players.forEach((playerHandle) => {
				UnitShareVision(unit, playerHandle, false);
			});
		}

		ClearTextMessages();
	}

	/**
	 * Update the UI elements related to the timer.
	 */
	private updateUI() {
		let tick: string = `${MatchData.tickCounter}`;

		if (MatchData.tickCounter <= 3) {
			tick = `${HexColors.RED}${MatchData.tickCounter}|r`;
			PlayGlobalSound('Sound\\Interface\\BattleNetTick.flac');
		}

		BlzFrameSetText(BlzGetFrameByName('ResourceBarUpkeepText', 0), tick);
		BlzFrameSetText(BlzGetFrameByName('ResourceBarSupplyText', 0), `${MatchData.turnCount}`);
	}

	private resumingUnits(): Promise<void> {
		return new Promise((resolve) => {
			for (let i = 0; i < PLAYER_SLOTS; i++) {
				const player = Player(i);

				const group: group = CreateGroup();
				GroupEnumUnitsOfPlayer(
					group,
					player,
					Filter(() => {
						const unit: unit = GetFilterUnit();
						if (IsUnitType(unit, UNIT_TYPE.BUILDING)) {
							PauseUnit(unit, false);
						}
					})
				);

				GroupClear(group);
				DestroyGroup(group);
			}

			resolve();
		});
	}

	private removeUnits(): Promise<void> {
		return new Promise((resolve) => {
			for (let i = 0; i < PLAYER_SLOTS; i++) {
				const player = Player(i);

				const group: group = CreateGroup();
				GroupEnumUnitsOfPlayer(
					group,
					player,
					Filter(() => {
						const unit: unit = GetFilterUnit();

						if (!IsUnitType(unit, UNIT_TYPE.BUILDING) && !IsUnitType(unit, UNIT_TYPE.GUARD)) {
							RemoveUnit(unit);
						}
					})
				);

				GroupClear(group);
				DestroyGroup(group);
			}

			resolve();
		});
	}

	private resetCountries(): Promise<void> {
		return new Promise((resolve) => {
			StringToCountry.forEach((country) => {
				country.reset();
			});
			resolve();
		});
	}
}
