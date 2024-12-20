import {
    PlayerData,
    CharacterStats,
    LocationData,
    MapSaveData,
} from "../../data/type";
import {
    StatsAction,
    LocationAction,
    MapAction,
    PlayerAction,
} from "../actionTypes";

export const statsReducer = (
    state: CharacterStats,
    action: StatsAction,
): CharacterStats => {
    switch (action.type) {
        case "UPDATE_STATS":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export const locationReducer = (
    state: LocationData,
    action: LocationAction,
): LocationData => {
    switch (action.type) {
        case "UPDATE_LOCATION":
            return action.payload;
        default:
            return state;
    }
};

export const mapReducer = (
    state: MapSaveData,
    action: MapAction,
): MapSaveData => {
    switch (action.type) {
        case "UPDATE_MAP":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};

export const playerReducer = (
    state: PlayerData,
    action: PlayerAction,
): PlayerData => {
    switch (action.type) {
        case "UPDATE_PLAYER":
            return {
                ...state,
                ...action.payload,
            };
        default:
            return state;
    }
};
