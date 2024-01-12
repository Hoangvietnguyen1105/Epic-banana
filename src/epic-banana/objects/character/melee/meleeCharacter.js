import { Entity } from "playcanvas";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { MergeController } from "../../../scripts/controllers/mergeController";
import { CharacterType } from "../characterType";
import { MoveTo } from "../../../scripts/components/moveTo";
import { LimitRotate } from "../../../scripts/components/limitRotate";
import { MeleeConfig } from "./meleeConfig";
import { Animator } from "../../../scripts/animator/animator";
import { Attackable } from "../../../scripts/components/attackable";
import { Body } from "../../../scripts/components/body";
import { MeleeCharacterController } from "../../../scripts/controllers/meleeCharacterController";


export class MeleeCharacter extends Entity{
  constructor(config = new MeleeConfig()) {
    super("melee");
    this.modelEntity = ObjectFactory.createModel(config.modelName);
    this.addChild(this.modelEntity);
    this.modelEntity.setLocalScale(2, 2, 2);
    this.mergeController = this.addScript(MergeController, {
      level: config.level,
      type: CharacterType.MELEE,
    });

    this.moveTo = this.addScript(MoveTo, {
      speed: config.moveSpeed,
    });

    this.rotate = this.modelEntity.addScript(LimitRotate, {
      maxRolateAngle: 200,
      startAngle: 0,
    });

    let anims = config.animations;
    let animationMap = config.animationMap;
    let animation = this.modelEntity.addComponent("animation", {
      assets: anims,
      activate: false,
    });

    let animator = this.modelEntity.addScript(Animator, {
      animation: animation,
    });

    this.attackalbe = this.addScript(Attackable, {
      attackDamage: config.attackDamage,
    });

    this.body = this.addScript(Body, {
      hp: config.hp,
    });

    this.controller = this.addScript(MeleeCharacterController, {
      moveTo: this.moveTo,
      animator: animator,
      attackRange: 0.7,
      animationMap: animationMap,
      attackable: this.attackalbe,
      rotate: this.rotate,
      body: this.body,
    });
  }
}