import { AssetLoader } from "../../../../assetLoader/assetLoader";
import { AnimationName } from "../../animationName/animationName";


export class RangeConfig {
  constructor() {
    this.modelName = "";
    this.animations = [];
    this.animationMap = new Map();
    this.hp = 1000;
    this.level = 1;
    this.attackDamage = 50;
    this.spawnProjectileName = "";

    this.animations = [
      AssetLoader.getAssetByKey("dog1@attack"),
      AssetLoader.getAssetByKey("dog1@die"),
      AssetLoader.getAssetByKey("dog1@idle"),
      AssetLoader.getAssetByKey("dog1@victory"),
      AssetLoader.getAssetByKey("dog1@run"),
    ]
    this.animationMap.set();
    this.animationMap.set(AnimationName.Fall, "dog1@die");
    this.animationMap.set(AnimationName.Land, "dog1@idle");
    this.animationMap.set(AnimationName.Idle, "dog1@idle");
    this.animationMap.set(AnimationName.Attack, "dog1@attack");
    this.animationMap.set(AnimationName.Victory, "dog1@victory");
    this.animationMap.set(AnimationName.Move, "dog1@run");
    this.animationMap.set(AnimationName.Dead, "dog1@die");
  }
}