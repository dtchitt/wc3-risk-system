import { ActivePlayer } from '../player/types/active-player';
import { HexColors } from '../utils/hex-colors';

export type ButtonConfig = {
	player: ActivePlayer;
	createContext: number;
	key: oskeytype;
	textures: {
		primary: string;
		secondary: string;
	};
	xOffset: number;
	action: (context: number, textures: { primary: string; secondary: string }) => void;
};

export function createGuardButton(config: ButtonConfig): framehandle {
	const button = BlzCreateFrameByType(
		'BUTTON',
		'GuardButton',
		BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
		'ScoreScreenTabButtonTemplate',
		config.createContext
	);

	const buttonIconFrame = BlzCreateFrameByType('BACKDROP', 'GuardButtonBackdrop', button, '', config.createContext);

	BlzFrameSetAllPoints(buttonIconFrame, button);
	BlzFrameSetPoint(button, FRAMEPOINT_TOPLEFT, BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), FRAMEPOINT_TOPLEFT, config.xOffset, -0.025);
	BlzFrameSetSize(button, 0.02, 0.02);
	BlzFrameSetTexture(buttonIconFrame, config.textures.primary, 0, true);

	const tooltipFrame = BlzCreateFrame(
		'EscMenuControlBackdropTemplate',
		BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0),
		0,
		config.createContext
	);

	BlzFrameSetTooltip(button, tooltipFrame);

	const tooltipText = BlzCreateFrameByType('TEXT', 'GuardButtonToolTip', tooltipFrame, '', config.createContext);

	BlzFrameSetSize(tooltipText, 0.15, 0);
	BlzFrameSetPoint(tooltipFrame, FRAMEPOINT_BOTTOMLEFT, tooltipText, FRAMEPOINT_BOTTOMLEFT, -0.01, -0.01);
	BlzFrameSetPoint(tooltipFrame, FRAMEPOINT_TOPRIGHT, tooltipText, FRAMEPOINT_TOPRIGHT, 0.01, 0.01);

	BlzFrameSetPoint(tooltipText, FRAMEPOINT_TOPLEFT, button, FRAMEPOINT_BOTTOMLEFT, 0, -0.01);
	BlzFrameSetEnable(tooltipText, false);

	const str = config.key == OSKEY_F6 ? 'health' : 'value';

	BlzFrameSetText(
		tooltipText,
		`Sets your preference for unit ${str} when taking possession of a city.` + '\nCurrent preference: ' + `${HexColors.GREEN}` + 'Lowest'
	);

	const hotkeyTrigger = CreateTrigger();

	BlzTriggerRegisterPlayerKeyEvent(hotkeyTrigger, config.player.getPlayer(), config.key, 0, false);
	TriggerAddCondition(
		hotkeyTrigger,
		Condition(() => config.action(config.createContext, config.textures))
	);

	const buttonTrig = CreateTrigger();

	BlzTriggerRegisterFrameEvent(hotkeyTrigger, button, FRAMEEVENT_CONTROL_CLICK);
	TriggerAddCondition(
		buttonTrig,
		Condition(() => config.action(config.createContext, config.textures))
	);

	BlzFrameSetVisible(button, false);

	if (GetLocalPlayer() == config.player.getPlayer()) {
		BlzFrameSetVisible(button, true);
	}

	return button;
}
