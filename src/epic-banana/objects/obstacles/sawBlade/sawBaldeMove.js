import { Entity } from "playcanvas";
import { Tween } from "../../../../template/systems/tween/tween";
import { SawBlade } from "./sawBlade";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";


export class SawBladeMove extends Entity {
  constructor() {
    super();

    this.SawBlade = new SawBlade();
    this.addChild(this.SawBlade);
    this.SawBlade.setLocalEulerAngles(0, 90, 0);

    if (Math.random() < 0.5) {
      this.SawBlade.setLocalPosition(-1.65, -0.3, 0);
      this.tween = Tween.createLocalTranslateTween(this.SawBlade, { x: 1.65 }, {
        duration: 3,
        delay: 0.5,
        loop: true,
        yoyo: true,
        onRepeat: () => { this.SawBlade.rot.speed.x *= -1 },
      });
    }
    else {
      this.SawBlade.setLocalPosition(1.65, -0.3, 0);
      this.tween = Tween.createLocalTranslateTween(this.SawBlade, { x: -1.65 }, {
        duration: 3,
        delay: 0.5,
        loop: true,
        yoyo: true,
        onRepeat: () => { this.SawBlade.rot.speed.x *= -1 },
      });
    }

    this.SawBladeBase = new Entity();
    this.SawBladeBase.addComponent("model", {
      asset: AssetLoader.getAssetByKey("sawblade_base"),
      castShadows: false,
      receiveShadows: false,
    });
    this.addChild(this.SawBladeBase);
    this.SawBladeBase.setEulerAngles(0, 90, 0);
    this.SawBladeBase.setLocalPosition(0, -0.1, 0);

    this.on(SpawningEvent.Despawn, this.stop, this);
    this.on(SpawningEvent.Spawn, this.play, this);
  }

  play() {
    this.tween.start();
  }

  stop() {
    this.tween.stop();
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    // this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
}