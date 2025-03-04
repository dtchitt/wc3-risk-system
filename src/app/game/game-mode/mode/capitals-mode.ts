import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { StateData } from '../state/state-data';
import { SetupState } from '../base-game-mode.ts/setup-state';
import { CityDistributeState } from '../base-game-mode.ts/city-distribute-state';
import { CountdownState } from '../base-game-mode.ts/countdown-state';
import { GameLoopState } from '../base-game-mode.ts/game-loop-state';
import { GameOverState } from '../base-game-mode.ts/game-over-state';
import { ResetState } from '../base-game-mode.ts/reset-state';
import { SetPromodeTempVisionState } from '../base-game-mode.ts/set-promode-temp-vision-state';
import { BaseState } from '../state/base-state';

export class CapitalsData implements StateData {
	private playerCapitalSelections: Map<player, City>;
	private capitals: Map<player, City>;
}

export class CapitalsMode extends BaseGameMode<CapitalsData> {
	override setupStates() {
		return [
			new SetupState(),
			new CityDistributeState(),
			new SetPromodeTempVisionState(),
			new CountdownState(),
			new GameLoopState(),
			new GameOverState(),
			new ResetState(),
		] as BaseState<CapitalsData>[];
	}

	protected setupData(): CapitalsData {
		return new CapitalsData();
	}
}
