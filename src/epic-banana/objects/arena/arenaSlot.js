import { Entity, StandardMaterial, Vec3 } from "playcanvas";
import { GameConstant } from "../../../gameConstant";
import { Util } from "../../../helpers/util";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { CastBox } from "../../scripts/raycast/castBox";
import { SlotController } from "../../scripts/controllers/slotController";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class ArenaSlot extends Entity {
  constructor() {
    super();

    // this.grid = ObjectFactory.createSprite("grid");
    // this.grid.setLocalEulerAngles(90, 0, 0);
    // this.grid.setLocalScale(8, 8, 8);
    // this.grid.sprite.color = Util.createColor(200, 200, 200);

    this.grid = new Entity();
    this.grid.addComponent("model", {
      type: "plane",
      castShadows: false,
      receiveShadows: false,
    });
    this.grid.setLocalScale(4.55, 1, 4.55);
    // this.grid.setLocalPosition(20, 20, 20);

    let mat = new StandardMaterial();
    mat.blendType = pc.BLEND_NORMAL;
    mat.opacityMap = AssetLoader.getAssetByKey("grid").resource;
    mat.opacityMapChannel = "a";
    mat.diffuse = Util.createColor(200, 200, 200);
    mat.update();
    this.grid.model.meshInstances[0].material = mat;
    this.addChild(this.grid);

    this.addChild(this.grid);
    this._initCastBox();

    this.controller = this.addScript(SlotController);
  }

  _initCastBox() {
    this.castBox = this.addScript(CastBox, {
      scale: new Vec3(4.5, 0.03, 4.5),
      render: GameConstant.DEBUG_CAST_BOX,
    });
  }
}
