import { StringToCountry } from 'src/app/country/country-map';
import { NameManager } from 'src/app/managers/names/name-manager';
import { VictoryProgressState, VictoryManager } from 'src/app/managers/victory-manager';
import { PlayerManager } from 'src/app/player/player-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { ScoreboardManager } from 'src/app/scoreboard/scoreboard-manager';
import { HexColors } from 'src/app/utils/hex-colors';
import { GlobalMessage } from 'src/app/utils/messages';
import { PlayGlobalSound } from 'src/app/utils/utils';
import { CITIES_TO_WIN_WARNING_RATIO } from 'src/configs/game-settings';
import { City } from 'src/app/city/city';

export interface GameMode {
	IsMatchOver(): boolean;
	OnStartMatch(): void;
	OnEndMatch(): void;
	OnStartTurn(turn: number): void;
	OnEndTurn(turn: number): void;
	OnTick(tick: number): void;

	OnCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void;
	OnForfeits(): void;
	OnRematch(): void;
}

export abstract class BaseGameMode implements GameMode {
	private isMatchOver: boolean = false;
	private _tickCounter: number;
	private _turnCount: number;

	IsMatchOver(): boolean {
		print('IsMatchOver');
		return this.isMatchOver;
	}

	OnStartMatch(): void {
		print('OnStartMatch');
		this.isMatchOver = false;
	}

	OnEndMatch(): void {
		print('OnEndMatch');
		this.isMatchOver = true;
	}

	OnStartTurn(turn: number): void {
		print('OnStartTurn');
		this._turnCount = turn;
		let state = VictoryManager.getInstance().updateAndGetGameState();

		PlayerManager.getInstance().players.forEach((player) => {
			if (!player.status.isDead()) {
				player.giveGold();
			}
		});

		StringToCountry.forEach((country) => {
			country.getSpawn().step();
		});

		this.messageGameState(state);
	}

	OnEndTurn(turn: number): void {
		print('OnEndTurn');
		let state = VictoryManager.getInstance().updateAndGetGameState();

		if (state == 'DECIDED') {
			this.isMatchOver = true;
			VictoryManager.getInstance().endGame();
			return;
		}

		ScoreboardManager.updateScoreboardTitle();
		ScoreboardManager.getInstance().updateFull();
	}

	OnTick(tick: number): void {
		print('OnTick');

		this._tickCounter = tick;

		ScoreboardManager.getInstance().updatePartial();
		this.updateUI(this._turnCount, this._tickCounter);
	}

	OnCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer): void {
		print('OnCityCapture');
		return;
	}

	OnForfeits(): void {
		print('OnForfeits');
	}

	OnRematch(): void {
		print('OnForfeits');
	}

	private messageGameState(state: VictoryProgressState) {
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
			state == 'TIE' ? `${VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}TIED!\nGAME EXTENDED BY ONE ROUND!|r` : ''}` : '';
		const overtimeMessage = VictoryManager.OVERTIME_ACTIVE ? `${HexColors.RED}OVERTIME!|r` : '';
		const playerMessages = playersToAnnounce.map((player) => announceCandidate(player, state)).join('\n');

		GlobalMessage([tiedMessage, overtimeMessage, playerMessages].join('\n\n'), 'Sound\\Interface\\ItemReceived.flac', 4);
	}

	private updateUI(turn: number, tick: number) {
		let tickString = `${tick}`;
		if (tick <= 3) {
			tickString = `${HexColors.RED}${tick}|r`;
			PlayGlobalSound('Sound\\Interface\\BattleNetTick.flac');
		}

		BlzFrameSetText(BlzGetFrameByName('ResourceBarUpkeepText', 0), tickString);
		BlzFrameSetText(BlzGetFrameByName('ResourceBarSupplyText', 0), `${turn}`);
	}

	public getTurnCount(): number {
		return this._turnCount;
	}

	public getTickCount(): number {
		return this._tickCounter;
	}
}
