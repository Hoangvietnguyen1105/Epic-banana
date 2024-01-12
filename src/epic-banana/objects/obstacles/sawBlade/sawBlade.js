import { Entity, Vec3 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Rotate } from "../../../scripts/components/rotate";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { SpawningEvent } from "../../../scripts/spawners/spawningEvent";

export class SawBlade extends Entity {
  constructor() {
    super();

    this.modelSawBlade = new Entity("model-saw-blade");
    this.modelSawBlade.addComponent("model", { asset: AssetLoader.getAssetByKey("cua") });
    this.addChild(this.modelSawBlade);
    this.rot = this.modelSawBlade.addScript(Rotate, {
      speed: new Vec3(200, 0, 0),
    });
    this.modelSawBlade.setEulerAngles(0, 0, 0);
    this.modelSawBlade.setLocalPosition(0, 0.5, 0);

    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.Barrier,
      render: GameConstant.DEBUG_COLLIDER,
      scale: new Vec3(1.24, 1.24, 0.178),
      position: new Vec3(0, 0.5, 0)
    });

    this.on(SpawningEvent.Despawn, this.stop, this);
    this.on(SpawningEvent.Spawn, this.play, this);
  }

  play() {
    this.rot.enabled = true;
    this.collider && this.collider.enable();
  }

  stop() {
    this.rot.enabled = false;
    this.collider && this.collider.disable();
  }
  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setPosition(pos.x, pos.y, pos.z);
    this.setEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
}