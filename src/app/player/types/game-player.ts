export interface GamePlayer {
	onKill(victom: player, unit: unit): void;
	onDeath(killer: player, unit: unit): void;
	getPlayer(): player;
}
