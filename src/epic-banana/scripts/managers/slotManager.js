import { Vec2, Vec3 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Script } from "../../../template/systems/script/script";
import { Tween } from "../../../template/systems/tween/tween";
import { DataLocal } from "../../data/dataLocal";
import { DataManager } from "../../data/dataManager";
import { UserData } from "../../data/userData";
import { CharacterFactory } from "../../objects/character/characterFactory";

export const SlotManager = Script.createScript({
  name: "slotManager",

  attributes: {
    isPlayerTeam: { default: null },
  },

  initialize() {
    if (!this.isPlayerTeam) {
      this.disableGrid();
    }
  },

  addChar(data, index) {
    let char = CharacterFactory.createCharacter(data.level, data.type);
    this.entity.children[index].controller.addCharacter(char);
    if (!this.isPlayerTeam) {
      char.controller.setAngle(180);
    }
  },

  addCharToNullSlot(level, type) {
    for (var i = this.entity.children.length - 1; i >= 0; i--) {
      if (!this.entity.children[i].controller.character) {
        let char = CharacterFactory.createCharacter(level, type);
        this.entity.children[i].controller.addCharacter(char);
        return i + 1;
      }
    }
    return 0;
  },

  addChars(number) {
    var posBegin = new Vec3();
    posBegin.x = DataManager.finishLine.pos.x;
    posBegin.y = DataManager.finishLine.pos.y;
    posBegin.z = DataManager.finishLine.pos.z;

    for (var i = 0; i < number; i++) {
      var rs = this.addCharToNullSlot(1, "melee");
      if (!rs) {
        UserData.stackMelee += (number - i);
        return;
      }
      var targetPos = this.entity.children[rs - 1].controller.character.getPosition().clone();
      this.entity.children[rs - 1].controller.character.setPosition(posBegin);
      Tween.createGlobalTranslateTween(this.entity.children[rs - 1].controller.character, targetPos, {
        duration: 0.5,
      }).start();
    }
  },

  enableGrid() {
    this.entity.children.forEach((child) => {
      child.grid.enabled = true;
    });
  },

  disableGrid() {
    this.entity.children.forEach((child) => {
      child.grid.enabled = false;
    });
  },
});
