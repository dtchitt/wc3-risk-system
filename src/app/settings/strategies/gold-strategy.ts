import { SettingsStrategy } from './settings-strategy';

export const GoldOptions: Record<number, string> = {
	0: 'off',
	1: 'on',
};

export class GoldStrategy implements SettingsStrategy {
	private readonly goldSending: number;
	private readonly strategyMap: Map<number, () => void> = new Map([
		[0, this.handleGoldSending],
		[1, this.handleNoGoldSending],
	]);

	constructor(goldSending: number) {
		this.goldSending = goldSending;
	}

	public apply(): void {
		const handler = this.strategyMap.get(this.goldSending);
		if (handler) {
			handler();
		}
	}

	private handleGoldSending(): void {
		//TODO - we can add the chat command here the command will slightly vary in each case
	}

	private handleNoGoldSending(): void {
		//TODO - we can add the chat command here the command will slightly vary in each case
	}
}

//test
//-gAcctName 5
//-g AcctName5
//-g AcctName 5
//-gAcctName
//-g
//-g AcctName
//-g AcctName MoreChars
//-gAcctName MoreChars
//-g 5

//verify str split[1] = useable player name
//verify str split[2] = number
//before verify make sure to trim and remove all whitespace
