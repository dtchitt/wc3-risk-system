import { ActivePlayer } from '../../types/active-player';

export interface StatusStrategy {
	run: (gamePlayer: ActivePlayer) => void;
}
