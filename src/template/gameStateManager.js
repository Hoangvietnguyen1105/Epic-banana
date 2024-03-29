import * as EventEmitter from "events";

export class GameStateManager {
  static init(state) {
    this.emitter = new EventEmitter();
    this.state = state;
  }

  static get state() {
    return this._state;
  }

  static set state(state) {
    if (this._state !== state) {
      this.prevState = this.state;
      this._state = state;
      if (this.emitter) {
        this.emitter.emit("changed", this.state, this.prevState);
      }
    }
  }

  static isState(...state) {
    for (var i = 0; i < state.length; i++) {
      if (state[i] === this.state) {
        return true;
      }
    }
    return false;
  }

  /**
   * @param {(state: GameState, prevState: GameState) => void} callback
   */
  static registerOnStateChangedCallback(callback) {
    this.emitter.on("changed", callback);
  }

  /**
   * @param {(state: GameState, prevState: GameState) => void} callback
   */
  static removeOnStateChangedCallback(callback) {
    this.emitter.off("changed", callback);
  }

  static turnOff() {
    this.emitter.removeAllListeners();
  }
}

export const GameState = {
  PlayingRun: "playingRun",
  PlayingArena: "playingArena",
  Win: "win",
  Lose: "lose",
  Paused: "paused",
  HomeRun: "homeRun",
  HomeArena: "homeArena",
  Challenge: "challenge",
};
