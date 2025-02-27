import { City } from 'src/app/city/city';
import { BaseGameMode } from '../base/base-game-mode';
import { StateData } from '../state/state-data';

export class CapitalsData implements StateData {
	private playerCapitalSelections: Map<player, City>;
	private capitals: Map<player, City>;
}

export class CapitalsGameMode extends BaseGameMode {
	setup() {}
}
