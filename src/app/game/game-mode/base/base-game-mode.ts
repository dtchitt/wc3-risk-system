import { GameMode } from '../state/game-mode';
import { CountdownState } from '../standard-game-mode/countdown-state';
import { DefaultDistributeState } from '../base-game-mode.ts/city-distribute-state';
import { GameLoopState } from '../base-game-mode.ts/game-loop-state';
import { GameOverState } from '../base-game-mode.ts/game-over-state';
import { ResetState } from '../base-game-mode.ts/reset-state';
import { SetPromodeTempVisionState } from '../base-game-mode.ts/set-promode-temp-vision-state';
import { SetupState } from '../base-game-mode.ts/setup-state';
import { State } from '../state/state';

export abstract class BaseGameMode implements GameMode {
	constructor() {
		const gameMode: State[] = [
			new SetupState(),
			new DefaultDistributeState(),
			new SetPromodeTempVisionState(),
			new CountdownState(),
			new GameLoopState(),
			new GameOverState(),
			new ResetState(),
		];
	}
}
