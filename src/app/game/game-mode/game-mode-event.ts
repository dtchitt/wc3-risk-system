import { City } from 'src/app/city/city';
import { ActivePlayer } from 'src/app/player/types/active-player';

export interface GameModeEvents {
	onPlayerAlive: (player: ActivePlayer) => Promise<void>;
	onPlayerDead: (player: ActivePlayer) => Promise<void>;
	onPlayerNomad: (player: ActivePlayer) => Promise<void>;
	onPlayerLeft: (player: ActivePlayer) => Promise<void>;
	onPlayerSTFU: (player: ActivePlayer) => Promise<void>;
	onPlayerForfeit: (player: ActivePlayer) => Promise<void>;

	playerAlive: (player: ActivePlayer) => Promise<void>;
	playerDead: (player: ActivePlayer) => Promise<void>;
	playerNomad: (player: ActivePlayer) => Promise<void>;
	playerLeft: (player: ActivePlayer) => Promise<void>;
	playerSTFU: (player: ActivePlayer) => Promise<void>;
	playerForfeit: (player: ActivePlayer) => Promise<void>;

	onCityCapture: (city: City, preOwner: ActivePlayer, owner: ActivePlayer) => Promise<void>;
	onRematch: () => Promise<void>;

	cityCapture: (city: City, preOwner: ActivePlayer, owner: ActivePlayer) => Promise<void>;
	rematch: () => Promise<void>;
}
