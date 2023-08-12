import { NameManager } from 'src/app/managers/names/name-manager';
import { MAP_NAME, MAP_VERSION } from 'src/app/utils/map-info';
import { HexColors } from 'src/app/utils/hex-colors';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { PlayerManager } from 'src/app/player/player-manager';
import { UNIT_ID } from 'src/configs/unit-id';

export class StatisticsBoard {
	private static ranks: ActivePlayer[];
	private static columns: { column: number; size: number; header: string }[] = [
		{ column: 0, size: 0.11, header: 'Player Names' },
		{ column: 1, size: 0.04, header: 'Rank' },
		{ column: 2, size: 0.09, header: 'Biggest Rival' },
		{ column: 3, size: 0.06, header: 'Last Turn' },
		{ column: 4, size: 0.06, header: 'Cities\nMax/End' },
		{ column: 5, size: 0.08, header: 'Income\nMax/End' },
		{ column: 6, size: 0.05, header: 'Bounty' },
		{ column: 7, size: 0.05, header: 'Bonus' },
		{ column: 8, size: 0.09, header: 'Gold Earned/\nMax/End' },
		{ column: 9, size: 0.06, header: 'Kills\n(Value)' },
		{ column: 10, size: 0.06, header: 'Deaths\n(Value)' },
		{ column: 11, size: 0.06, header: 'KD Ratio\n(Value)' },
		{ column: 12, size: 0.06, header: 'SS Kills\n(Raw)' },
		{ column: 13, size: 0.06, header: 'SS Deaths\n(Raw)' },
		{ column: 14, size: 0.06, header: 'SS KD Ratio\n(Raw)' },
		{ column: 15, size: 0.06, header: 'Tank Kills\n(Raw)' },
		{ column: 16, size: 0.06, header: 'Tank Deaths\n(Raw)' },
		{ column: 17, size: 0.06, header: 'Tank KD Ratio\n(Raw)' },
	];

