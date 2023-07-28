import { City } from '../city/city';
import { Spawner } from '../spawner/spawner';
import { HexColors } from '../utils/hex-colors';
import { NEUTRAL_HOSTILE, PlayLocalSound } from '../utils/utils';

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
		if (player == null) player = NEUTRAL_HOSTILE;

		this.owner = player;
		this.spawn.setOwner(player);
		this.onOwnerChange();
	}

	private onOwnerChange() {
		if (this.owner == NEUTRAL_HOSTILE) return;

		this.cities.forEach((city) => {
			const effect = AddSpecialEffect(
				'Abilities\\Spells\\Human\\Resurrect\\ResurrectCaster.mdl',
				city.barrack.defaultX,
				city.barrack.defaultY
			);
			BlzSetSpecialEffectScale(effect, 1.1);
			DestroyEffect(effect);
		});

		//TODO
		PlayLocalSound('Sound\\Interface\\Rescue.flac', this.owner);
		//DisplayTimedTextToPlayer(this.owner, 0.82, 0.81, 3.0, `${HexColors.TANGERINE}${this.name}|r has been conquered!`); //TODO
	}
}
