import { TICK_DURATION_IN_SECONDS, TURN_DURATION_IN_SECONDS } from 'src/configs/game-settings';
import { GameMode } from './game-mode/game-mode';
import { File } from 'w3ts';

export class GameLoop {
	private _gameMode: GameMode;
	private _timer: timer;
	private _tickCounter: number;
	private _turnCount: number;

	public GameLoop(gameMode: GameMode) {
		this._gameMode = gameMode;
		this._timer = CreateTimer();
	}

	public run() {
		this._gameMode.OnStartMatch();
		this._tickCounter = TURN_DURATION_IN_SECONDS;
		this._turnCount = 0;
		// Start a timer that executes the game loop every second
		TimerStart(this._timer, TICK_DURATION_IN_SECONDS, true, () => {
			try {
				// Check if the match is over
				if (this._gameMode.IsMatchOver()) {
					PauseTimer(this._timer);
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
					PauseTimer(this._timer);
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
}
