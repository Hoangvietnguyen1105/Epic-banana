import { ELEMENTTYPE_IMAGE, Entity, Vec2, Vec4, math } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Util } from "../../../helpers/util";
import { Time } from "../../../template/systems/time/time";
import { DataLocal, DataLocalState } from "../../data/dataLocal";
import { ObjectFactory } from "../../../template/objects/objectFactory";

export const LoadingBarEvent = Object.freeze({
  COMPLETE: "complete",
  START: "start"
});


export class LoadingBar extends Entity {
  constructor(data) {
    super("loadingBar");

    this.circle_left = ObjectFactory.createImageElement("spr_circle", {
      anchor: new Vec4(0, 0.5, 0, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
      width: 50,
      height: 50,
    });
    this.addChild(this.circle_left);

    this.circle_right = ObjectFactory.createImageElement("spr_circle", {
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
      width: 50,
      height: 50,
    });
    this.addChild(this.circle_right);


    data.type = data.type || ELEMENTTYPE_IMAGE;
    data.anchor = data.anchor || new Vec4(0.5, 0.5, 0.5, 0.5);
    data.pivot = data.pivot || new Vec2(0.5, 0.5);
    data.margin = data.margin || new Vec4();
    data.width = data.width || 100;
    data.height = data.height || 30;
    data.color = data.color || Util.createColor(0, 0, 0);
    this.addComponent("element", data);



    this.increase = 0;
    this._initBar();
  }

  _initBar() {
    this.bar = new Entity("bar");
    this.bar.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      spriteAsset: AssetLoader.getAssetByKey("spr_blank"),
      anchor: new Vec4(0, 0, 0, 1),
      pivot: new Vec2(0, 0.5),
      margin: new Vec4(5, 5, 5, 5),
      color: Util.createColor(0, 150, 0)
    });

    var circle_left_Bar = ObjectFactory.createImageElement("spr_circle", {
      anchor: new Vec4(0, 0.5, 0, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
      width: 40,
      height: 40,
    });
    circle_left_Bar.element.color = Util.createColor(0, 150, 0);
    this.bar.addChild(circle_left_Bar);

    var circle_right_bar = ObjectFactory.createImageElement("spr_circle", {
      anchor: new Vec4(1, 0.5, 1, 0.5),
      pivot: new Vec2(0.5, 0.5),
      margin: new Vec4(),
      width: 40,
      height: 40,
    });
    circle_right_bar.element.color = Util.createColor(0, 150, 0);
    this.bar.addChild(circle_right_bar);

    this.imageRect = this.bar.element.rect.clone();
    this.progressImageMaxWidth = this.element.width - 10;
    this.addChild(this.bar);
  }

  setProgress(progress) {
    progress = math.clamp(progress, 0, 1);
    this.progress = progress;
    var width = math.lerp(0, this.progressImageMaxWidth, progress);
    this.bar.element.width = width;
    this.imageRect.copy(this.bar.element.rect);
    this.imageRect.z = progress;
    this.bar.element.rect = this.imageRect;
  }

  update() {
    if (!this.started) {
      return;
    }
    this.increase += Time.dt;
    if (this.increase >= 0.98 && (DataLocal.state === DataLocalState.Loading)) {
      this.increase = 0.98;
      return;
    }
    this.setProgress(this.increase);
    if (this.increase >= 1) {
      this.fire(LoadingBarEvent.COMPLETE);
      this.started = false;
    }
  }

  start() {
    this.fire(LoadingBarEvent.START);
    this.started = true;
  }
}