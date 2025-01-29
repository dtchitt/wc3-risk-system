import { GameMode } from './game-mode/game-mode';
import { City } from '../city/city';
import { ActivePlayer } from '../player/types/active-player';
import { CountdownMessage } from '../utils/messages';
import { PlayGlobalSound } from '../utils/utils';
import { TURN_DURATION_IN_SECONDS, TICK_DURATION_IN_SECONDS } from 'src/configs/game-settings';
import { File } from 'w3ts';
import { Wait } from '../utils/wait';
import { HexColors } from '../utils/hex-colors';
import { MatchData } from './state/match-state';
import { EventEmitter } from '../utils/events/event-emitter';
import {
	EVENT_GAME_RESTART,
	EVENT_IN_PROGRESS,
	EVENT_ON_CITY_CAPTURE,
	EVENT_ON_PLAYER_ALIVE,
	EVENT_ON_PLAYER_DEAD,
	EVENT_ON_PLAYER_FORFEIT,
	EVENT_ON_PLAYER_LEFT,
	EVENT_ON_PLAYER_NOMAD,
	EVENT_ON_PLAYER_STFU,
	EVENT_POST_MATCH,
	EVENT_PRE_MATCH,
	EVENT_SET_GAME_MODE,
	EVENT_START_GAME,
	EVENT_START_GAME_LOOP,
} from '../utils/events/event-constants';

export class GameLoop {
	private static instance: GameLoop;
	private _gameMode: GameMode;
	private _matchLoopTimer: timer;

	private constructor() {
		this.registerEvents();
		this._matchLoopTimer = CreateTimer();
	}

	public static getInstance() {
		if (this.instance == null) {
			this.instance = new GameLoop();
		}

		return this.instance;
	}

	private registerEvents() {
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_ALIVE, (player: ActivePlayer) => this._gameMode.onPlayerAlive(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_DEAD, (player: ActivePlayer) => this._gameMode.onPlayerDead(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_LEFT, (player: ActivePlayer) => this._gameMode.onPlayerLeft(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_NOMAD, (player: ActivePlayer) => this._gameMode.onPlayerNomad(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_STFU, (player: ActivePlayer) => this._gameMode.onPlayerSTFU(player));
		EventEmitter.getInstance().on(EVENT_ON_PLAYER_FORFEIT, (player: ActivePlayer) => this._gameMode.onPlayerForfeit(player));
		EventEmitter.getInstance().on(EVENT_ON_CITY_CAPTURE, (city: City, preOwner: ActivePlayer, owner: ActivePlayer) =>
			this._gameMode.onCityCapture(city, preOwner, owner)
		);
		EventEmitter.getInstance().on(EVENT_START_GAME, () => this.startCountdown());
		EventEmitter.getInstance().on(EVENT_GAME_RESTART, () => this._gameMode.onRematch());
		EventEmitter.getInstance().on(EVENT_SET_GAME_MODE, (gameMode: GameMode) => this.applyGameMode(gameMode));

		EventEmitter.getInstance().on(EVENT_PRE_MATCH, () => this._gameMode.onPreMatch());
		EventEmitter.getInstance().on(EVENT_IN_PROGRESS, () => this._gameMode.onInProgress());
		EventEmitter.getInstance().on(EVENT_POST_MATCH, () => this._gameMode.onPostMatch());

		EventEmitter.getInstance().on(EVENT_START_GAME_LOOP, () => this.startGameLoop());
	}

	public applyGameMode(gameMode: GameMode) {
		this._gameMode = gameMode;
	}

	public async startCountdown() {
		EventEmitter.getInstance().emit('matchStart');
		MatchData.matchState = 'preMatch';
		await Wait.forSeconds(2);
		try {
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
					this.startGameLoop();
					PlayGlobalSound('Sound\\Interface\\Hint.flac');
				}
				duration--;
			});
		} catch (error) {
			print('Error in Metagame ' + error);
		}
	}

	private startGameLoop() {
		MatchData.matchState = 'inProgress';
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
					this._gameMode.onEndMatch();
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
}
