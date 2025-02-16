//Used to control how many of total cities you need.
//This is a percentage of the total cities .6 = 60%
export const CITIES_TO_WIN_RATIO: number = 0.6;

//This is the starting gold for each player. 4 by default.
export const STARTING_INCOME: number = 4;

//This is the duration of a turn in seconds. 60 by default.
export const TURN_DURATION_SECONDS: number = 60;

//This is the nomad duration in seconds. 60 by default.
export const NOMAD_DURATION: number = 60;

//This represents the drop in required cities to win each turn. Default is 1.
export const OVERTIME_MODIFIER: number = 1;

//This represents the ratio of total cities to conquer to win
export const CITIES_TO_WIN_WARNING_RATIO: number = 0.7;

//This represents whether player names should be exported
export const ENABLE_EXPORT_SHUFFLED_PLAYER_LIST: boolean = false;

//This represents whether game settings should be exported
export const ENABLE_EXPORT_GAME_SETTINGS: boolean = false;

//This represents whether end game score should be exported
export const ENABLE_EXPORT_END_GAME_SCORE: boolean = true;
