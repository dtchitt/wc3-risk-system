import { CityDistributeState } from '../base-game-mode.ts/city-distribute-state';
import { CountdownState } from '../base-game-mode.ts/countdown-state';
import { GameLoopState } from '../base-game-mode.ts/game-loop-state';
import { GameOverState } from '../base-game-mode.ts/game-over-state';
import { ResetState } from '../base-game-mode.ts/reset-state';
import { SetPromodeTempVisionState } from '../base-game-mode.ts/set-promode-temp-vision-state';
import { SetupState } from '../base-game-mode.ts/setup-state';
import { BaseGameMode } from './base-game-mode';
import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';

export class StandardData implements StateData {}

export class StandardGameMode extends BaseGameMode<StandardData> {
	override setupStates() {
		return [
			new SetupState(),
			new CityDistributeState(),
			new SetPromodeTempVisionState(),
			new CountdownState(),
			new GameLoopState(),
			new GameOverState(),
			new ResetState(),
		] as BaseState<StandardData>[];
	}

	override setupData() {
		return new StandardData();
	}
}
