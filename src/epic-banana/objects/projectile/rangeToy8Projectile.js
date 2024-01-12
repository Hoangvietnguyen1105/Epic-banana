import { Entity, Vec3 } from "playcanvas";
import { ProjectileController, ProjectileEvent } from "../../scripts/controllers/projectileController";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class RangeToy8Projectile extends Entity {
  constructor() {
    super();

    this.holder = new Entity();
    this.addChild(this.holder);

    this._initGlow();

    this.controller = this.addScript(ProjectileController, {
      speed: 30,
      offset: new Vec3(0, 0.5, 0),
    });

    this.controller.on(ProjectileEvent.OnHit, this._onHit, this);
  }

  _onHit() {
    this.holder.enabled = false;
  }

  _onExploreDone() {
    this.holder.enabled = true;
    this.fire(SpawningEvent.Despawn);
  }

  _initGlow() {
    this.glow = new Entity();
    this.holder.addChild(this.glow);

    this.glow.addComponent("model", {
      asset: AssetLoader.getAssetByKey("toy_8"),
      castShadows: false,
      receiveShadows: false,
    });
    this.glow.setLocalScale(5, 5, 5);
  }
}
