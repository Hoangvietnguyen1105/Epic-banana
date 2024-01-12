import { Color, ELEMENTTYPE_IMAGE, Entity, Vec2, Vec4 } from "playcanvas";
import { HealthBarController } from "../../scripts/controllers/healthBarController";
import { AssetLoader } from "../../../assetLoader/assetLoader";

export class HealthBar extends Entity {
  constructor() {
    super();
    this._initBg();
    this._initFill();
  }

  _initBg() {
    let asset = AssetLoader.getAssetByKey("spr_dark");
    this.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : asset,
      anchor      : new Vec4(0, 0, 0, 0),
      pivot       : new Vec2(0.5, 0.5),
      width       : 100,
      height      : 15,
    });
    this.element.color = Color.BLACK;
  }

  _initFill() {
    let mat = AssetLoader.getAssetByKey("mat_gardient").resource.clone();
    mat.alphaTest = 0;
    this.gardient = new Entity();
    this.addChild(this.gardient);
    this.gardient.addComponent("element", {
      type     : ELEMENTTYPE_IMAGE,
      anchor   : new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot    : new Vec2(0.5, 0.5),
      material : mat,
      width    : 100,
      height   : 10,
      mask     : true,
    });
    this.fill = new Entity();
    let asset = AssetLoader.getAssetByKey("spr_dark");
    this.fill.addComponent("element", {
      type        : ELEMENTTYPE_IMAGE,
      spriteAsset : asset,
      anchor      : new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot       : new Vec2(0.5, 0.5),
      width       : 95,
      height      : 10,
    });
    this.gardient.addChild(this.fill);
    this.controller = this.addScript(HealthBarController, {
      material: this.gardient.element.material,
    });
  }

  setColor(color) {
    this.fill.element.color = color;
  }
}
