import { Script } from "../../../template/systems/script/script";

export const HealthBarController = Script.createScript({
  name: "healthBarController",

  attributes: {
    material: { default: null },
  },

  updatePercent(percent) {
    this.material.alphaTest = 1 - percent;
    this.material.update();
  },
});
