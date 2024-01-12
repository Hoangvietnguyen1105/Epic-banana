import { Ray, Vec3 } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { Script } from "../../../template/systems/script/script";
import { Tween } from "../../../template/systems/tween/tween";
import { CharacterFactory } from "../../objects/character/characterFactory";
import { CharacterType } from "../../objects/character/characterType";
import { GameState, GameStateManager } from "../../../template/gameStateManager";

export const LineManagerEvent = Object.freeze({
  OnMerge: "onMerge",
});

export const LineManagerState = Object.freeze({
  Begin: "begin",
  End: "end",
  Picked: "picked",
});

export const LineManager = Script.createScript({
  name: "lineManager",

  attributes: {
    slots: { default: [] },
    cameraEntity: { default: null },
  },

  initialize() {
    this.poiterDown = false;
    this.lines = [];

    this.ray = new Ray();

    this.curPickSlot = null;
  },

  onCast(ray) {
    for (var i = 0; i < this.slots.length; i++) {
      var slot = this.slots[i];
      if (slot.castBox.checkIntersects(ray)) {
        return {
          slot: slot,
          index: i,
        };
      }
    }
  },

  onPointerDown(event) {
    if (this.poiterDown) {
      return;
    }

    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }

    let castSlotData = this.onCast(this.ray);

    if (castSlotData && castSlotData.slot.controller.character !== null) {
      this.poiterDown = castSlotData;
      this.curPickSlot = castSlotData;
    }
  },

  checkPickedSlot(slot) {

    for (var i = 0; i < this.lines.length; i++) {
      if (this.lines[i].slot1.index === slot.index || this.lines[i].slot2.index === slot.index) {
        return false;
      }
    }
    return true;
  },

  onPointerMove(event) {
    if (this.poiterDown) {
      if (event.changedTouches) {
        this.cast(event.changedTouches[0]);
      }
      else {
        this.cast(event);
      }

      let castSlotData = this.onCast(this.ray);

      if (castSlotData) {
        if (this.curPickSlot.index !== castSlotData.index
          && castSlotData.slot.controller.character !== null
          && this.checkNearSlot(castSlotData)
        ) {
          if (this.checkPickedSlot(castSlotData)) {
            this.drawLine(castSlotData);
            this.curPickSlot = castSlotData;
          }
          else {
            this.removeLine(castSlotData);
            this.curPickSlot = castSlotData;
          }
        }
      }

    }
  },

  onPointerUp() {
    this.poiterDown = false;
    if (this.lines.length != 0) {
      this.merge();
      this.resetData();
    }
  },

  merge() {
    var rs = new Set();
    this.lines.forEach((line) => {
      rs.add(line.slot1.index);
      rs.add(line.slot2.index);
    });

    var heart = 0;
    var minDistance = 1000;

    rs.forEach((index) => {
      var tmp = this.slots[index].controller.character.getPosition();
      var totalDistance = 0;
      rs.forEach((index2) => {
        if (index !== index2) {
          var tmp2 = this.slots[index2].controller.character.getPosition();
          totalDistance += tmp.distance(tmp2);
        }
      });
      if (totalDistance < minDistance) {
        minDistance = totalDistance;
        heart = index;
      }
    });

    var i = 0;
    var posTarget = this.slots[heart].controller.character.getPosition();
    rs.forEach((index) => {
      Tween.createGlobalTranslateTween(this.slots[index].controller.character,
        { x: posTarget.x, y: posTarget.y, z: posTarget.z }, {
        duration: 0.5,
        onComplete: () => {
          i++;
          this.slots[index].controller.removeCurCharacter();
          if (i === rs.size) {
            this.createCharacter(heart, rs.size);
          }
        }
      }).start();
    });
  },

  createCharacter(index, lv) {
    var character = CharacterFactory.createCharacter(Math.min(10, lv), CharacterType.MELEE)
    this.slots[index].controller.addCharacter(character);

    Tween.createCountTween({
      duration: 0.5,
      onComplete: () => {
        this.fire(LineManagerEvent.OnMerge);
        GameStateManager.state = GameState.Challenge
      }
    }).start();
  },

  checkNearSlot(slot) {
    var posX = slot.index % 5;
    var posXCurr = this.curPickSlot.index % 5;
    if (posX === posXCurr) {
      return true;
    }
    else {
      if (Math.abs(posX - posXCurr) === 1 && Math.floor(slot.index / 5) === Math.floor(this.curPickSlot.index / 5)) {
        return true;
      }
    }
    return false;
  },

  drawLine(slot) {
    var pos1 = this.curPickSlot.slot.controller.character.getPosition().clone();
    var pos2 = slot.slot.controller.character.getPosition().clone();
    pos1.y += 3;
    pos2.y += 3;
    var line = this.drawLineBox(pos1, pos2);
    this.lines.push({
      line: line,
      slot1: slot,
      slot2: this.curPickSlot,
    });
  },

  removeLine(slot) {
    this.lines.forEach((line, index) => {
      if ((line.slot1.index === slot.index || line.slot2.index === slot.index)
        && (this.curPickSlot.index === line.slot1.index || this.curPickSlot.index === line.slot2.index)) {
        line.line.parent.removeChild(line.line);
        line.line.destroy();
        this.lines.splice(index, 1);
      }
    });
  },

  drawLineBox(pos1 = new Vec3(), pos2 = new Vec3()) {
    var distance = pos1.distance(pos2);
    var line = ObjectFactory.createBoxLine();

    line.setPosition(pos1);
    line.lookAt(pos2);
    line.setLocalScale(0.2, 0.2, distance + 0.2);
    line.setPosition(pos2.sub(pos1).scale(0.5).add(pos1));
    this.entity.parent.parent.addChild(line);
    return line;
  },

  resetData() {
    this.curPickSlot = null;
    this.lines.forEach((line) => {
      line.line.parent.removeChild(line.line);
      line.line.destroy();
    });
    this.lines = [];
  },

  cast(screenPosition) {
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.nearClip, this.ray.origin);
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.farClip, this.ray.direction);
    this.ray.direction.sub(this.ray.origin).normalize();
  },

});
