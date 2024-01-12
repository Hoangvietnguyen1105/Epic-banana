import { ELEMENTTYPE_IMAGE, ELEMENTTYPE_TEXT, Entity, Vec4, Vec2 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { GameConstant } from "../../../../gameConstant";
import { UIScreen } from "../../../../template/ui/uiScreen";
import { Util } from "../../../../helpers/util";
import { Tween } from "../../../../template/systems/tween/tween";


export class PopupScreen extends UIScreen {
  constructor() {
    super(GameConstant.POPUPSCREEN);
    this.screen.priority = 100;

    this.box = new Entity();
    this.box.addComponent("element", {
      type: ELEMENTTYPE_IMAGE,
      anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new pc.Vec2(0.5, 0.5),
      width: 320,
      height: 60,
      color: Util.createColor(20, 20, 20),
      opacity: 0.9,
    });
    this.addChild(this.box);

    this.textMesage = new Entity()
    this.textMesage.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      text: "Ads not ready",
      anchor: new Vec4(0.45, 0.33, 0.45, 0.33),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 28,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
    });

    this.box.addChild(this.textMesage);
  }

  enablePopup(text) {
    this.textMesage.element.text = text;
    this.box.setLocalScale(0.1, 0.1, 0.1);
    Tween.createScaleTween(this.box, { x: 1, y: 1, z: 1 }, {
      duration: 0.2,
    }).start();
  }

  disablePopup(fc) {
    this.box.setLocalScale(1, 1, 1);
    Tween.createScaleTween(this.box, { x: 0.1, y: 0.1, z: 0.1 }, {
      duration: 0.2,
      onComplete: () => {
        fc && fc();
      },
    }).start();
  }
}
