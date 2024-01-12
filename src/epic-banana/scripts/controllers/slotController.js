import { Script } from "../../../template/systems/script/script";

export const SlotController = Script.createScript({
  name: "slotController",

  attributes: {
  },

  initialize() {
    this.character = null;
  },

  addCharacter(char) {
    this.character = char;
    this.entity.addChild(this.character);
  },

  removeCurCharacter() {
    if (this.character === null) {
      return null;
    }
    this.entity.removeChild(this.character);
    let char = this.character;
    this.character = null;
    return char;
  },

  getBackCharacter() {
    this.character.setLocalPosition(0, 0, 0);
  },

  checkMerge(other) {
    return this.character.mergeController.canMerge(other.character.mergeController);
  },
});
