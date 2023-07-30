export class ObserverUI {
	public static ControlButton(player: player) {
		const button: framehandle = BlzCreateSimpleFrame('ObserverControlButton', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0);
		BlzFrameSetVisible(BlzGetFrameByName('UpperButtonBarQuestsButton', 0), false);
		BlzFrameSetVisible(button, false);
		BlzFrameSetLevel(button, 3);

		const t: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(t, button, FRAMEEVENT_CONTROL_CLICK);

		TriggerAddCondition(
			t,
			Condition(() => {
				const frame: framehandle = BlzGetTriggerFrame();
				print(`clicked`);
			})
		);

		if (player == GetLocalPlayer()) {
			BlzFrameSetVisible(button, true);
		}
	}
}
