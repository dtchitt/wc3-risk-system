import { City } from 'src/app/city/city';
import { ActivePlayer } from 'src/app/player/types/active-player';

export interface GameModeEvents {
	onPlayerAlive: (player: ActivePlayer) => Promise<void>;
	onPlayerDead: (player: ActivePlayer) => Promise<void>;
	onPlayerNomad: (player: ActivePlayer) => Promise<void>;
	onPlayerLeft: (player: ActivePlayer) => Promise<void>;
	onPlayerSTFU: (player: ActivePlayer) => Promise<void>;
	onPlayerForfeit: (player: ActivePlayer) => Promise<void>;

	onCityCapture: (city: City, preOwner: ActivePlayer, owner: ActivePlayer) => Promise<void>;
	onRematch: () => Promise<void>;

	onPreMatch: () => Promise<void>;
	onInProgress: () => Promise<void>;
	onPostMatch: () => Promise<void>;

	isMatchOver: () => boolean;
	onStartMatch: () => Promise<void>;
	onEndMatch: () => void;
	onStartTurn: (turn: number) => void;
	onEndTurn: (turn: number) => void;
	onTick: (tick: number) => void;
}
