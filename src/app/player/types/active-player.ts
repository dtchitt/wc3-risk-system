import { Resetable } from 'src/app/libs/resetable';
import { TrackedData } from '../data/tracked-data';
import { Options } from '../options';
import { Status } from '../status/status';
import { GamePlayer } from './game-player';

export abstract class ActivePlayer implements GamePlayer, Resetable {
	private _player: player;
	private _trackedData: TrackedData;
	private _status: Status;
	private _settings: Options;
	private _admin: boolean;

	constructor(player: player) {
		this._player = player;
		this._trackedData = new TrackedData(player);
		this._status = new Status(this);
		this._settings = {
			health: false,
			value: false,
			ping: false,
		};
		this._admin = false;
	}

	abstract onKill(victom: player, unit: unit): void;
	abstract onDeath(killer: player, unit: unit): void;

	public getPlayer(): player {
		return this._player;
	}

	public reset(): void {
		//TODO
	}

	public giveGold(val?: number): void {
		if (!val) val = this.trackedData.income.income;

		SetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD, GetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD) + val);

		if (val >= 1) this.trackedData.gold.earned += val;

		const goldAmount: number = GetPlayerState(this._player, PLAYER_STATE_RESOURCE_GOLD);

		if (goldAmount > this.trackedData.gold.max) {
			this.trackedData.gold.max = goldAmount;
		}
	}

	public get trackedData(): TrackedData {
		return this._trackedData;
	}

	public get status(): Status {
		return this._status;
	}

	public get settings(): Options {
		return this._settings;
	}

	public set admin(value: boolean) {
		this._admin = value;
	}

	public isAdmin(): boolean {
		return this._admin;
	}
}
