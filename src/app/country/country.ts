import { City } from '../city/city';
import { Spawner } from '../spawner/spawner';
import { HexColors } from '../utils/hex-colors';

export class Country {
	private readonly name: string;
	private readonly cities: City[];
	private readonly spawn: Spawner;
	private readonly text: texttag;
	private owner: player;

	constructor(name: string, cities: City[], spawn: Spawner) {
		this.name = name;
		this.cities = cities;
		this.spawn = spawn;

		const offsetX: number = GetUnitX(this.spawn.unit) - 100;
		const offsetY: number = GetUnitY(this.spawn.unit) - 300;
		const lengthCheck: number = this.name.length * 5.5 < 200 ? this.name.length * 5.5 : 200;

		this.text = CreateTextTag();
		SetTextTagText(this.text, `${HexColors.TANGERINE} ${this.name}`, 0.028);
		SetTextTagPos(this.text, offsetX - lengthCheck, offsetY, 16.0);
		SetTextTagVisibility(this.text, true);
		SetTextTagPermanent(this.text, true);
	}

	public getName(): string {
		return this.name;
	}

	public getCities(): City[] {
		return this.cities;
	}

	public getSpawn(): Spawner {
		return this.spawn;
	}

	public getOwner(): player {
		return this.owner;
	}

	public setOwner(player: player): void {
		if (this.owner != null) {
			//this._owner.getRoundData().data.income.income -= this._cities.length;
			this.owner == null;
			this.spawn.setOwner(null);
		}

		if (player == null) return;

		this.owner = player;
		this.spawn.setOwner(player);
		//player.getRoundData().data.income.income += this._cities.length;
	}

	private onOwnerChange() {}
}
