export interface GameMode {
	IsMatchOver(): boolean;
	OnStartMatch(): void;
	OnEndMatch(): void;
	OnStartTurn(turn: number): void;
	OnEndTurn(turn: number): void;
	OnTick(tick: number): void;

	OnCityCapture(): void;
	OnForfeits(): void;
	OnRematch(): void;

	StartMatch(): void;
	EndMatch(): void;
	StartTurn(turn: number): void;
	EndTurn(turn: number): void;
	Tick(tick: number): void;
}

export abstract class BaseGameMode implements GameMode {}
