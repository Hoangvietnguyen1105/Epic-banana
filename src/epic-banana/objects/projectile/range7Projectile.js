import { Curve, CurveSet, Entity, Vec3 } from "playcanvas";
import { ProjectileController, ProjectileEvent } from "../../scripts/controllers/projectileController";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";
import { AssetLoader } from "../../../assetLoader/assetLoader";


export class Range7Projectile extends Entity {
  constructor() {
    super();

    this.holder = new Entity();
    this.addChild(this.holder);

    this._initGlow();

    this.controller = this.addScript(ProjectileController, {
      speed  : 10.5,
      offset : new Vec3(0, 0.5, 0),
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

    let texture = AssetLoader.getAssetByKey("tex_circle").resource;

    let scaleGraph = new Curve([0, 0.01, 1, 0.15]);
    let scaleGraph2 = new Curve([0, 0.01, 1, 0.2]);

    let colorGraph = new CurveSet([
      [0, 255 / 255, 0.5, 255 / 255, 1, 255 / 255],
      [0, 115 / 255, 0.5, 45 / 255, 1, 149 / 255],
      [0, 45 / 255, 0.5, 32 / 255, 1, 0],
    ]);

    this.glow.addComponent("particlesystem", {
      autoPlay     : true,
      loop         : true,
      lifetime     : 0.1,
      numParticles : 2,
      rate         : 0.05,
      colorMap     : texture,
      localSpace   : true,
      scaleGraph,
      scaleGraph2,
      colorGraph,
    });
  }
}
