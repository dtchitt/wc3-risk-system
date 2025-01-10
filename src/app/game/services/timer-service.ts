import { StringToCountry } from 'src/app/country/country-map';
import { Resetable } from 'src/app/interfaces/resetable';
import { VictoryManager, VictoryProgressState } from 'src/app/managers/victory-manager';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { PlayerManager } from 'src/app/player/player-manager';
import { HexColors } from 'src/app/utils/hex-colors';
import { GameState } from '../state/game-state';
import { NameManager } from 'src/app/managers/names/name-manager';
import { GlobalMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { File } from 'w3ts';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { CITIES_TO_WIN_WARNING_RATIO, TURN_DURATION_IN_SECONDS } from 'src/configs/game-settings';
import { ActivePlayer } from 'src/app/player/types/active-player';
/**
 * TimerService is a class responsible for managing the main game timer.
 * It implements the Resetable interface.
 */
export class TimerService implements Resetable {
	private _timer: timer;
	private _duration: number;
	private _tick: number;
	private _turn: number;
	private gameState: GameState;
	private victoryManager: VictoryManager;

	/**
	 * TimerService constructor.
	 * @param gameState - The current game state.
	 */
	public constructor(gameState: GameState) {
		this._timer = CreateTimer();
		this._duration = TURN_DURATION_IN_SECONDS;
		this._tick = this._duration;
		this._turn = 1;
		this.gameState = gameState;
		this.victoryManager = VictoryManager.getInstance();
		this.victoryManager.setTimer(this);
	}

	/**
	 * Starts the timer and begins the game logic for each tick.
	 */
	public start(): void {
		this.reset();
		TimerStart(this._timer, 1, true, () => {
			try {
				if (this._tick == this._duration) {
					let state = this.victoryManager.updateAndGetGameState();

					if (state == 'DECIDED') {
						this.victoryManager.saveStats();
						return false;
					}

					ScoreboardManager.updateScoreboardTitle();

					PlayerManager.getInstance().players.forEach((player) => {
						if (!player.status.isDead()) {
							player.giveGold();
						}
					});

					StringToCountry.forEach((country) => {
						country.getSpawn().step();
					});

					this.messageGameState(state);

					ScoreboardManager.getInstance().updateFull();
				} else {
					ScoreboardManager.getInstance().updatePartial();
				}

				this.updateUI();

				this._tick--;

				if (this._tick == 0) {
					this._tick = this._duration;
					this._turn++;
				}
			} catch (error) {
				File.write('errors', error as string);
				print('Error in Timer ' + error);
			}
		});
	}

	private messageGameState(state: VictoryProgressState) {
		let playersToAnnounce = this.victoryManager.getFrontRunnersByThreshold(VictoryManager.CITIES_TO_WIN * CITIES_TO_WIN_WARNING_RATIO);

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
			state == 'TIE' ? `${VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}TIED!\nGAME EXTENDED BY ONE ROUND!|r` : ''}` : '';
		const overtimeMessage = VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}OVERTIME!|r` : '';
		const playerMessages = playersToAnnounce.map((player) => announceCandidate(player, state)).join('\n');

		GlobalMessage([tiedMessage, overtimeMessage, playerMessages].join('\n\n'), 'Sound\\Interface\\ItemReceived.flac', 4);
	}

	/**
	 * Stops the timer and finalizes player and game data.
	 */
	public stop() {
		PlayerManager.getInstance().players.forEach((val, key) => {
			const data: TrackedData = val.trackedData;
			if (data.turnDied == -1) data.turnDied = this._turn;
			if (data.cities.end == 0) data.cities.end = data.cities.cities.length;
		});

		PauseTimer(this._timer);
		this.gameState.end();
	}

	/**
	 * Resets the timer back to its initial state.
	 */
	public reset(): void {
		this._tick = this._duration;
		this._turn = 1;
	}

	/**
	 * Update the UI elements related to the timer.
	 */
	private updateUI() {
		let tick: string = `${this._tick}`;

		if (this._tick <= 3) {
			tick = `${HexColors.RED}${this._tick}|r`;
			PlayGlobalSound('Sound\\Interface\\BattleNetTick.flac');
		}

		BlzFrameSetText(BlzGetFrameByName('ResourceBarUpkeepText', 0), tick);
		BlzFrameSetText(BlzGetFrameByName('ResourceBarSupplyText', 0), `${this._turn}`);
	}

	public getTurns(): number {
		return this._turn;
	}
}
