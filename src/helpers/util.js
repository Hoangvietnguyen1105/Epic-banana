import { Color, Vec3 } from "playcanvas";
import { Game } from "../game";


export class Util {
  static linear(a, b, percent) {
    return a + (b - a) * percent;
  }

  static easeIn(a, b, percent) {
    return a + (b - a) * percent ** 2;
  }

  static easeOut(a, b, percent) {
    return a + (b - a) * (1 - (1 - percent) ** 2);
  }

  static easeInOut(a, b, percent) {
    return a + (b - a) * ((-Math.cos(percent * Math.PI) / 2) + 0.5);
  }

  static m(n, d) {
    x = ('' + n).length, p = Math.pow, d = p(10, d)
    x -= x % 3
    return Math.round(n * d / p(10, x)) / d + " kMGTPE"[x / 3]
  }

  static copyObject(src, dst = {}) {
    Object.keys(src).forEach((key) => {
      dst[key] = src[key];
    });
    return dst;
  }

  static sign(num) {
    return num < 0 ? -1 : 1;
  }

  static random(min, max) {
    return Math.random() * (max - min) + min;
  }

  static randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  /**
   * @summary Return random element from list
   * @param {Array} list
   */
  static randomFromList(list) {
    if (list && list.length > 0) {
      let randomIndex = this.randomInt(0, list.length - 1);
      return list[randomIndex];
    }
    else {
      return -1;
    }
  }

  static randomVector(vecMin, vecMax, out = new Vec3()) {
    out.x = Util.random(vecMin.x, vecMax.x);
    out.y = Util.random(vecMin.y, vecMax.y);
    out.z = Util.random(vecMin.z, vecMax.z);
    return out;
  }

  static pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  static distanceBetween(a, b) {
    return Math.abs(Math.abs(a) - Math.abs(b));
  }

  /**
   * @returns Angle of vector in degree
   */
  static getAlpha(x, y) {
    if (y === 0) {
      return 90;
    }
    return this.toDegree(Math.atan(Math.abs(x) / Math.abs(y)));
  }

  static toDegree(radian) {
    return radian * 180 / Math.PI;
  }

  static toRadian(degree) {
    return degree * Math.PI / 180;
  }

  /**
   * Return a random integer between min (inclusive), max (inclusive)
   * and not include 'excludeNumber'.
   * Note: the 'excludeNumber' must be >= min and <= max value,
   * if not, the probality may be incorect
   * Using Math.round() will give you a non-uniform distribution!
   * @param {number} min min number
   * @param {number} max max number (inclusive)
   * @param {number} excludeNumber the number not included in result
   * @returns {number} Random number
   */
  static getRandomIntExclude(min, max, excludeNumber) {
    var rand = Math.floor(Math.random() * (max - min)) + min;
    if (rand === excludeNumber) {
      rand = max;
    }
    return rand;
  }

  /**
   * @summary Return first frame
   * @param {pc.Sprite} sprite
   */
  static getSpriteFrame(sprite, scale = 1) {
    let rect = sprite.atlas.frames[sprite.frameKeys[0]].rect;
    return { x: rect.x, y: rect.y, width: rect.z * scale, height: rect.w * scale };
  }

  static getSpriteAtlasFrame(sprite) {
    return sprite.atlas.frames[sprite.frameKeys[0]];
  }

  static getSpriteWorldSize(sprite) {
    let atlasFrame = this.getSpriteAtlasFrame(sprite);
    return {
      width: atlasFrame.rect.z / sprite.pixelsPerUnit,
      height: atlasFrame.rect.w / sprite.pixelsPerUnit,
    };
  }

  static createColor(r = 255, g = 255, b = 255, a = 1) {
    return new Color(r / 255, g / 255, b / 255, a);
  }

  static setSpriteDepthTest(sprite, depthTest = true) {
    let mat = sprite._meshInstance.material.clone();
    mat.depthTest = depthTest;
    mat.update();
    sprite._meshInstance.material = mat;
  }

  static setUpEffectModel(entity) {
    entity.model.castShadows = false;
    entity.model.castShadowsLightmap = false;
    entity.model.receiveShadows = false;
  }

  static setModelOpacity(entity, opacity) {
    entity.model.meshInstances.forEach((mesh) => {
      mesh.material.opacity = opacity;
      mesh.material.update();
    });
  }

  static setModelMaterial(entity, material, index = 0) {
    entity.model.meshInstances[index].material = material;
  }

  static registerCTA(element, name) {
    this.registerOnTouch(element, () => Game.onCTAClick(name));
  }

  static registerOnTouch(element, callback, scope) {
    element.useInput = true;
    element.on("mousedown", callback, scope);
    element.on("touchstart", callback, scope);
  }

  static registerOnTouchUp(element, callback, scope) {
    element.useInput = true;
    element.on("mouseup", callback, scope);
    element.on("touchend", callback, scope);
  }

  static registerOnceTouch(element, callback, scope) {
    element.useInput = true;
    element.once("mousedown", callback, scope);
    element.once("touchstart", callback, scope);
  }

  static getSize(width, height, ratioX, ratioY) {
    let height_tmp = width * ratioY / ratioX;
    if (height_tmp <= height) {
      return { width: width, height: height_tmp };
    }
    else {
      return { width: height * ratioX / ratioY, height: height };
    }
  }

  static updateCircleTransform(entity, radius, centerY, rotateMultiplier) {
    let pos = entity.getLocalPosition();

    // calculate y in equation: (x-a)^2 + (y-b)^2 = r^2
    let x = pos.x;
    // let radius = GameConstant.PLAYER_MOVE_RADIUS;
    let squaredR = radius ** 2;
    let squredX = x ** 2;
    let y = Math.sqrt(squaredR + squredX) + centerY;
    pos.y = y;
    entity.setLocalPosition(pos);

    let rotation = entity.getLocalEulerAngles();
    let axis = Util.sign(pos.x);
    let distanceY = Math.abs(y - centerY);
    let alpha = Math.atan(distanceY / Math.abs(x)) * 180 / Math.PI;
    rotation.z = -axis * (alpha - 90) * rotateMultiplier;
    entity.setLocalEulerAngles(rotation);
  }

  static getCashFormat(num) {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (num >= 10000) {
      return `${(num / 1000).toFixed(1).replace(/\.0$/, "")}K`;
    }
    return num.toFixed(0);
  }

  static getCashFormatByMin(num) {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    return num.toFixed(0);
  }

  static formatCash(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  static format_time(time) {
    var minutes = Math.floor(time / 60);
    var seconds = Math.floor(time % 60);

    var formattedMinutes = ("0" + minutes).slice(-2);
    var formattedSeconds = ("0" + seconds).slice(-2);

    return formattedMinutes + ':' + formattedSeconds
  }
}
