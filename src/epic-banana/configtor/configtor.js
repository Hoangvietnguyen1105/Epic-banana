import { Game } from "../../game";
import { Util } from "../../helpers/util";
import { AssetConfigurator } from "./assetConfigtor";
import * as pc from "playcanvas";
export class Configurator {
  static config() {
    this.scene = Game.app.scene;
    AssetConfigurator.config();
    this._configScene();
  }

  static _configScene() {
    this.scene.ambientLight = Util.createColor(100, 100, 100);
    this.scene.gammaCorrection = pc.GAMMA_SRGB;

    this._dimension = 2;
    var _texture = new pc.Texture(Game.app.graphicsDevice, {
      width: 2,
      height: 2,
      format: pc.PIXELFORMAT_R8_G8_B8,
      addressU: pc.ADDRESS_CLAMP_TO_EDGE,
      addressV: pc.ADDRESS_CLAMP_TO_EDGE,
    });

    _texture.unlock();
    Game.app.scene.skybox = _texture;
    Game.app.scene.fogColor = Util.createColor(25, 189, 255);
    Game.app.scene.fog = pc.FOG_LINEAR;
    Game.app.scene.fogStart = 28;
    Game.app.scene.fogEnd = 40;
  }
}
