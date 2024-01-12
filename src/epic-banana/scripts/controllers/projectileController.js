import { Vec3 } from "playcanvas";
import * as pc from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";
import { Util } from "../../../helpers/util";

export const ProjectileEvent = Object.freeze({
  OnHit: "onHit",
});


export const ProjectileController = Script.createScript({
  name: "projectileController",

  attributes: {
    owner: { default: null },
    target: { default: null },
    childToSpawnTo: { default: null },
    speed: { default: 3 },
    offset: { default: new Vec3() },
  },

  initialize() {
    this.isFiring = false;
    this._tmpVec3 = new Vec3();
    this.direction = new Vec3();
  },

  update() {
    if (this.isFiring) {
      this._tmpVec3.copy(this.target.getPosition());
      this._tmpVec3.add(this.offset);
      this.direction.sub2(this._tmpVec3, this.entity.getPosition());
      if (this.direction.distance(Vec3.ZERO) > this.speed * Time.dt) {
        this.direction.normalize();
        this.direction.mulScalar(this.speed * Time.dt);
        this.entity.translateLocal(this.direction);
        this.rotate(this.direction)
      }
      else {
        this.entity.setPosition(this._tmpVec3);
        this._onHitTarget();
      }
    }
  },

  rotate(direction) {
    let rot = this.entity.holder.getRotation();
    let angle = Math.atan2(direction.x, direction.z);
    angle = angle * 180 / Math.PI;
    this.entity.holder.setEulerAngles(rot.x, angle + 90, rot.z);
  },

  fireTo(owner, target) {
    this.owner = owner;
    this.target = target;
    var pos = this.owner.getPosition();
    this.entity.setPosition(pos.x, pos.y + 3.5, pos.z + 1);
    this.isFiring = true;
  },

  _onHitTarget() {
    this.isFiring = false;
    this.target.body.receiveDamage(this.owner.controller.attackable.attackDamage);
    this.fire(ProjectileEvent.OnHit);
  },
});
