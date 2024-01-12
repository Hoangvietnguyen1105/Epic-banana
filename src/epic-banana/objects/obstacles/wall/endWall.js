import { ELEMENTTYPE_TEXT, Entity, Vec2, Vec3, Vec4 } from "playcanvas";
import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { BoxCollider } from "../../../../physics/scripts/boxCollider";
import { GameConstant } from "../../../../gameConstant";
import { CollisionTag } from "../../../../physics/collisionTag";
import { CollisionEvent } from "../../../../physics/collissionEvent";
import { SideColumn } from "./sideColumn";

export class EndWall extends Entity {
  constructor() {
    super("end-wall");

    this.addComponent("model", {
      type: "box",
      castShadows: false,
      receiveShadows: false,
    });
    this.text = new Entity("text");
    this.text.addComponent("element", {
      type: ELEMENTTYPE_TEXT,
      anchor: new Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new Vec2(0.5, 0.5),
      fontSize: 8,
      autoWidth: true,
      autoHeight: true,
      fontAsset: AssetLoader.getAssetByKey("CanvasFont"),
      text: "0",
    });
    this.text.setLocalPosition(0, 0, -1);
    this.text.setLocalEulerAngles(0, 180, 0);
    this.text.setLocalScale(0.05, 0.05, 0.05)
    this.addChild(this.text);

    this.leftCollum = new SideColumn();
    this.addChild(this.leftCollum);
    this.leftCollum.setLocalPosition(-0.54, 0, 0);

    this.rightCollum = new SideColumn();
    this.addChild(this.rightCollum);
    this.rightCollum.setLocalPosition(0.54, 0, 0);

    this.collider = this.addScript(BoxCollider, {
      tag: CollisionTag.EndWall,
      pos: new Vec3(0, 0, 0),
      scale: new Vec3(1.2, 1, 1),
      render: GameConstant.DEBUG_COLLIDER
    });

    this.collider.on(CollisionEvent.OnCollide, this.onCollide, this)
    this.operator = "+";
  }

  reset() {
    this.collider && this.collider.enable();
    this.text.enabled = true;
    this.model.enabled = true;
  }

  config(data, operator = "-") {
    this.value = data.value;
    this.collider && this.collider.enable();
    this.text.enabled = true;
    this.model.enabled = true;
    this.model.meshInstances[0].material = data.material;
    this.setLocalPosition(data.position.x, data.size.y / 2, data.position.z);
    this.text.element.text = operator + data.value.toString();
    this.setLocalScale(data.size);
    this.setLocalEulerAngles(data.rot.x, data.rot.y, data.rot.z);
    this.operator = operator;
  }

  onCollide() {
    this.collider && this.collider.disable();
    this.fire("collideMathWall")
  }
}