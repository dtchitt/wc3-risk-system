export class SettingsView {
	private backdrop: framehandle;

	public constructor() {
		this.backdrop = BlzCreateFrame('EscMenuBackdrop', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetSize(this.backdrop, 0.25, 0.3);
		BlzFrameSetAbsPoint(this.backdrop, FRAMEPOINT_CENTER, 0.4, 0.35);
	}
}
