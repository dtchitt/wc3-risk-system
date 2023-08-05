export class PlayerNames {
	private readonly _btag: string;
	private readonly _acct: string;
	private _color: string;

	constructor(name: string) {
		const splitName = name.split(' ')[0];

		if (splitName === 'Computer' || splitName === 'Local') {
			const uniqueId = '#' + Math.floor(Math.random() * 10000);

			this._btag = `${splitName}${uniqueId}`;
		} else {
			this._btag = splitName;
		}

		this._acct = this._btag.split('#')[0];
	}

	public get btag() {
		return this._btag;
	}

	public get acct() {
		return this._acct;
	}

	public set color(color: string) {
		this._color = color;
	}

	public get color() {
		return this._color;
	}
}
