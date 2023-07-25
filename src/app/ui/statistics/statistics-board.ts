export class StatisticsBoard {
	constructor() {
		const backdrop: framehandle = BlzCreateFrame('EscMenuBackdrop', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetSize(backdrop, 1, 1);
		BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_CENTER, 0.4, 0.3);
		BlzFrameSetVisible(backdrop, true);
	}
}
