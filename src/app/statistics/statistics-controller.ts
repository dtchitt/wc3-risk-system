import { NameManager } from '../managers/names/name-manager';
import { StatisticsModel } from './statistics-model';
import { StatisticsView } from './statistics-view';

export class StatisticsController {
	private static instance: StatisticsController;
	private model: StatisticsModel;
	private view: StatisticsView;

	private constructor() {
		this.model = new StatisticsModel();
		this.view = new StatisticsView(this.model);
		//this.refreshView();

		this.view.onMinimizeButtonClick(() => {
			const player: player = GetTriggerPlayer();

			if (this.view.getMinimizeButtonText() === 'Hide Stats') {
				this.view.hideStats(player);
			} else if (this.view.getMinimizeButtonText() === 'Show Stats') {
				this.view.showStats(player);
			}

			return false;
		});

		this.setViewVisibility(false);
	}

	public static getInstance(): StatisticsController {
		if (this.instance == null) {
			this.instance = new StatisticsController();
		}

		return this.instance;
	}

	public setViewVisibility(isVisible: boolean) {
		this.view.setVisibility(isVisible);
	}

	public setPlayedTimeText() {
		this.view.setPlayedTimeText(this.model.getTimePlayed());
	}

	public setGameWinnerText() {
		const winner: player = this.model.getWinner().getPlayer();
		const name: string = NameManager.getInstance().getDisplayName(winner);

		this.view.setGameWinnerText(name);
	}

	public refreshView() {
		this.model.setData();
		this.setPlayedTimeText();
		this.setGameWinnerText();
		this.view.refreshRows(this.model);
	}

	public getModel() {
		return this.model;
	}
}
