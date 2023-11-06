import { ActivePlayer } from '../types/active-player';
import { PLAYER_STATUS } from './status-enum';
import { AliveStrategy } from './strategies/alive-strategy';
import { DeadStrategy } from './strategies/dead-strategy';
import { LeftStrategy } from './strategies/left-strategy';
import { NomadStrategy } from './strategies/nomad-strategy';
import { StatusStrategy } from './strategies/status-strategy';
import { STFUStrategy } from './strategies/stfu-strategy';

export class Status {
	private player: ActivePlayer;
	private _status: string;
	private _statusDuration: number;

	private static readonly STRATEGY_MAP: Map<string, StatusStrategy> = new Map([
		[PLAYER_STATUS.ALIVE, new AliveStrategy()],
		[PLAYER_STATUS.NOMAD, new NomadStrategy()],
		[PLAYER_STATUS.DEAD, new DeadStrategy()],
		[PLAYER_STATUS.LEFT, new LeftStrategy()],
		[PLAYER_STATUS.STFU, new STFUStrategy()],
	]);

	constructor(player: ActivePlayer) {
		this.player = player;
		this.statusDuration = -1;
	}

	public set(status: string) {
		const strategy = Status.STRATEGY_MAP.get(status);

		if (strategy) {
			strategy.run(this.player);
		} else {
			print('Unknown player status:', status);
		}
	}

	public isAlive(): boolean {
		return this._status == PLAYER_STATUS.ALIVE;
	}

	public isDead(): boolean {
		return this._status == PLAYER_STATUS.DEAD;
	}

	public isLeft(): boolean {
		return this._status == PLAYER_STATUS.LEFT;
	}

	public isNomad(): boolean {
		return this._status == PLAYER_STATUS.NOMAD;
	}

	public isSTFU(): boolean {
		return this._status == PLAYER_STATUS.STFU;
	}

	public get status(): string {
		return this._status;
	}

	public set status(value: string) {
		this._status = value;
	}

	public get statusDuration(): number {
		return this._statusDuration;
	}

	public set statusDuration(value: number) {
		this._statusDuration = value;
	}
}
