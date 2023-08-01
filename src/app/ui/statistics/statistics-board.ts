import { PlayerManager } from 'src/app/player/player-manager';
import { HideUI } from '../console';
import { NameManager } from 'src/app/managers/names/name-manager';

export class StatisticsBoard {
	public static create() {
		// const backdrop: framehandle = BlzCreateFrame('EscMenuBackdrop', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		// BlzFrameSetSize(backdrop, 1.5, 1);
		// BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_CENTER, 0.4, 0.3);
		// BlzFrameSetVisible(backdrop, true);

		//StatisticsBoard.header(backdrop);
		//StatisticsBoard.slider(backdrop);
		//StatisticsBoard.columns(backdrop);
		const test: framehandle = BlzCreateFrame('LadderPanel', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		HideUI(true);
	}

	private static header(backdrop: framehandle) {
		try {
			const gameTime: framehandle = BlzCreateFrame('StatisticsText', backdrop, 0, 0);
			const turnTime: number = 60;
			const minutes: number = parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0))) - 1;
			const seconds: number = turnTime - parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarUpkeepText', 0)));
			const hours: number = Math.floor(minutes / 60);
			const remainingMinutes: number = minutes % 60;
			const formattedTime: string = `${StatisticsBoard.addLeadingZero(hours)}:${StatisticsBoard.addLeadingZero(
				remainingMinutes
			)}:${StatisticsBoard.addLeadingZero(seconds)}`;

			BlzFrameSetText(gameTime, `Game Time: ${formattedTime}`);
			BlzFrameSetPoint(gameTime, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, 0.025, -0.025);
		} catch (error) {
			print(error);
		}
	}

	private static addLeadingZero(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}

	private static slider(backdrop: framehandle) {
		const slider: framehandle = BlzCreateFrameByType('SLIDER', 'StatisticsBoardSlider', backdrop, 'QuestMainListScrollBar', 0);

		BlzFrameSetPoint(slider, FRAMEPOINT_RIGHT, backdrop, FRAMEPOINT_RIGHT, -0.03, 0.05);
		BlzFrameSetSize(slider, 0.012, 0.3);
		BlzFrameSetMinMaxValue(slider, 0, 20);
		BlzFrameSetStepSize(slider, 1);

		const t: trigger = CreateTrigger();
		BlzTriggerRegisterFrameEvent(t, slider, FRAMEEVENT_MOUSE_WHEEL);
		TriggerAddCondition(
			t,
			Condition(() => {
				BlzFrameSetValue(slider, BlzFrameGetValue(slider) + 1);
			})
		);
	}

	private static columns(backdrop: framehandle) {
		let x: number = 0;

		PlayerManager.getInstance().players.forEach((player) => {
			const playerName: string = NameManager.getInstance().getBtag(player.getPlayer());
			//const text: framehandle = BlzCreateFrameByType('TEXT', `SB${playerName}`, backdrop, 'EscMenuLabelTextTemplate', 0);
			const col: framehandle = BlzCreateFrame('StatisticsText', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
			BlzFrameSetText(col, 'TEST');
			BlzFrameSetPoint(col, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, x, 0);
			x += 0.1;
		});
	}
}
