import { Entity, Vec3 } from "playcanvas";
import { ObjectFactory } from "../../../template/objects/objectFactory";
import { ProjectileController, ProjectileEvent } from "../../scripts/controllers/projectileController";
import { SpawningEvent } from "../../scripts/spawners/spawningEvent";


export class Range8Projectile extends Entity {
  constructor() {
    super();

    this.holder = new Entity();
    this.holder.setLocalScale(0.5, 0.5, 0.5);
    this.holder.setLocalEulerAngles(-20, 0, 0);
    this.addChild(this.holder);

    this.head = ObjectFactory.createPlane("mat_head");
    this.head.model.castShadows = false;
    this.holder.addChild(this.head);

    this.blackHolde = ObjectFactory.createPlane("mat_black_hole");
    this.blackHolde.model.castShadows = false;
    this.blackHolde.setLocalScale(0.93, 0.93, 0.93);
    this.blackHolde.setLocalPosition(0, 0.01, 0);
    this.holder.addChild(this.blackHolde);

    this.glow = ObjectFactory.createPlane("mat_glow");
    this.glow.model.castShadows = false;
    this.glow.setLocalScale(1, 1, 1);
    this.glow.setLocalPosition(0, -0.01, 0);
    this.holder.addChild(this.glow);

    this.controller = this.addScript(ProjectileController, {
      speed: 10.5,
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
}
