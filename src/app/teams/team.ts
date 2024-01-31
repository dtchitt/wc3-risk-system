import { STARTING_INCOME } from 'src/configs/game-settings';
import { ActivePlayer } from '../player/types/active-player';

export class Team {
	private teamNumber: number;
	private teamMembers: ActivePlayer[];
	private income: number;
	private cities: number;
	private kills: number;
	private deaths: number;

	public constructor(players: ActivePlayer[]) {
		this.teamNumber = GetPlayerTeam(players[0].getPlayer()) + 1;
		this.teamMembers = [];

		players.forEach((player) => {
			this.teamMembers.push(player);
		});

		this.income = players.length * STARTING_INCOME;
		this.cities = 0;
		this.kills = 0;
		this.deaths = 0;
	}

	public getNumber() {
		return this.teamNumber;
	}

	public getMembers() {
		return this.teamMembers;
	}

	public updateIncome(delta: number) {
		this.income += delta;
	}

	public updateCityCount(delta: number) {
		this.cities += delta;
	}

	public updateKillCount(delta: number) {
		this.kills += delta;
	}

	public updateDeathCount(delta: number) {
		this.deaths += delta;
	}

	public getIncome() {
		return this.income;
	}

	public getCities() {
		return this.cities;
	}

	public getKills() {
		return this.kills;
	}

	public getDeaths() {
		return this.deaths;
	}

	public sortPlayersByIncome() {
		this.teamMembers.sort((pA, pB) => {
			const playerAIncome: number = pA.trackedData.income.income;
			const playerBIncome: number = pB.trackedData.income.income;

			if (playerAIncome < playerBIncome) return 1;
			if (playerAIncome > playerBIncome) return -1;

			return 0;
		});
	}
}
