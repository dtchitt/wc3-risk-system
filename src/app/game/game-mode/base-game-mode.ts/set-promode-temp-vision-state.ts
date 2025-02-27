import { setProModeTempVision } from '../base/utillity/pro-mode-temp-vision';
import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';

export class SetPromodeTempVisionState extends BaseState<StateData> {
	onEnterState() {
		this.runAsync();
	}

	async runAsync(): Promise<void> {
		await setProModeTempVision();

		this.nextState(this.stateData);
	}
}
