/**
 * Handles the distribution of cities among active players.
 */
export interface DistributionService {
	runDistro(callback: () => void): void;
}
