import { StringToCountry } from 'src/app/country/country-map';
import { Resetable } from 'src/app/libs/resetable';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { PlayerManager } from 'src/app/player/player-manager';
import { Scoreboards } from 'src/app/scoreboard/scoreboard-array';
import { HexColors } from 'src/app/utils/hex-colors';
import { PlayGlobalSound } from 'src/app/utils/utils';

export class TimerService implements Resetable {
	private _timer: timer = CreateTimer();
	private _duration: number;
	private _tick: number;
	private _turn: number;

	public constructor() {
		this._duration = 60;
		this._tick = this._duration;
		this._turn = 1;
	}

	public start(): void {
		TimerStart(this._timer, 1, true, () => {
			try {
				if (this._tick == this._duration) {
					PlayerManager.getInstance().players.forEach((player) => {
						//This is dumb but w/e. cant set turn died in status strats so this is the way
						if (player.status.isDead() || (player.status.isForfeit() && player.trackedData.turnDied == 0)) {
							player.trackedData.turnDied == this._turn - 1;
						}

						player.giveGold();
					});

					if (VictoryManager.getInstance().checkCityVictory() != null) {
						this.stop();

						return;
					}

					StringToCountry.forEach((country) => {
						country.getSpawn().step();
					});
				}

				Scoreboards.forEach((board, index) => {
					if (this._tick == this._duration) {
						board.updateFull();
					} else {
						board.updatePartial();
					}
				});

				this.updateUI();

				if (VictoryManager.getInstance().checkKnockOutVictory() != null) {
					this.stop();
				}

				//TODO Player is close to Victory Message

				this._tick--;

				if (this._tick == 0) {
					this._tick = this._duration;
					this._turn++;
				}
			} catch (error) {
				print(error);
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
		DestroyTimer(this._timer);
	}

	public reset(): void {
		this._timer = CreateTimer();
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

	public get tick(): number {
		return this._tick;
	}

	public get turn(): number {
		return this._turn;
	}
}