	private static setTextFunctions: ((player: ActivePlayer) => string)[] = [
		(player) => NameManager.getInstance().getDisplayName(player.getPlayer()),
		(player) => `${StatisticsBoard.ranks.indexOf(player) + 1}`,
		(player) => StatisticsBoard.getrival(player),
		(player) => `${player.trackedData.turnDied}`,
		(player) => `${player.trackedData.cities.max}/${player.trackedData.cities.end}`,
		(player) => `${player.trackedData.income.max}/${player.trackedData.income.end}`,
		(player) => `${player.trackedData.bounty.earned}`,
		(player) => `${player.trackedData.bonus.earned}`,
		(player) => `${player.trackedData.gold.earned}/${player.trackedData.gold.max}/${player.trackedData.gold.end}`,
		(player) => `${player.trackedData.killsDeaths.get(player.getPlayer()).killValue}`,
		(player) => `${player.trackedData.killsDeaths.get(player.getPlayer()).deathValue}`,
		(player) =>
			StatisticsBoard.computeRatio(
				player.trackedData.killsDeaths.get(player.getPlayer()).killValue,
				player.trackedData.killsDeaths.get(player.getPlayer()).deathValue
			),
		(player) => `${player.trackedData.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).kills}`,
		(player) => `${player.trackedData.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).deaths}`,
		(player) =>
			StatisticsBoard.computeRatio(
				player.trackedData.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).kills,
				player.trackedData.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).deaths
			),
		(player) => `${player.trackedData.killsDeaths.get(`${UNIT_ID.TANK}`).kills}`,
		(player) => `${player.trackedData.killsDeaths.get(`${UNIT_ID.TANK}`).deaths}`,
		(player) =>
			StatisticsBoard.computeRatio(
				player.trackedData.killsDeaths.get(`${UNIT_ID.TANK}`).kills,
				player.trackedData.killsDeaths.get(`${UNIT_ID.TANK}`).deaths
			),
	];

	public static create() {
		StatisticsBoard.ranks = VictoryManager.getInstance().ranks;

		const backdrop: framehandle = BlzCreateFrame('QuestButtonBaseTemplate', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_CENTER, 0.4, 0.3);
		BlzFrameSetSize(backdrop, 1, 0.56);
		BlzFrameSetVisible(backdrop, true);
		BlzFrameSetLevel(backdrop, 3);

		StatisticsBoard.header(backdrop);
		//StatisticsBoard.slider(backdrop);
		StatisticsBoard.buildColumns(backdrop);
	}

	private static header(backdrop: framehandle) {
		try {
			//Game Time
			const gameTime: framehandle = BlzCreateFrame('StatisticsHeader', backdrop, 0, 0);
			const turnTime: number = 60;
			const minutes: number = parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarSupplyText', 0))) - 1;
			const seconds: number = turnTime - parseInt(BlzFrameGetText(BlzGetFrameByName('ResourceBarUpkeepText', 0)));
			const hours: number = Math.floor(minutes / 60);
			const remainingMinutes: number = minutes % 60;
			const formattedTime: string = `${StatisticsBoard.addLeadingZero(hours)}:${StatisticsBoard.addLeadingZero(
				remainingMinutes
			)}:${StatisticsBoard.addLeadingZero(seconds)}`;

			BlzFrameSetText(gameTime, `${HexColors.TANGERINE}Game Time:|r ${formattedTime}\n${HexColors.TANGERINE}Total Turns:|r ${minutes}`);
			BlzFrameSetPoint(gameTime, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, 0.01, -0.01);

			//Game Name
			const gameNameText: framehandle = BlzCreateFrame('StatisticsHeader', backdrop, 0, 0);

			BlzFrameSetText(gameNameText, `${HexColors.TANGERINE}${MAP_NAME} ${MAP_VERSION}|r`);
			BlzFrameSetPoint(gameNameText, FRAMEPOINT_TOPRIGHT, backdrop, FRAMEPOINT_TOPRIGHT, -0.01, -0.01);

			//Winner
			const winnerText: framehandle = BlzCreateFrame('StatisticsHeader', backdrop, 0, 0);

			BlzFrameSetText(
				winnerText,
				`${HexColors.TANGERINE}Winner: |r${NameManager.getInstance().getDisplayName(StatisticsBoard.ranks[0].getPlayer())}`
			);
			BlzFrameSetPoint(winnerText, FRAMEPOINT_TOP, backdrop, FRAMEPOINT_TOP, 0, -0.01);
		} catch (error) {
			print(error);
		}
	}

	private static slider(backdrop: framehandle) {
		const frame: framehandle = BlzCreateFrame('EscMenuSliderTemplate', backdrop, 0, 0);

		BlzFrameSetPoint(frame, FRAMEPOINT_BOTTOM, backdrop, FRAMEPOINT_BOTTOM, 0, 0.01);
		BlzFrameSetSize(frame, 0.35, 0.011);
		BlzFrameSetMinMaxValue(frame, 1, 13);
		BlzFrameSetStepSize(frame, 1);

		const valueChangedTrigger: trigger = CreateTrigger();

		BlzTriggerRegisterFrameEvent(valueChangedTrigger, frame, FRAMEEVENT_SLIDER_VALUE_CHANGED);

		TriggerAddCondition(
			valueChangedTrigger,
			Condition(() => {
				try {
					const tFrame: framehandle = BlzGetTriggerFrame();
				} catch (error) {
					print(error);
				}
			})
		);
	}

	private static buildColumns(backdrop: framehandle) {
		const headerY: number = -0.05;
		const rowHeight: number = 0.02;
		let headerX: number = 0.008;

		for (const entry of StatisticsBoard.columns) {
			const { column, size, header } = entry;

			const container: framehandle = BlzCreateFrameByType('FRAME', `Column${column}`, backdrop, '', 0);
			BlzFrameSetPoint(container, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, headerX, headerY);
			BlzFrameSetSize(container, size, 0.5);

			const headerFrame: framehandle = BlzCreateFrame(`StatisticsColumnHeaders`, container, 0, 0);
			BlzFrameSetPoint(headerFrame, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, headerX, headerY);
			BlzFrameSetText(headerFrame, `${HexColors.TANGERINE}${header}|r`);
			BlzFrameSetSize(container, size, rowHeight);

			let yGap: number = -0.03;

			StatisticsBoard.ranks.forEach((player, rank) => {
				const dataFrame = BlzCreateFrame('StatisticsData', headerFrame, 0, 0);
				BlzFrameSetPoint(dataFrame, FRAMEPOINT_TOPLEFT, headerFrame, FRAMEPOINT_TOPLEFT, 0, yGap);
				BlzFrameSetText(dataFrame, `${StatisticsBoard.setTextFunctions[column](player)}`);
				yGap -= 0.02;
			});

			if (headerX > 0.75) {
				BlzFrameSetVisible(container, false);
			}

			headerX += size;
		}
	}

	private static addLeadingZero(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}

	private static hide() {
		//BlzFrameSetVisible()
	}

	private static reset() {
		StatisticsBoard.ranks = VictoryManager.getInstance().ranks;
	}

	private static getrival(player: ActivePlayer): string {
		let rival: ActivePlayer | null = null;
		let maxKills = 0;

		PlayerManager.getInstance().players.forEach((p) => {
			if (p === player) return;

			const killsOnPlayer = p.trackedData.killsDeaths.get(player.getPlayer()).kills;

			if (killsOnPlayer > maxKills) {
				maxKills = killsOnPlayer;
				rival = p;
			}
		});

		if (rival !== null) {
			return NameManager.getInstance().getDisplayName(rival.getPlayer()).split('#')[0];
		} else {
			return 'None';
		}
	}

	private static computeRatio(dividend: number, divisor: number): string {
		if (dividend === 0 && divisor === 0) return '0.00';
		if (divisor === 0) return dividend.toFixed(2);
		if (dividend === 0) return (-divisor).toFixed(2);

		return (dividend / divisor).toFixed(2);
	}
}
