import { setProModeTempVision } from '../utillity/pro-mode-temp-vision';
import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';

export class SetPromodeTempVisionState<T extends StateData> extends BaseState<T> {
	onEnterState() {
		this.runAsync();
	}

	async runAsync(): Promise<void> {
		await setProModeTempVision();
		this.nextState(this.stateData);
	}
}
