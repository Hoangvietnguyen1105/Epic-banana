import { Script } from "../../../template/systems/script/script";
import { UserData } from "../../data/userData";

export const LevelLoaderEvent = Object.freeze({
  Load: "levelloader:load",
});

export const LevelLoader = Script.createScript({
  name: "levelLoader",

  attributes: {
    playerSlotManager: { default: null },
    enemySlotManager: { default: null },
  },

  initialize() {
  },

  loadLevel(dataEnemy, dataPlayer = UserData.chars) {

    dataPlayer.forEach((char, index) => {
      if (char) {
        this.playerSlotManager.addChar(char, index);
      }
    });

    dataEnemy.forEach((char, index) => {
      if (index >= 15) return;
      if (char) {
        this.enemySlotManager.addChar(char, index);
      }
    });
  },
});
