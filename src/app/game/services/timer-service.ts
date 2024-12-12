import { StringToCountry } from 'src/app/country/country-map';
import { Resetable } from 'src/app/interfaces/resetable';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { PlayerManager } from 'src/app/player/player-manager';
import { HexColors } from 'src/app/utils/hex-colors';
import { GameState } from '../state/game-state';
import { NameManager } from 'src/app/managers/names/name-manager';
import { GlobalMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { File } from 'w3ts';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { TURN_DURATION_SECONDS } from 'src/configs/game-settings';

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
		this._duration = TURN_DURATION_SECONDS;
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
					if (this.victoryManager.checkCityVictory()) return false;

					ScoreboardManager.updateScoreboardTitle();

					PlayerManager.getInstance().players.forEach((player) => {
						if (!player.status.isDead()) {
							player.giveGold();
						}
					});

					StringToCountry.forEach((country) => {
						country.getSpawn().step();
					});

					if (this.victoryManager.leader.trackedData.cities.cities.length >= Math.floor(VictoryManager.CITIES_TO_WIN * 0.7)) {
						GlobalMessage(
							`${NameManager.getInstance().getDisplayName(this.victoryManager.leader.getPlayer())} owns ${HexColors.RED}${
								this.victoryManager.leader.trackedData.cities.cities.length
							}|r cities and needs ${HexColors.RED}${
								VictoryManager.CITIES_TO_WIN - this.victoryManager.leader.trackedData.cities.cities.length
							}|r more to win! ${VictoryManager.OVERTIME_ACTIVE ? ` ${HexColors.RED}(Overtime is active!)|r` : ''}`,
							'Sound\\Interface\\ItemReceived.flac',
							4
						);
					}

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
