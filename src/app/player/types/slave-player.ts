import { GamePlayer } from './game-player';

export class SlavePlayer implements GamePlayer {
	private player: player;
	private _master: GamePlayer;

	constructor(player: player) {
		this.player = player;
	}

	public getPlayer(): player {
		return this.player;
	}

	public onKill(victom: player, unit: unit): void {
		this._master.onKill(victom, unit);
	}

	public onDeath(killer: player, unit: unit): void {
		this._master.onDeath(killer, unit);
	}

	public get master(): GamePlayer {
		return this._master;
	}

	public set master(value: GamePlayer) {
		this._master = value;
	}
}
