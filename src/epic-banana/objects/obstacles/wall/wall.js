import { Entity } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { Util } from "../../../../helpers/util";

export class Wall extends Entity {
  constructor() {
    super("road_wall");
    this.addComponent("model", {
      asset: AssetLoader.getAssetByKey("model_wall"),
      castShadows: false,
      receiveShadows: false,
    });
    this.material = new pc.StandardMaterial();
    this.material.diffuse = Util.createColor(59, 49, 194);
    this.material.update();
    this.model.meshInstances[0].material = this.material;
  }

  onDespawn() {
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