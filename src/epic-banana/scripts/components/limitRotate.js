import { Vec3 } from "playcanvas";
import { Script } from "../../../template/systems/script/script";
import { Time } from "../../../template/systems/time/time";

export const LimitRotate = Script.createScript({
  name: "limitRotate",
  attributes: {
    maxRolateAngle: { default: 180 },
    startAngle: {},
  },

  initialize() {
    this.curAngle = new Vec3(0, this.startAngle, 0);
    this.targetAngel = this.startAngle;
  },

  update() {
    var delta = this.targetAngel - this.curAngle.y;
    if (delta > 180) {
      delta -= 360;
    }
    else if (delta < -180) {
      delta += 360;
    }
    if (Math.abs(delta) > this.maxRolateAngle * Time.dt) {
      delta = (delta / Math.abs(delta)) * this.maxRolateAngle * Time.dt;
    }
    this.curAngle.y = delta + this.curAngle.y;
    if (this.curAngle.y > 180) {
      this.curAngle.y -= 360;
    }
    else if (this.curAngle.y < -180) {
      this.curAngle.y += 360;
    }
    this.entity.setLocalEulerAngles(this.curAngle);
  },

  rotateTo(velocity) {
    var angel = -270 - Math.atan2(velocity.z, velocity.x) * 180 / Math.PI;
    if (velocity.x < 0 && velocity.y < 0) {
      angel -= 360;
    }
    this.targetAngel = angel;
  },

  onDisable() {
    this.targetAngel = this.curAngle.y;
  },

  getCurAngle() {
    return this.curAngle.y;
  },
});
