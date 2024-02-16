import { City } from '../city/city';
import { Ownable } from '../interfaces/ownable';
import { Resetable } from '../interfaces/resetable';
import { Spawner } from '../spawner/spawner';
import { HexColors } from '../utils/hex-colors';
import { LocalMessage } from '../utils/messages';
import { NEUTRAL_HOSTILE } from '../utils/utils';

/**
 * Country is a class that represents a country within the game.
 * It implements the Resetable interface.
 */
export class Country implements Resetable, Ownable {
	private readonly name: string;
	private readonly cities: City[];
	private readonly spawn: Spawner;
	private readonly text: texttag;
	private owner: player;

	/**
	 * Country constructor.
	 * @param name - The name of the country.
	 * @param cities - An array of City objects that belong to this country.
	 * @param spawn - The Spawner object for this country.
	 */
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

	/**
	 * Resets the country, which involves resetting all its cities and spawn.
	 */
	public reset(): void {
		this.cities.forEach((city) => {
			city.reset();
		});

		this.spawn.reset();
		this.owner = NEUTRAL_HOSTILE;
	}

	/**
	 * Sets the owner of the country.
	 * @param player - The player object representing the new owner.
	 */
	public setOwner(player: player): void {
		if (player == null) player = NEUTRAL_HOSTILE;

		this.owner = player;
		this.spawn.setOwner(player);
		this.onOwnerChange();
	}

	/** @returns The player who currently owns this country. */
	public getOwner(): player {
		return this.owner;
	}

	/** @returns The name of the country. */
	public getName(): string {
		return this.name;
	}

	/** @returns An array of City objects that belong to this country. */
	public getCities(): City[] {
		return this.cities;
	}

	/** @returns The Spawner object for this country. */
	public getSpawn(): Spawner {
		return this.spawn;
	}

	/**
	 * Called when the owner of the country changes.
	 * Triggers various game events.
	 */
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

		LocalMessage(this.owner, `${this.name} ${HexColors.WHITE}has been conquered!|r`, 'Sound\\Interface\\Rescue.flac');
	}
}
