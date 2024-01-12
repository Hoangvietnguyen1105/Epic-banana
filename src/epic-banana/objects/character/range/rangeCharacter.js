import { Entity } from "playcanvas";
import { RangeConfig } from "./rangeConfig";
import { ObjectFactory } from "../../../../template/objects/objectFactory";
import { MergeController } from "../../../scripts/controllers/mergeController";
import { CharacterType } from "../characterType";
import { LimitRotate } from "../../../scripts/components/limitRotate";
import { Animator } from "../../../scripts/animator/animator";
import { Attackable } from "../../../scripts/components/attackable";
import { RangeCharacterController } from "../../../scripts/controllers/rangeCharacterController";
import { Body } from "../../../scripts/components/body";


export class RangeCharacter extends Entity {
  constructor(config = new RangeConfig()) {
    super("rangeCharacter");
    this.modelEntity = ObjectFactory.createModel(config.modelName);
    this.modelEntity.setLocalScale(2, 2, 2);
    this.addChild(this.modelEntity);

    this.spawnProjectileChild = this.modelEntity.findByName(config.spawnProjectileName);

    this.mergeController = this.addScript(MergeController, {
      level: config.level,
      type: CharacterType.RANGE,
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

    this.controller = this.addScript(RangeCharacterController, {
      animator: animator,
      animationMap: animationMap,
      attackable: this.attackalbe,
      rotate: this.rotate,
      body: this.body,
    });
  }
}