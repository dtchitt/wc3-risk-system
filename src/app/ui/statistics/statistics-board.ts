import { NameManager } from 'src/app/managers/names/name-manager';
import { MAP_NAME, MAP_VERSION } from 'src/app/utils/map-info';
import { HideUI } from '../console';
import { HexColors } from 'src/app/utils/hex-colors';
import { VictoryManager } from 'src/app/managers/victory-manager';
import { ActivePlayer } from 'src/app/player/types/active-player';
import { TrackedData } from 'src/app/player/data/tracked-data';
import { UNIT_ID } from 'src/configs/unit-id';
import { PlayerManager } from 'src/app/player/player-manager';

export class StatisticsBoard {
	public static create() {
		const backdrop: framehandle = BlzCreateFrame('EscMenuBackdrop', BlzGetOriginFrame(ORIGIN_FRAME_GAME_UI, 0), 0, 0);
		BlzFrameSetSize(backdrop, 1.5, 1);
		BlzFrameSetAbsPoint(backdrop, FRAMEPOINT_CENTER, 0.4, 0.3);
		BlzFrameSetVisible(backdrop, true);

		StatisticsBoard.header(backdrop);
		StatisticsBoard.rowHeaders(backdrop);

		let x: number = 0.15;
		let cols: number = 0;
		VictoryManager.getInstance().ranks.forEach((player, index) => {
			if (cols >= 8) return;
			StatisticsBoard.buildDataColumn(backdrop, player, x, index);
			const length: number = NameManager.getInstance().getBtag(player.getPlayer()).split('#')[0].length / 100;
			x += length + 0.01;
			cols++;
		});

		HideUI(true);
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
			BlzFrameSetPoint(gameTime, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, 0.03, -0.03);

			//Game Name
			const gameNameText: framehandle = BlzCreateFrame('StatisticsHeader', backdrop, 0, 0);

			BlzFrameSetText(gameNameText, `${HexColors.TANGERINE}${MAP_NAME} ${MAP_VERSION}|r`);
			BlzFrameSetPoint(gameNameText, FRAMEPOINT_TOPRIGHT, backdrop, FRAMEPOINT_TOPRIGHT, -0.03, -0.03);

			//Winner
			const winnerText: framehandle = BlzCreateFrame('StatisticsHeader', backdrop, 0, 0);

			BlzFrameSetText(
				winnerText,
				`${HexColors.TANGERINE}Winner: |r${NameManager.getInstance().getDisplayName(VictoryManager.getInstance().leader.getPlayer())}`
			);
			BlzFrameSetPoint(winnerText, FRAMEPOINT_TOP, backdrop, FRAMEPOINT_TOP, 0, -0.03);
		} catch (error) {
			print(error);
		}
	}

	private static rowHeaders(backdrop: framehandle) {
		const playerNames: framehandle = BlzCreateFrame(`StatisticsDataHeaders`, backdrop, 0, 0);
		BlzFrameSetPoint(playerNames, FRAMEPOINT_TOPLEFT, backdrop, FRAMEPOINT_TOPLEFT, 0.03, -0.07);
		BlzFrameSetText(playerNames, `${HexColors.TANGERINE}Players|r`);

		const rank: framehandle = StatisticsBoard.buildRowHeader(playerNames, 'Rank', 'StatisticsDataHeaders', -0.017);
		const died: framehandle = StatisticsBoard.buildRowHeader(rank, 'Turn Died');
		const rival: framehandle = StatisticsBoard.buildRowHeader(died, 'Biggest Rival');
		const income: framehandle = StatisticsBoard.buildRowHeader(rival, 'Income Max/End', 'StatisticsDataHeadersSmall', -0.006);
		const gold: framehandle = StatisticsBoard.buildRowHeader(income, 'Gold Earned/Max/End', 'StatisticsDataHeadersSmall', -0.006);
		const bounty: framehandle = StatisticsBoard.buildRowHeader(gold, 'Bounty Earned');
		const bonus: framehandle = StatisticsBoard.buildRowHeader(bounty, 'Bonus Earned');
		const kdr: framehandle = StatisticsBoard.buildRowHeader(bonus, 'KD Value Ratio');
		const kdValue: framehandle = StatisticsBoard.buildRowHeader(kdr, 'K/D Value');
		const kdActual: framehandle = StatisticsBoard.buildRowHeader(kdValue, 'K/D Actual');
		const ssKDR: framehandle = StatisticsBoard.buildRowHeader(kdActual, 'SS KD Ratio');
		const ssKD: framehandle = StatisticsBoard.buildRowHeader(ssKDR, 'SS K/D Actual');
		const cities: framehandle = StatisticsBoard.buildRowHeader(ssKD, 'Cities Max/End');
		const riflemen: framehandle = StatisticsBoard.buildRowHeader(cities, 'Riflemen Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const priest: framehandle = StatisticsBoard.buildRowHeader(riflemen, 'Priest Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const mortor: framehandle = StatisticsBoard.buildRowHeader(priest, 'Mortor Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const roarer: framehandle = StatisticsBoard.buildRowHeader(mortor, 'Roarer Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const knight: framehandle = StatisticsBoard.buildRowHeader(roarer, 'Knight Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const general: framehandle = StatisticsBoard.buildRowHeader(knight, 'General Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const artillery: framehandle = StatisticsBoard.buildRowHeader(general, 'Artillery Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const tanks: framehandle = StatisticsBoard.buildRowHeader(artillery, 'Tank Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const marine: framehandle = StatisticsBoard.buildRowHeader(tanks, 'Marine Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const major: framehandle = StatisticsBoard.buildRowHeader(marine, 'Major Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const admiral: framehandle = StatisticsBoard.buildRowHeader(major, 'Admiral Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const warshipA: framehandle = StatisticsBoard.buildRowHeader(admiral, 'Warship A Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const warshipB: framehandle = StatisticsBoard.buildRowHeader(warshipA, 'Warship B Trained Value', 'StatisticsDataHeadersSmall', -0.006);
		const ss: framehandle = StatisticsBoard.buildRowHeader(warshipB, 'SS Trained Value', 'StatisticsDataHeadersSmall', -0.006);
	}

	private static buildRowHeader(
		parentFrame: framehandle,
		text: string,
		frameType: string = `StatisticsDataHeaders`,
		yShift: number = -0.005
	): framehandle {
		const frame: framehandle = BlzCreateFrame(frameType, parentFrame, 0, 0);
		BlzFrameSetText(frame, `${HexColors.TANGERINE}${text}|r`);
		BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parentFrame, FRAMEPOINT_BOTTOMLEFT, 0, yShift);

		return frame;
	}

	private static buildDataColumn(parent: framehandle, player: ActivePlayer, x: number, index: number) {
		try {
			const name: string = NameManager.getInstance().getDisplayName(player.getPlayer());
			const data: TrackedData = player.trackedData;

			const playerName: framehandle = BlzCreateFrame(`StatisticsDataHeadersSmall`, parent, 0, index);
			BlzFrameSetPoint(playerName, FRAMEPOINT_TOPLEFT, parent, FRAMEPOINT_TOPLEFT, x, -0.07);
			BlzFrameSetText(playerName, `${HexColors.TANGERINE}${name.split('#')[0]}`);

			const rank: framehandle = StatisticsBoard.addDataToColumn(playerName, index, `${index + 1}`, 'StatisticsDataHeaders', -0.02);
			const turnDied: framehandle = StatisticsBoard.addDataToColumn(rank, index, `${data.turnDied}`);
			const rival: framehandle = StatisticsBoard.addDataToColumn(turnDied, index, this.getrival(player));
			const income: framehandle = StatisticsBoard.addDataToColumn(
				rival,
				index,
				`${data.income.max}/${data.income.end}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const gold: framehandle = StatisticsBoard.addDataToColumn(
				income,
				index,
				`${data.gold.earned}/${data.gold.max}/${data.gold.end}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const bounty: framehandle = StatisticsBoard.addDataToColumn(gold, index, `${data.bounty.earned}`);
			const bonus: framehandle = StatisticsBoard.addDataToColumn(bounty, index, `${data.bonus.earned}`);
			const kdValueRatio: framehandle = StatisticsBoard.addDataToColumn(
				bonus,
				index,
				`${data.killsDeaths.get(player.getPlayer()).killValue / data.killsDeaths.get(player.getPlayer()).deathValue}`
			);
			const kdValue: framehandle = StatisticsBoard.addDataToColumn(
				kdValueRatio,
				index,
				`${data.killsDeaths.get(player.getPlayer()).killValue}/${data.killsDeaths.get(player.getPlayer()).deathValue}`
			);
			const kdActual: framehandle = StatisticsBoard.addDataToColumn(
				kdValue,
				index,
				`${data.killsDeaths.get(player.getPlayer()).kills}/${data.killsDeaths.get(player.getPlayer()).deaths}`
			);
			const ssKDR: framehandle = StatisticsBoard.addDataToColumn(
				kdActual,
				index,
				`${data.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).kills / data.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).deaths}`
			);
			const ssKDActual: framehandle = StatisticsBoard.addDataToColumn(
				ssKDR,
				index,
				`${data.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).kills}/${data.killsDeaths.get(`${UNIT_ID.BATTLESHIP_SS}`).deaths}`
			);
			const cities: framehandle = StatisticsBoard.addDataToColumn(ssKDActual, index, `${data.cities.max}/${data.cities.end}`);
			const riflemen: framehandle = StatisticsBoard.addDataToColumn(
				cities,
				index,
				`${data.trainedUnits.get(UNIT_ID.RIFLEMEN)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const priest: framehandle = StatisticsBoard.addDataToColumn(
				riflemen,
				index,
				`${data.trainedUnits.get(UNIT_ID.MEDIC)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const mortor: framehandle = StatisticsBoard.addDataToColumn(
				priest,
				index,
				`${data.trainedUnits.get(UNIT_ID.MORTAR)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const roarer: framehandle = StatisticsBoard.addDataToColumn(
				mortor,
				index,
				`${data.trainedUnits.get(UNIT_ID.ROARER)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const knight: framehandle = StatisticsBoard.addDataToColumn(
				roarer,
				index,
				`${data.trainedUnits.get(UNIT_ID.KNIGHT)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const general: framehandle = StatisticsBoard.addDataToColumn(
				knight,
				index,
				`${data.trainedUnits.get(UNIT_ID.GENERAL)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const artillery: framehandle = StatisticsBoard.addDataToColumn(
				general,
				index,
				`${data.trainedUnits.get(UNIT_ID.ARTILLERY)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const tanks: framehandle = StatisticsBoard.addDataToColumn(
				artillery,
				index,
				`${data.trainedUnits.get(UNIT_ID.TANK)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const marine: framehandle = StatisticsBoard.addDataToColumn(
				tanks,
				index,
				`${data.trainedUnits.get(UNIT_ID.MARINE)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const major: framehandle = StatisticsBoard.addDataToColumn(
				marine,
				index,
				`${data.trainedUnits.get(UNIT_ID.CAPTAIN)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const admiral: framehandle = StatisticsBoard.addDataToColumn(
				major,
				index,
				`${data.trainedUnits.get(UNIT_ID.ADMIRAL)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const warshipA: framehandle = StatisticsBoard.addDataToColumn(
				admiral,
				index,
				`${data.trainedUnits.get(UNIT_ID.WARSHIP_A)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const warshipb: framehandle = StatisticsBoard.addDataToColumn(
				warshipA,
				index,
				`${data.trainedUnits.get(UNIT_ID.WARSHIP_B)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
			const ss: framehandle = StatisticsBoard.addDataToColumn(
				warshipb,
				index,
				`${data.trainedUnits.get(UNIT_ID.BATTLESHIP_SS)}`,
				'StatisticsDataHeadersSmall',
				-0.006
			);
		} catch (error) {
			print(error);
		}
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

	private static addDataToColumn(
		parentFrame: framehandle,
		index: number,
		text: string,
		frameType: string = 'StatisticsDataHeaders',
		y: number = -0.005
	): framehandle {
		const frame: framehandle = BlzCreateFrame(frameType, parentFrame, 0, index);
		BlzFrameSetText(frame, `${HexColors.WHITE}${text}|r`);
		BlzFrameSetPoint(frame, FRAMEPOINT_TOPLEFT, parentFrame, FRAMEPOINT_BOTTOMLEFT, 0, y);

		return frame;
	}

	private static addLeadingZero(num: number): string {
		return num < 10 ? `0${num}` : `${num}`;
	}
}
