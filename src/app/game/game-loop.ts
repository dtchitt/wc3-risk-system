import { TICK_DURATION_IN_SECONDS, TURN_DURATION_IN_SECONDS } from 'src/configs/game-settings';
import { GameMode } from './game-mode/game-mode';
import { File } from 'w3ts';
import { OwnershipChangeEvent } from '../triggers/ownership-change-event';
import { CountdownMessage } from '../utils/messages';
import { NEUTRAL_HOSTILE, PlayGlobalSound } from '../utils/utils';
import { ActivePlayer } from '../player/types/active-player';
import { PlayerManager } from '../player/player-manager';
import { VictoryManager } from '../managers/victory-manager';
import { PLAYER_STATUS } from '../player/status/status-enum';
import { ScoreboardManager } from '../scoreboard/scoreboard-manager';
import { SettingsContext } from '../settings/settings-context';
import { CityToCountry } from '../country/country-map';
import { Wait } from '../utils/wait';

export class GameLoop {
	private _gameMode: GameMode;
	private _gameLoopTimer: timer;
	private _tickCounter: number;
	private _turnCount: number;

	constructor(gameMode: GameMode) {
		this._gameMode = gameMode;
		this._gameLoopTimer = CreateTimer();

		this.registerEvents();
	}

	private registerEvents() {
		OwnershipChangeEvent(() => this._gameMode.OnCityCapture);
	}

	public async preMatchCountdown() {
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

	public run() {
		this._gameMode.OnStartMatch();
		this._tickCounter = TURN_DURATION_IN_SECONDS;
		this._turnCount = 0;
		// Start a timer that executes the game loop every second
		TimerStart(this._gameLoopTimer, TICK_DURATION_IN_SECONDS, true, () => {
			try {
				// Check if the match is over
				if (this._gameMode.IsMatchOver()) {
					PauseTimer(this._gameLoopTimer);
					this._gameMode.OnEndMatch();
					return;
				}

				// Check if a turn has ended
				if (this._tickCounter == 0) {
					this._gameMode.OnEndTurn(this._turnCount);
				} else {
					this._gameMode.OnTick(this._tickCounter);
				}

				// Stop game loop if match is over
				if (this._gameMode.IsMatchOver()) {
					PauseTimer(this._gameLoopTimer);
					return;
				}

				this._tickCounter--;

				if (this._tickCounter <= 0) {
					this._tickCounter = TURN_DURATION_IN_SECONDS;
					this._turnCount++;
					this._gameMode.OnStartTurn(this._turnCount);
				}
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
}
