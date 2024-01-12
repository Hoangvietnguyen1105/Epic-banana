import { DataLocal } from "./dataLocal";


export class UserData {
  static init() {
    this.levelRangeUnlock = DataLocal.levelRangeUnlock;
    this.currentLevel = DataLocal.currentLevel;
    this.levelMeleeUnlock = DataLocal.levelMeleeUnlock;
    this.currency = DataLocal.currency;
    this.chars = DataLocal.chars;
    this.levelRise = DataLocal.levelRise;
    this.stackMelee = DataLocal.stackMelee;
    this.stackRange = DataLocal.stackRange;
    this.priceMelee = DataLocal.priceMelee;
    this.priceRange = DataLocal.priceRange;
    this.keys = DataLocal.keys;
    this.levelChallenge = DataLocal.levelChallenge;
  }
}