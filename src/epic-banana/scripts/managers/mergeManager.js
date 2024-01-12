import { BoundingBox, Entity, Ray, Vec3 } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { SoundManager } from "../../../template/soundManager";
import { Script } from "../../../template/systems/script/script";
import { CharacterFactory } from "../../objects/character/characterFactory";
import { UserData } from "../../data/userData";

export const MergeManagerEvent = Object.freeze({
  OnMerge: "onMerge",
});


export const MergeManager = Script.createScript({
  name: "mergeManager",

  attributes: {
    slots: { default: [] },
    cameraEntity: { default: null },
    mergeEffectSpawner: { default: null },
  },

  initialize() {
    this.forceStartInput = null;
    this.forceTargetInput = null;

    this.groundShape = new BoundingBox(new Vec3(0, 0, 0), new Vec3(1000, 0.001, 1000));
    this.direction = new Vec3();
    this.targetPosition = new Vec3();
    this.ray = new Ray();
    this.hitPosition = new Vec3();

    this.curPickSlot = null;
    this.curPickCharacter = null;

    this.gridHighlight = ObjectFactory.createPlane("mat_grid_highlight");
    this.gridHighlight.setLocalScale(5, 5, 5);
    this.gridHighlight.model.castShadows = false;
    this.gridHighlight.setLocalPosition(0, 0, -1);
    this.entity.addChild(this.gridHighlight);

    // CHEAT SHADER
    setTimeout(() => {
      this.gridHighlight.enabled = false;
    }, 1);

    this.hintHolder = new Entity();
    this.entity.addChild(this.hintHolder);
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

  onCastSlot(slot) {
    if (slot.controller.character !== null) {
      this.curPickSlot = slot;
      this.curPickCharacter = slot.controller.character;
      slot.controller.character.controller.idle();

      let pos = slot.getPosition();
      pos.y += 0.02;
      this.gridHighlight.setPosition(pos);
      this.gridHighlight.enabled = true;

      this.offHint();
    }
  },

  onPointerDown(event) {
    if (this.curPickSlot) {
      return;
    }

    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }

    let castSlotData = this.onCast(this.ray);

    if (castSlotData) {
      if (this.forceStartInput !== null) {
        // eslint-disable-next-line max-depth
        if (castSlotData.index !== this.forceStartInput) {
          return;
        }
      }

      this.onCastSlot(castSlotData.slot);
    }
  },

  onPointerMove(event) {
    if (this.curPickCharacter) {
      let result;
      if (event.touches && event.touches[0]) {
        result = this.doRayCastGround(event.touches[0]);
      }
      else {
        result = this.doRayCastGround(event);
      }
      if (result) {
        this.hitPosition.y += 0.1;
        this.curPickCharacter.setPosition(this.hitPosition);
      }

      let castSlotData = this.onCast(this.ray);
      if (castSlotData) {

        // eslint-disable-next-line max-depth
        if (this.forceTargetInput !== null && castSlotData.index !== this.forceTargetInput) {
          this.gridHighlight.enabled = false;
        }
        else {
          this.gridHighlight.enabled = true;
          let pos = castSlotData.slot.getPosition();
          pos.y += 0.02;
          this.gridHighlight.setPosition(pos);
        }
      }
      else {
        this.gridHighlight.enabled = false;
      }
    }
  },

  onPointerUp(event) {
    if (!this.curPickSlot) {
      return;
    }

    if (event.changedTouches) {
      this.cast(event.changedTouches[0]);
    }
    else {
      this.cast(event);
    }

    let castSlotData = this.onCast(this.ray);
    if (castSlotData && castSlotData.slot !== this.curPickSlot && (castSlotData.index === this.forceTargetInput || this.forceTargetInput === null)) {
      this.handelSlotInteraction(this.curPickSlot, castSlotData.slot);
    }
    else {
      this.curPickSlot.controller.getBackCharacter();
      this.curPickCharacter.controller.land();
    }

    this.curPickSlot = null;
    this.curPickCharacter = null;
    this.gridHighlight.enabled = false;

    this.onHint();
  },

  cast(screenPosition) {
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.nearClip, this.ray.origin);
    this.cameraEntity.camera.screenToWorld(screenPosition.x, screenPosition.y, this.cameraEntity.camera.farClip, this.ray.direction);
    this.ray.direction.sub(this.ray.origin).normalize();
  },

  doRayCastGround(event) {
    this.cast(event);
    var result = this.groundShape.intersectsRay(this.ray, this.hitPosition);

    return result;
  },

  handelSlotInteraction(curPickSlot, targetSlot) {
    if (targetSlot.controller.character === null) {
      let char = curPickSlot.controller.character;
      curPickSlot.controller.removeCurCharacter();
      targetSlot.controller.addCharacter(char);
      targetSlot.controller.getBackCharacter();
      this.curPickCharacter.controller.land();
    }
    else {
      let canMerge = curPickSlot.controller.checkMerge(targetSlot.controller);
      if (canMerge) {
        this.mergeSlot(targetSlot, curPickSlot);
      }
      else {
        this.swapSlot(targetSlot, curPickSlot);
      }
    }
  },

  swapSlot(slot1, slot2) {
    let char1 = slot1.controller.character;
    let char2 = slot2.controller.character;
    slot1.controller.removeCurCharacter();
    slot2.controller.removeCurCharacter();
    slot2.controller.addCharacter(char1);
    slot2.controller.getBackCharacter();
    slot1.controller.addCharacter(char2);
    slot1.controller.getBackCharacter();
    this.curPickCharacter.controller.land();
  },

  mergeSlot(targetSlot, curPickSlot) {
    let char = targetSlot.controller.removeCurCharacter();
    curPickSlot.controller.removeCurCharacter();
    let newChar = CharacterFactory.createCharacter(char.mergeController.level + 1, char.mergeController.type);
    targetSlot.controller.addCharacter(newChar);
    newChar.controller.setAngle(0);
    newChar.controller.land();
    if (char.mergeController.type === "melee") {
      if (UserData.levelMeleeUnlock < newChar.mergeController.level) {
        UserData.levelMeleeUnlock = newChar.mergeController.level;
        this.entity.parent.showNewCharacterUI(char.mergeController.type, newChar.mergeController.level)
      }
    }
    else {
      if (UserData.levelRangeUnlock < newChar.mergeController.level) {
        UserData.levelRangeUnlock = newChar.mergeController.level;
        this.entity.parent.showNewCharacterUI(char.mergeController.type, newChar.mergeController.level)
      }
    }

    let fx = this.mergeEffectSpawner.spawn();
    fx.setPosition(targetSlot.getPosition());
    this.entity.addChild(fx);
    fx.play();

    // SoundManager.play("sfx_merge");

    this.clearFoceInput();
    this.hintDone();
    this.fire(MergeManagerEvent.OnMerge);
  },

  onStartBattle() {
    if (this.curPickSlot) {
      this.curPickSlot.controller.getBackCharacter();
      this.curPickSlot = null;
      this.curPickCharacter = null;
    }
  },

  getHint() {
    for (let i = 0; i < this.slots.length - 1; i++) {
      let char1 = this.slots[i].controller.character;

      if (char1) {
        // eslint-disable-next-line max-depth
        for (let j = i + 1; j < this.slots.length; j++) {
          let char2 = this.slots[j].controller.character;
          // eslint-disable-next-line max-depth
          if (!char2) {
            continue;
          }

          let canMerge = char1.mergeController.canMerge(char2.mergeController);
          // eslint-disable-next-line max-depth
          if (canMerge) {
            return {
              first: this.slots[i],
              second: this.slots[j],
            };
          }
        }
      }
    }
  },

  onHint() {
    // this.hand.enabled = true;
    // this.arrow.enabled = true;
  },

  offHint() {
    // this.hand.enabled = false;
    // this.arrow.enabled = false;
  },

  forceInput(start, target) {
    this.forceStartInput = start;
    this.forceTargetInput = target;
  },

  clearFoceInput() {
    this.forceStartInput = null;
    this.forceTargetInput = null;
  },

  hintDone() {
    this.hintHolder.enabled = false;
  },
});
