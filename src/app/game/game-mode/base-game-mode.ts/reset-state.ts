import { Wait } from 'src/app/utils/wait';
import { TreeManager } from '../../services/tree-service';
import { removeUnits } from '../base/utillity/remove-units';
import { resetCountries } from '../base/utillity/reset-countries';
import { resumingUnits } from '../base/utillity/resuming-units';
import { BaseState } from '../state/base-state';
import { StatisticsController } from 'src/app/statistics/statistics-controller';
import { StateData } from '../state/state-data';

export class ResetState extends BaseState<StateData> {
	onEnterState() {
		this.runAsync();
	}

	async runAsync(): Promise<void> {
		FogEnable(false);

		StatisticsController.getInstance().setViewVisibility(false);

		print('Removing units...');
		removeUnits();
		await Wait.forSeconds(1);
		print('Resuming units...');
		resumingUnits();
		await Wait.forSeconds(1);
		print('Resetting countries...');
		resetCountries();
		await Wait.forSeconds(1);
		print('Resetting trees...');
		TreeManager.getInstance().reset();
		await Wait.forSeconds(1);

		this.nextState(this.stateData);
	}
}
