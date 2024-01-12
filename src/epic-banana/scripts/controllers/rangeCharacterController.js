import { Vec3 } from "playcanvas";
import { SoundManager } from "../../../template/soundManager";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { AnimationName } from "../../objects/animationName/animationName";
import { CharacterEvent } from "../../objects/character/characterEvent";
import { CharacterState } from "../../objects/character/characterState";
import { AnimationKeyEvent } from "../animator/animationConfig";
import { BodyEvent } from "../components/body";
import { BattleState } from "../managers/battleManager";

export const RangeCharacterEvent = Object.freeze({
  FireProjectile: "fireProjectile",
});


export const RangeCharacterController = Script.createScript({
  name: "rangeCharacterController",

  attributes: {
    animator: { default: null },
    animationMap: { default: null },
    body: { default: null },
    rotate: { default: null },
    attackable: { default: null },
    battleManager: { default: null },
    isPlayerTeam: { default: null },
  },

  initialize() {
    this._tmpVec3 = new Vec3();
    this.body.on(BodyEvent.Dead, this._onDead, this);
  },

  postInitialize() {
    this.idle();
  },

  update() {
    if (this.battleManager && this.battleManager.state === BattleState.Waiting) {
      return;
    }

    if (this.state === CharacterState.Dead
      || this.state === CharacterState.Idle
      || this.state === CharacterState.Fall
      || this.state === CharacterState.Land
      || this.state === CharacterState.Attack) {
      return;
    }

    let target = this.battleManager.findNearestTarget(this.entity, this.isPlayerTeam);

    if (!target) {
      return;
    }

    this.curAttackTarget = target;
    this.attack();
  },

  idle() {
    if (this.state !== CharacterState.Idle) {
      let idleAnim = this.animationMap.get(AnimationName.Idle);
      this.animator.setAnimation([{
        name: idleAnim,
        loop: true,
        speed: 1,
        blendTime: 0.3,
      }]);
    }
    this.state = CharacterState.Idle;
  },

  attack() {
    if (!this.curAttackTarget) { return; }
    if (this.state !== CharacterState.Attack) {
      let attackAnim = this.animationMap.get(AnimationName.Attack);
      this.animator.setAnimation([{
        name: attackAnim,
        loop: false,
        speed: 2,
        blendTime: 0.2,
        keyEvents: [
          new AnimationKeyEvent(0.3, () => {
            this._onReachAttackPoint();
          }),
          new AnimationKeyEvent(0.9, () => {
            this._onAttackDone();
          }),
        ],
      }]);
    }

    this._tmpVec3.sub2(this.curAttackTarget.getPosition(), this.entity.getPosition());
    this._tmpVec3.normalize();

    this.rotate.rotateTo(this._tmpVec3);

    this.state = CharacterState.Attack;
  },

  move(target) {
    this.moveTo.move(target, Time.dt);

    if (this.state !== CharacterState.Move) {
      let moveAnim = this.animationMap.get(AnimationName.Move);
      this.animator.setAnimation([{
        name: moveAnim,
        loop: true,
        speed: 1,
        blendTime: 0.2,
      }]);
    }

    this._tmpVec3.sub2(target.getPosition(), this.entity.getPosition());
    this._tmpVec3.normalize();

    this.rotate.rotateTo(this._tmpVec3);
    this.state = CharacterState.Move;
  },

  _onDead() {
    if (this.state !== CharacterState.Dead) {
      SoundManager.play("sfx_game_death");
      let deadAnim = this.animationMap.get(AnimationName.Dead);
      this.animator.setAnimation([{
        name: deadAnim,
        loop: false,
        speed: 1,
        blendTime: 0.2,
      }]);
    }
    this.state = CharacterState.Dead;

    this.fire(CharacterEvent.Dead);
  },

  victory() {
    if (this.state !== CharacterState.Victory) {
      let fallAnim = this.animationMap.get(AnimationName.Victory);
      this.animator.setAnimation([{
        name: fallAnim,
        loop: true,
        speed: 1,
        blendTime: 0.2,
      }]);
    }
    this.state = CharacterState.Victory;
  },

  fall() {
    if (this.state !== CharacterState.Fall) {
      let fallAnim = this.animationMap.get(AnimationName.Fall);
      this.animator.setAnimation([{
        name: fallAnim,
        loop: true,
        speed: 1,
        blendTime: 0.2,
      }]);
    }
    this.state = CharacterState.Fall;
  },

  land() {
    if (this.state !== CharacterState.Land) {
      let landAnim = this.animationMap.get(AnimationName.Land);
      this.animator.setAnimation([{
        name: landAnim,
        loop: false,
        speed: 1,
        blendTime: 0.2,
        keyEvents: [
          new AnimationKeyEvent(1, this.idle, this),
        ],
      }]);
    }
    this.state = CharacterState.Land;
  },

  _onReachAttackPoint() {
    if (this.body.isDead()) {
      return;
    }

    if (this.curAttackTarget?.body.isDead()) {
      this.curAttackTarget = this.battleManager.findNearestTarget(this.entity, this.isPlayerTeam);
      if (!this.curAttackTarget) {
        return;
      }
    }

    SoundManager.play("sfx_game_atk_arrow");
    this._tmpVec3.sub2(this.curAttackTarget.getPosition(), this.entity.getPosition());
    this._tmpVec3.normalize();

    this.rotate.rotateTo(this._tmpVec3);
    this.fire(RangeCharacterEvent.FireProjectile, this.entity, this.curAttackTarget);
  },

  _onAttackDone() {
    this.state = CharacterState.Waiting;
    if (!this.curAttackTarget?.body.isDead()) {
      this.attack(this.curAttackTarget);
    }
  },

  onStartBattle() {
    this.state = CharacterState.Waiting;
  },

  setAngle(angle) {
    this.rotate.curAngle = new Vec3(0, angle, 0);
    this.rotate.targetAngel = angle;
    this.entity.modelEntity.setLocalEulerAngles(0, angle, 0);
  },

  resetAngle() {
  },

  rotateToCamera() {
    this.rotate.rotateTo(new Vec3(0, 0, 1));
  },
});
