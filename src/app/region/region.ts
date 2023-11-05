import { Country } from '../country/country';
import { Resetable } from '../interfaces/resetable';
import { NEUTRAL_HOSTILE } from '../utils/utils';

export class Region implements Resetable {
	private _countries: Country[];
	private _goldBonus: number;
	private owner: player;

	constructor(countryData: Country[], goldBonus: number) {
		this._countries = [];

		countryData.forEach((country) => {
			this.countries.push(country);
		});

		this._goldBonus = goldBonus;
		this.owner = NEUTRAL_HOSTILE;
	}

	public reset(): void {
		this.owner = NEUTRAL_HOSTILE;
	}

	public setOwner(owner: player) {
		this.owner = owner;
	}

	public get countries(): Country[] {
		return this._countries;
	}

	public get goldBonus(): number {
		return this._goldBonus;
	}
}
