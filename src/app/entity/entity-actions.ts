export interface EntityActions {
	onKill(victom: player, unit: unit): void;
	onDeath(killer: player, unit: unit): void;
}
