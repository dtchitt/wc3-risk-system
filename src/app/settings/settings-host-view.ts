import { HexColors } from '../utils/hex-colors';

export class SettingsHostView {
	private backdrop: framehandle;
	private timer: framehandle;

	public constructor() {
		this.backdrop = BlzCreateFrame('SettingsHostView', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		this.buildStartButton();
		BlzFrameSetValue(BlzGetFrameByName('GameTypePopup', 0), 0);
		BlzFrameSetValue(BlzGetFrameByName('FogPopup', 0), 0);
		BlzFrameSetValue(BlzGetFrameByName('DiplomacyPopup', 0), 0);
		this.buildTimer();
	}

	private buildTimer() {
		const timerLabel = BlzCreateFrameByType('TEXT', 'SettingsHostTimerLabel', this.backdrop, '', 0);
		BlzFrameSetText(timerLabel, `${HexColors.TANGERINE}Auto Start in: `);
		BlzFrameSetScale(timerLabel, 1.2);
		BlzFrameSetPoint(timerLabel, FRAMEPOINT_BOTTOM, this.backdrop, FRAMEPOINT_BOTTOM, -0.008, 0.01);

		this.timer = BlzCreateFrameByType('TEXT', 'SettingsHostTimer', this.backdrop, '', 0);
		BlzFrameSetText(this.timer, ``);
		BlzFrameSetScale(this.timer, 1.2);
		BlzFrameSetPoint(this.timer, FRAMEPOINT_LEFT, timerLabel, FRAMEPOINT_RIGHT, 0.0, 0.0);
	}

	private buildStartButton() {
		const frame: framehandle = BlzCreateFrameByType(
			'GLUETEXTBUTTON',
			'StartButton',
			BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
			'ScriptDialogButton',
			0
		);

		BlzFrameSetText(frame, 'Start');
		BlzFrameSetSize(frame, 0.13, 0.03);
		BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, this.backdrop, FRAMEPOINT_BOTTOM, 0, 0.03);
	}

	public update(time: number) {
		BlzFrameSetText(this.timer, time.toString());
	}
}
