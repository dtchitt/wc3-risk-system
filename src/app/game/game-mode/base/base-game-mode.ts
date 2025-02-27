import { GameLoopState } from '../base-game-mode.ts/game-loop-state';
import { GameOverState } from '../base-game-mode.ts/game-over-state';
import { ResetState } from '../base-game-mode.ts/reset-state';
import { SetPromodeTempVisionState } from '../base-game-mode.ts/set-promode-temp-vision-state';
import { SetupState } from '../base-game-mode.ts/setup-state';
import { CityDistributeState } from '../base-game-mode.ts/city-distribute-state';
import { CountdownState } from '../base-game-mode.ts/countdown-state';
import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';

export abstract class BaseGameMode {
	constructor() {
		const gameMode: BaseState<StateData>[] = [
			new SetupState(),
			new CityDistributeState(),
			new SetPromodeTempVisionState(),
			new CountdownState(),
			new GameLoopState(),
			new GameOverState(),
			new ResetState(),
		];
	}

	
}
