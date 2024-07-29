import { EventTimer } from '../timer/EventTimer';
import { HexColors } from '../utils/hex-colors';
import { SettingsContext } from './settings-context';
import { DiplomacyOptions } from './strategies/diplomacy-strategy';
import { FogOptions } from './strategies/fog-strategy';
import { GameTypeOptions } from './strategies/game-type-strategy';
import { PromodeOptions } from './strategies/promode-strategy';

export class SettingsView {
	private backdrop: framehandle;
	private timer: framehandle;
	private duration: number;

	public constructor(duration: number) {
		this.duration = duration;
		this.backdrop = BlzCreateFrame('SettingsView', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetValue(BlzGetFrameByName('GameTypePopup', 0), 0);
		BlzFrameSetValue(BlzGetFrameByName('FogPopup', 0), 0);
		BlzFrameSetValue(BlzGetFrameByName('DiplomacyPopup', 0), 0);
		this.buildStartButton();
		this.buildTimer();
		this.gameTypePopup();
		this.fogPopup();
		this.diplomacyPopup();
		this.diplomacyQuantitySlider();
		this.promodeBox();
		this.hostSetup();
		this.playerSetup();
	}

	public update() {
		const event = EventTimer.getInstance().getEvent('settingsTimer');

		BlzFrameSetText(this.timer, I2S(event.remainingTime));
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
		BlzFrameSetText(this.timer, `${this.duration}`);
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
				EventTimer.getInstance().stopEvent('settingsTimer');
			})
		);
	}

	private gameTypePopup() {
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, BlzGetFrameByName('GameTypePopup', 0), FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				const frameValue: number = R2I(BlzGetTriggerFrameValue());

				SettingsContext.getInstance().getSettings().GameType = frameValue;
				this.colorizeText(`GameTypePopup`, GameTypeOptions);
			})
		);

		this.colorizeText(`GameTypePopup`, GameTypeOptions);
	}

	private fogPopup() {
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, BlzGetFrameByName('FogPopup', 0), FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				const frameValue: number = R2I(BlzGetTriggerFrameValue());

				SettingsContext.getInstance().getSettings().Fog = frameValue;
				this.colorizeText(`FogPopup`, FogOptions);
			})
		);

		this.colorizeText(`FogPopup`, FogOptions);
	}

	private diplomacyPopup() {
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, BlzGetFrameByName('DiplomacyPopup', 0), FRAMEEVENT_POPUPMENU_ITEM_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				const frameValue: number = R2I(BlzGetTriggerFrameValue());

				SettingsContext.getInstance().getSettings().Diplomacy.option = frameValue;
				this.colorizeText(`DiplomacyPopup`, DiplomacyOptions);

				if (frameValue > 0) {
					BlzFrameSetVisible(BlzGetFrameByName('DiplomacySlider', 0), true);
					BlzFrameSetText(
						BlzGetFrameByName('DiplomacySubOptionLabel', 0),
						`${R2I(BlzFrameGetValue(BlzGetFrameByName('DiplomacySlider', 0)))}`
					);
				} else {
					BlzFrameSetVisible(BlzGetFrameByName('DiplomacySlider', 0), false);
					BlzFrameSetText(BlzGetFrameByName('DiplomacySubOptionLabel', 0), `FFA`);
				}
			})
		);

		this.colorizeText(`DiplomacyPopup`, DiplomacyOptions);
	}

	private diplomacyQuantitySlider() {
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, BlzGetFrameByName('DiplomacySlider', 0), FRAMEEVENT_SLIDER_VALUE_CHANGED);
		TriggerAddCondition(
			t,
			Condition(() => {
				const frameValue: number = R2I(BlzGetTriggerFrameValue());

				SettingsContext.getInstance().getSettings().Diplomacy.allyLimit = frameValue;
				BlzFrameSetText(BlzGetFrameByName('DiplomacySubOptionLabel', 0), `${frameValue}`);
			})
		);

		BlzFrameSetVisible(BlzGetFrameByName('DiplomacySlider', 0), false);
		BlzFrameSetText(BlzGetFrameByName('DiplomacySubOptionLabel', 0), `FFA`);
	}

	private promodeBox() {
		const frame: framehandle = BlzGetFrameByName('PromodeCheckbox', 0);
		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_CHECKBOX_CHECKED);
		BlzTriggerRegisterFrameEvent(t, frame, FRAMEEVENT_CHECKBOX_UNCHECKED);
		TriggerAddCondition(
			t,
			Condition(() => {
				const fogFrame: framehandle = BlzGetFrameByName('FogPopup', 0);
				const diploFrame: framehandle = BlzGetFrameByName('DiplomacyPopup', 0);
				const sliderFrame: framehandle = BlzGetFrameByName('DiplomacySlider', 0);
				const labelFrame: framehandle = BlzGetFrameByName('DiplomacySubOptionLabel', 0);

				if (BlzGetTriggerFrameEvent() == FRAMEEVENT_CHECKBOX_CHECKED) {
					SettingsContext.getInstance().getSettings().Promode = 1;
					SettingsContext.getInstance().getSettings().Fog = 1;
					SettingsContext.getInstance().getSettings().Diplomacy.option = 1;

					BlzFrameSetValue(fogFrame, 1);
					BlzFrameSetEnable(fogFrame, false);
					BlzFrameSetValue(diploFrame, 1);
					BlzFrameSetEnable(diploFrame, false);
					BlzFrameSetVisible(sliderFrame, true);
					BlzFrameSetText(labelFrame, `${R2I(BlzFrameGetValue(sliderFrame))}`);
				} else {
					SettingsContext.getInstance().getSettings().Promode = 0;
					SettingsContext.getInstance().getSettings().Fog = 0;
					SettingsContext.getInstance().getSettings().Diplomacy.option = 0;
					BlzFrameSetValue(fogFrame, 0);
					BlzFrameSetEnable(fogFrame, true);
					BlzFrameSetValue(diploFrame, 0);
					BlzFrameSetEnable(diploFrame, true);
					BlzFrameSetVisible(sliderFrame, false);
					BlzFrameSetText(labelFrame, `FFA`);
				}

				this.colorizeText(`FogPopup`, FogOptions);
				this.colorizeText(`DiplomacyPopup`, DiplomacyOptions);
				BlzFrameSetText(BlzGetFrameByName('PromodeOption', 0), `${PromodeOptions[SettingsContext.getInstance().getSettings().Promode]}`);
			})
		);

		BlzFrameSetText(BlzGetFrameByName('PromodeOption', 0), `${PromodeOptions[SettingsContext.getInstance().getSettings().Promode]}`);
	}

	private colorizeText(frameName: string, optionsType: Record<number, string>) {
		const frame = BlzGetFrameByName(frameName, 0);
		const value = BlzFrameGetValue(frame);

		BlzFrameSetText(frame, `${optionsType[value]}`);
		BlzFrameSetText(BlzFrameGetChild(frame, 2), `${optionsType[value]}`);
	}

	private hostSetup() {
		BlzFrameSetEnable(BlzGetFrameByName('GameTypePopup', 0), false);

		if (GetLocalPlayer() == Player(0)) {
			BlzFrameSetVisible(BlzGetFrameByName('PopupMenuOptions', 0), false);
		}
	}

	private playerSetup() {
		if (GetLocalPlayer() != Player(0)) {
			BlzFrameSetVisible(BlzGetFrameByName('PopupMenus', 0), false);
			BlzFrameSetVisible(BlzGetFrameByName('StartButton', 0), false);
			BlzFrameSetVisible(BlzGetFrameByName('DiplomacySubOptionLabel', 0), false);
		}
	}
}
