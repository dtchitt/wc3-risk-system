import { City } from 'src/app/city/city';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { StateData } from './state-data';
import { EventEmitter } from 'src/app/utils/events/event-emitter';
import { EVENT_NEXT_STATE } from 'src/app/utils/events/event-constants';

export abstract class BaseState<T extends StateData> {
	stateData: T;

	onEnterState() {}
	onExitState() {}

	onPlayerAlive(player: ActivePlayer): void {}
	onPlayerDead(player: ActivePlayer): void {}
	onPlayerNomad(player: ActivePlayer): void {}
	onPlayerLeft(player: ActivePlayer): void {}
	onPlayerSTFU(player: ActivePlayer): void {}
	onPlayerForfeit(player: ActivePlayer): void {}

	onCityCapture(city: City, preOwner: ActivePlayer, owner: ActivePlayer) {}
	onUnitKilled(killingUnit: unit, dyingUnit: unit) {}

	onCitySelected(city: City, player: player) {}

	nextState(stateData: T) {
		EventEmitter.getInstance().emit(EVENT_NEXT_STATE, this.stateData);
	}
}
