import { Entity } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Wall } from "../obstacles/wall/wall";


export class Road extends Entity {
  constructor() {
    super("road");

    this.road = new Entity()
    this.road.material = new pc.StandardMaterial()
    this.road.material.diffuseMap = AssetLoader.getAssetByKey("road_tex").resource
    this.road.material.update()
    this.road.addComponent("model", {
      type: "plane",
      material: this.road.material,
      castShadows: false,
    });
    this.addChild(this.road);
    this.road.setLocalScale(7.3, 1, 5.315);

    this.wallLeft = new Wall();
    this.addChild(this.wallLeft);
    this.wallLeft.config({
      pos: { x: 3.981, y: 0, z: 0 },
      rot: { x: 0, y: 90, z: 0 },
      scale: { x: 0.63, y: 0.2, z: 2 }
    });

    this.wallRight = new Wall();
    this.addChild(this.wallRight);
    this.wallRight.config({
      pos: { x: -3.981, y: 0, z: 0 },
      rot: { x: 0, y: 90, z: 0 },
      scale: { x: 0.63, y: 0.2, z: 2 }
    });
  }

  config(data) {
    let pos = data.pos;
    let rot = data.rot;
    let scale = data.scale;
    this.setLocalPosition(pos.x, pos.y, pos.z);
    this.setLocalEulerAngles(rot.x, rot.y, rot.z);
    this.setLocalScale(scale.x, scale.y, scale.z);
  }
}