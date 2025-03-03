import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';
import { debugPrint } from 'src/app/utils/debug-print';

export class BaseData implements StateData {}

export abstract class BaseGameMode<T extends StateData> {
	private states: BaseState<T>[];
	private currentState: BaseState<T>;
	private initialData: T;

	protected abstract setupStates(): BaseState<T>[];
	protected abstract setupData(): T;

	constructor() {
		this.states = this.setupStates();
		this.initialData = this.setupData();
	}

	nextState(stateData: T) {
		debugPrint('BaseGameMode.nextState');
		this.currentState = this.states.shift();
		this.currentState.stateData = stateData;
		debugPrint('BaseGameMode.nextState: ' + this.currentState.constructor.name);

		this.currentState.onEnterState();
	}

	getCurrentState(): BaseState<T> {
		debugPrint('BaseGameMode.getCurrentState');
		return this.currentState;
	}
}
