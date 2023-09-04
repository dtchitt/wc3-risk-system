import { StringToCountry } from 'src/app/country/country-map';
import { Resetable } from 'src/app/interfaces/resetable';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { PlayerManager } from 'src/app/player/player-manager';
import { Scoreboards } from 'src/app/scoreboard/scoreboard-array';
import { HexColors } from 'src/app/utils/hex-colors';
import { GameState } from '../state/game-state';
import { NameManager } from 'src/app/managers/names/name-manager';
import { GlobalMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';

export class TimerService implements Resetable {
	private _timer: timer;
	private _duration: number;
	private _tick: number;
	private _turn: number;
	private gameState: GameState;
	private victoryManager: VictoryManager;

	public constructor(gameState: GameState) {
		this._timer = CreateTimer();
		this._duration = 60;
		this._tick = this._duration;
		this._turn = 1;
		this.gameState = gameState;
		this.victoryManager = VictoryManager.getInstance();
		this.victoryManager.setTimer(this);
	}

	public start(): void {
		TimerStart(this._timer, 1, true, () => {
			try {
				if (this._tick == this._duration) {
					PlayerManager.getInstance().players.forEach((player) => {
						player.giveGold();
					});

					if (this.victoryManager.checkCityVictory()) return;

					StringToCountry.forEach((country) => {
						country.getSpawn().step();
					});

					if (this.victoryManager.leader.trackedData.cities.cities.length >= Math.floor(VictoryManager.CITIES_TO_WIN * 0.7)) {
						GlobalMessage(
							`${NameManager.getInstance().getDisplayName(this.victoryManager.leader.getPlayer())} owns ${HexColors.RED}${
								this.victoryManager.leader.trackedData.cities.cities.length
							}|r cities and needs ${HexColors.RED}${
								VictoryManager.CITIES_TO_WIN - this.victoryManager.leader.trackedData.cities.cities.length
							}|r more to win!`,
							'Sound\\Interface\\ItemReceived.flac',
							4
						);
					}
				}

				if (this.victoryManager.checkKnockOutVictory()) return;

				Scoreboards.forEach((board) => {
					if (this._tick == this._duration) {
						board.updateFull();
					} else {
						board.updatePartial();
					}
				});

				this.updateUI();

				this._tick--;

				if (this._tick == 0) {
					this._tick = this._duration;
					this._turn++;
				}
			} catch (error) {
				print('Error in Timer' + error);
			}
		});
	}

	public stop() {
		PlayerManager.getInstance().players.forEach((val, key) => {
			const data: TrackedData = val.trackedData;
			if (data.turnDied == -1) data.turnDied = this._turn;
			if (data.cities.end == 0) data.cities.end = data.cities.cities.length;
		});

		PauseTimer(this._timer);
		this.gameState.end();
	}

	public reset(): void {
		this._tick = this._duration;
		this._turn = 1;
	}

	private updateUI() {
		let tick: string = `${this._tick}`;

		if (this._tick <= 3) {
			tick = `${HexColors.RED}${this._tick}|r`;
			PlayGlobalSound('Sound\\Interface\\BattleNetTick.flac');
		}

		BlzFrameSetText(BlzGetFrameByName('ResourceBarUpkeepText', 0), tick);
		BlzFrameSetText(BlzGetFrameByName('ResourceBarSupplyText', 0), `${this._turn}`);
	}
}
