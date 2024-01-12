import { Vec3 } from "playcanvas";
import { Game } from "../../../game";
import { Script } from "../../../template/systems/script/script";

export const FollowWorldTarget = Script.createScript({
  name: "followWorldTarget",

  attributes: {
    target : { default: null },
    camera : { default: null },
  },

  update() {
    var worldPos = this.target.getPosition();
    var screenPos = new Vec3();

    // get screen space co-ord
    this.camera.camera.worldToScreen(worldPos, screenPos);

    // check if the entity is in front of the camera
    if (screenPos.z > 0) {
      this.entity.element.enabled = true;

      // Take into account of pixel ratio
      var pixelRatio = this.app.graphicsDevice.maxPixelRatio;
      screenPos.x *= pixelRatio;
      screenPos.y *= pixelRatio;
      if (Game.isLandscape()) {
        screenPos.y -= 130;
        this.entity.setLocalScale(0.5, 0.5, 0.5);
      }
      else {
        screenPos.y -= 50;
        this.entity.setLocalScale(1, 1, 1);
      }

      var device = this.app.graphicsDevice;

      // Global position of elements is normalised between -1 and 1 on both axis
      this.entity.setPosition(
        ((screenPos.x / device.width) * 2) - 1,
        ((1 - (screenPos.y / device.height)) * 2) - 1,
        0,
      );

    }
    else {
      this.entity.element.enabled = false;
    }
  },
});
