//Used to control how many of total cities you need.
//This is a percentage of the total cities .6 = 60%
export const CITIES_TO_WIN_MULTIPLIER: number = 0.6;

//This is the starting gold for each player. 4 by default.
export const STARTING_INCOME: number = 4;

//This is the duration of a turn in seconds. 60 by default.
export const TURN_DURATION_SECONDS: number = 60;

//This is the turn number for when the cities requirement
//is reduced by 1 percent each turn.
//90 by default, whhich is 1 hour and 30 minutes.
export const THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_TURN: number = 90;

//This is the modifier for the reduced win requirement. 0.01 is approximately 2 cities.
export const THRESHOLD_FOR_REDUCED_WIN_REQUIREMENT_MODIFIER: number = 0.01;
