import { GameConstant } from "../../../gameConstant";
import { Script } from "../../../template/systems/script/script";
import { CharacterType } from "../../objects/character/characterType";

export const MergeController = Script.createScript({
  name: "mergeController",

  attributes: {
    level: { default: 0 },
    type: { default: CharacterType.MELEE },
  },

  canMerge(other) {
    return (this.level === other.level && this.type === other.type && this.level < GameConstant.MAX_LEVEL);
  },

  getID() {
    return this.type + this.level;
  },
});
