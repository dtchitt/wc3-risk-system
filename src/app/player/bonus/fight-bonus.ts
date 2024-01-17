import { LocalMessage } from 'src/app/utils/messages';
import { Bonus } from './bonus';
import { HexColors } from 'src/app/utils/hex-colors';

export class FightBonus implements Bonus {
	private static readonly BASE: number = 10;
	private static readonly CAP: number = 60;
	private static readonly INTERVAL: number = 200;

	private goldEarned: number;
	private delta: number;
	private totalBonusVal: number;
	private ui: framehandle;
	private player: player;
	private enabled: boolean;

	constructor(player: player) {
		this.goldEarned = 0;
		this.player = player;
		this.enabled = true;
		this.ui = BlzCreateSimpleFrame('MyBarEx', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), GetPlayerId(player));
		this.reset();
		BlzFrameSetVisible(this.ui, false);
	}

	public get earned(): number {
		return this.goldEarned;
	}

	public showForPlayer(player: player) {
		if (!this.enabled) return;

		if (player == GetLocalPlayer()) {
			BlzFrameSetVisible(this.ui, true);
		}
	}

	public hideUI() {
		if (!this.enabled) return;

		BlzFrameSetVisible(this.ui, false);
	}

	public reset(): void {
		if (!this.enabled) return;

		this.delta = 0;
		this.totalBonusVal = 0;
		BlzFrameSetValue(this.ui, this.delta);
		this.setText();
	}

	public add(val: number): number {
		if (!this.enabled) return 0;

		let bonusAmount: number = 0;

		this.delta += val;
		this.totalBonusVal += val;

		if (this.delta >= FightBonus.INTERVAL) {
			bonusAmount = this.processBonus();
		}

		BlzFrameSetValue(this.ui, this.delta / 2);
		this.setText();

		return bonusAmount;
	}

	public repositon(reletiveFrame: framehandle) {
		if (!this.enabled) return;

		BlzFrameSetPoint(this.ui, FRAMEPOINT_BOTTOMRIGHT, reletiveFrame, FRAMEPOINT_TOPRIGHT, -0.025, 0);
	}

	public disable() {
		this.enabled = false;
		this.hideUI();
	}

	private processBonus(): number {
		if (!this.enabled) return 0;

		this.delta -= FightBonus.INTERVAL;

		let bonusAmount: number = Math.floor(this.totalBonusVal / FightBonus.INTERVAL);

		bonusAmount += FightBonus.BASE;
		bonusAmount = Math.min(bonusAmount, FightBonus.CAP);
		this.goldEarned += bonusAmount;

		LocalMessage(
			this.player,
			`Received ${HexColors.TANGERINE}${bonusAmount}|r gold from ${HexColors.RED}Fight Bonus|r!`,
			'Sound\\Interface\\Rescue.flac'
		);

		return bonusAmount;
	}

	private setText() {
		if (!this.enabled) return;

		BlzFrameSetText(BlzGetFrameByName('MyBarExText', GetPlayerId(this.player)), `Fight Bonus: ${this.delta} / ${FightBonus.INTERVAL}`);
	}
}
