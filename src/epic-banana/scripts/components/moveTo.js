import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";

export const MoveTo = Script.createScript({
  name: "moveTo",

  attributes: {
    speed: { default: 1 },
  },

  tween: null,

  initialize() {
    this.direction = new Vec3();
  },

  move(target, dt) {
    this.direction.sub2(target.getPosition(), this.entity.getPosition());
    this.direction.normalize();
    this.direction.mulScalar(this.speed * dt);

    this.entity.translateLocal(this.direction);
  },
});
