import { BaseState } from '../state/base-state';
import { StateData } from '../state/state-data';

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
		this.currentState = this.states.shift();
		this.currentState.stateData = stateData;
		this.currentState.onEnterState();
	}

	getCurrentState(): BaseState<T> {
		return this.currentState;
	}
}
