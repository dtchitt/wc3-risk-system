import { HexColors } from '../utils/hex-colors';
import { SettingsContext } from './settings-context';

export class SettingsHostView {
	private backdrop: framehandle;
	private timer: framehandle;

	public constructor() {
		this.backdrop = BlzCreateFrame('SettingsHostView', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);

		BlzFrameSetValue(BlzGetFrameByName('GameTypePopup', 0), 0);
		BlzFrameSetEnable(BlzGetFrameByName('GameTypePopup', 0), false);
		BlzFrameSetValue(BlzGetFrameByName('FogPopup', 0), 0);
		BlzFrameSetValue(BlzGetFrameByName('DiplomacyPopup', 0), 0);
		this.buildStartButton();
		this.buildTimer();
		this.gameTypePopup();
		this.fogPopup();
		this.diplomacyPopup();
		this.promodeBox();

		BlzFrameSetVisible(this.backdrop, false);

		if (GetLocalPlayer() == Player(0)) {
			BlzFrameSetVisible(this.backdrop, true);
		}
	}

	public update(time: number) {
		BlzFrameSetText(this.timer, time.toString());
	}

	public hide() {
		BlzFrameSetEnable(this.backdrop, false);
		BlzFrameSetVisible(this.backdrop, false);
	}

	public isVisible(): boolean {
		return BlzFrameIsVisible(this.backdrop);
	}

	private buildTimer() {
		const timerLabel = BlzCreateFrameByType('TEXT', 'SettingsHostTimerLabel', this.backdrop, '', 0);
		BlzFrameSetText(timerLabel, `${HexColors.TANGERINE}Auto Start in: `);
		BlzFrameSetScale(timerLabel, 1.2);
		BlzFrameSetPoint(timerLabel, FRAMEPOINT_BOTTOM, this.backdrop, FRAMEPOINT_BOTTOM, -0.008, 0.01);

		this.timer = BlzCreateFrameByType('TEXT', 'SettingsHostTimer', this.backdrop, '', 0);
		BlzFrameSetScale(this.timer, 1.2);
		BlzFrameSetPoint(this.timer, FRAMEPOINT_LEFT, timerLabel, FRAMEPOINT_RIGHT, 0.0, 0.0);
	}

	private buildStartButton() {
		const frame: framehandle = BlzCreateFrameByType('GLUETEXTBUTTON', 'StartButton', this.backdrop, 'ScriptDialogButton', 0);

		BlzFrameSetText(frame, 'Start');
		BlzFrameSetSize(frame, 0.13, 0.03);
		BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, this.backdrop, FRAMEPOINT_BOTTOM, 0, 0.03);

		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_CONTROL_CLICK);
		TriggerAddCondition(
			t,
			Condition(() => {
				this.hide();
			})
		);
	}

	private gameTypePopup() {
		const frame: framehandle = BlzGetFrameByName('GameTypePopup', 0);
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				SettingsContext.getInstance().getSettings().GameType = R2I(BlzGetTriggerFrameValue());
			})
		);
	}

	private fogPopup() {
		const frame: framehandle = BlzGetFrameByName('FogPopup', 0);
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				SettingsContext.getInstance().getSettings().Fog = R2I(BlzGetTriggerFrameValue());
			})
		);
	}

	private diplomacyPopup() {
		const frame: framehandle = BlzGetFrameByName('Diplomacy', 0);
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				SettingsContext.getInstance().getSettings().Diplomacy.option = R2I(BlzGetTriggerFrameValue());
			})
		);
	}

	private promodeBox() {
		const frame: framehandle = BlzGetFrameByName('PromodeCheckbox', 0);
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_CHECKBOX_CHECKED);
		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_CHECKBOX_UNCHECKED);
		TriggerAddCondition(
			t,
			Condition(() => {
				if (BlzGetTriggerFrameEvent() == FRAMEEVENT_CHECKBOX_CHECKED) {
					SettingsContext.getInstance().getSettings().Promode = 1;
					SettingsContext.getInstance().getSettings().Fog = 1;
					SettingsContext.getInstance().getSettings().Diplomacy.option = 1;
					BlzFrameSetValue(BlzGetFrameByName('FogPopup', 0), 1);
					BlzFrameSetValue(BlzGetFrameByName('DiplomacyPopup', 0), 1);
				} else {
					SettingsContext.getInstance().getSettings().Promode = 0;
					SettingsContext.getInstance().getSettings().Fog = 0;
					SettingsContext.getInstance().getSettings().Diplomacy.option = 0;
					BlzFrameSetValue(BlzGetFrameByName('FogPopup', 0), 0);
					BlzFrameSetValue(BlzGetFrameByName('DiplomacyPopup', 0), 0);
				}
			})
		);
	}
}
