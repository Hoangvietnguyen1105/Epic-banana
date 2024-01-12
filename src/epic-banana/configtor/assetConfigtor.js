import { BLEND_NORMAL, BLEND_SCREEN, StandardMaterial, Texture } from "playcanvas";
import { AssetLoader } from "../../assetLoader/assetLoader";
import { Game } from "../../game";
import { Util } from "../../helpers/util";

export class AssetConfigurator {
  static config() {
    this._createCanvasFont();
    this._configRoad();
    this._configWallEndGameMaterial();
    this._configFinishLine();
    this._configMapObjects();
    this._configSawBlade();
    this._configSawBladeBase();
    this._configArena();
    this._configProjectile8();
    this.registerGardientMaterial();
    this._configGridHighlight();
    this._configCat();
    this._configToy();
    this._configJump();
    this._configKey();
    this._configDog();
    this._configMaterials();
    this._configRotatingObject();
    this._configChibiCat();
    this._configSpikeTunnel();
    this._configTrapThorn();
  }

  static _configTrapThorn() {
    let material = new StandardMaterial();
    material.diffuse = Util.createColor(88, 41, 135);
    material.update();
    this.setModelMaterial("trap_thorn", material, 0);

    let material1 = new StandardMaterial();
    material1.diffuse = Util.createColor(204, 121, 0);
    material1.update();
    this.setModelMaterial("trap_thorn", material1, 1);
  }

  static _configSpikeTunnel() {
    let material = new StandardMaterial();
    material.diffuse = Util.createColor(199, 165, 137);
    material.update();
    this.setModelMaterial("hamchong", material, 0);

    let material1 = new StandardMaterial();
    material1.diffuse = Util.createColor(55, 63, 69);
    material1.update();
    this.setModelMaterial("hamchong", material1, 1);

    let material2 = new StandardMaterial();
    material2.diffuse = Util.createColor(113, 27, 157);
    material2.update();
    this.setModelMaterial("hamchong", material2, 2);
  }

  static _configChibiCat() {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey("M_ChibiCat").resource;
    material.update();
    this.setModelMaterial("ChibiCat", material, 1);

    let material1 = new StandardMaterial();
    material1.diffuseMap = AssetLoader.getAssetByKey("toilet").resource;
    material1.update();
    this.setModelMaterial("ChibiCat", material1, 0);
  }

  static _configKey() {
    let mat = new StandardMaterial();
    mat.diffuse = Util.createColor(228, 189, 59);
    mat.update();
    this.setModelMaterial("key", mat, 0);
  }

  static _configRotatingObject() {
    var material0 = new pc.StandardMaterial();
    material0.diffuse = Util.createColor(240, 172, 23);
    material0.update();

    var material1 = new pc.StandardMaterial();
    material1.diffuse = Util.createColor(122, 136, 147);
    material1.update();

    var material2 = new pc.StandardMaterial();
    material2.diffuse = Util.createColor(156, 86, 206);
    material2.update();

    this.setModelMaterial("xoay2", material0, 0);
    this.setModelMaterial("xoay2", material1, 1);
    this.setModelMaterial("xoay2", material2, 2);

    AssetLoader.registerAsset(material1, "mat_midle_rotating", "material");
  }

  static _configMaterials() {
    let matSideColumn = new StandardMaterial();
    matSideColumn.diffuse = Util.createColor(117, 122, 136);
    AssetLoader.registerAsset(matSideColumn, "mat_side_column", "material");
  }

  static _configDog() {
    let material1 = new StandardMaterial();
    material1.diffuseMap = AssetLoader.getAssetByKey("M_Dog_1_D").resource;
    material1.update();
    this.setModelMaterial("dog1", material1, 0);

    let material2 = new StandardMaterial();
    material2.diffuseMap = AssetLoader.getAssetByKey("M_Dog_2_D").resource;
    material2.update();
    this.setModelMaterial("dog2", material2, 0);

    let material3 = new StandardMaterial();
    material3.diffuseMap = AssetLoader.getAssetByKey("M_Dog_3_D").resource;
    material3.update();
    this.setModelMaterial("dog3", material3, 0);

    let material4 = new StandardMaterial();
    material4.diffuseMap = AssetLoader.getAssetByKey("M_Dog_4_D").resource;
    material4.update();
    this.setModelMaterial("dog4", material4, 0);

    let material5 = new StandardMaterial();
    material5.diffuseMap = AssetLoader.getAssetByKey("M_Dog_5_D").resource;
    material5.update();
    this.setModelMaterial("dog5", material5, 0);

    let material6 = new StandardMaterial();
    material6.diffuseMap = AssetLoader.getAssetByKey("M_Dog_6_D").resource;
    material6.update();
    this.setModelMaterial("dog6", material6, 0);

    let material7 = new StandardMaterial();
    material7.diffuseMap = AssetLoader.getAssetByKey("M_Dog_7_D").resource;
    material7.update();
    this.setModelMaterial("dog7", material7, 0);

    let material8 = new StandardMaterial();
    material8.diffuseMap = AssetLoader.getAssetByKey("M_Dog_8_D").resource;
    material8.update();
    this.setModelMaterial("dog8", material8, 0);

    let material9 = new StandardMaterial();
    material9.diffuseMap = AssetLoader.getAssetByKey("M_Dog_9_D").resource;
    material9.update();
    this.setModelMaterial("dog9", material9, 0);

    let material10 = new StandardMaterial();
    material10.diffuseMap = AssetLoader.getAssetByKey("M_Dog_10_D").resource;
    material10.update();
    this.setModelMaterial("dog10", material10, 0);
  }

  static _configJump() {
    let material = new pc.StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey("M_Pillar").resource;
    material.update();
    this.setModelMaterial("Bucnhay", material, 0);
    this.setModelMaterial("Trap_Flip_L", material, 0);
    this.setModelMaterial("Trap_Flip_L", material, 1);
  }

  static _configToy() {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey("Tex_toy").resource;
    material.update();
    this.setModelMaterial("toy_1", material, 0);
    this.setModelMaterial("toy_2", material, 0);
    this.setModelMaterial("toy_3", material, 0);
    this.setModelMaterial("toy_4", material, 0);
    this.setModelMaterial("toy_5", material, 0);
    this.setModelMaterial("toy_6", material, 0);
    this.setModelMaterial("toy_7", material, 0);
    this.setModelMaterial("toy_8", material, 0);
    this.setModelMaterial("toy_9", material, 0);
    this.setModelMaterial("toy_10", material, 0);
  }

  static _configCat() {
    let material = new StandardMaterial();
    material.diffuseMap = AssetLoader.getAssetByKey("M_Banana_Happy").resource;
    material.update();
    this.setModelMaterial("Banana", material, 0);

    let materialAppleCat = new StandardMaterial();
    materialAppleCat.diffuseMap = AssetLoader.getAssetByKey("M_AppleCat").resource;
    materialAppleCat.update();
    this.setModelMaterial("Apple", materialAppleCat, 0);

    let materialAvocadoCat = new StandardMaterial();
    materialAvocadoCat.diffuseMap = AssetLoader.getAssetByKey("M_AvocadoCat").resource;
    materialAvocadoCat.update();
    this.setModelMaterial("Avocado", materialAvocadoCat, 0);

    let materialCarrotCat = new StandardMaterial();
    materialCarrotCat.diffuseMap = AssetLoader.getAssetByKey("M_CarrotCat").resource;
    materialCarrotCat.update();
    this.setModelMaterial("Carrot", materialCarrotCat, 0);

    let materialGrapeCat = new StandardMaterial();
    materialGrapeCat.diffuseMap = AssetLoader.getAssetByKey("M_GrapeCat").resource;
    materialGrapeCat.update();
    this.setModelMaterial("Grape", materialGrapeCat, 0);

    let materialKiwiCat = new StandardMaterial();
    materialKiwiCat.diffuseMap = AssetLoader.getAssetByKey("M_KiwiCat").resource;
    materialKiwiCat.update();
    this.setModelMaterial("Kiwi", materialKiwiCat, 0);

    let materialLemonCat = new StandardMaterial();
    materialLemonCat.diffuseMap = AssetLoader.getAssetByKey("M_LemonCat").resource;
    materialLemonCat.update();
    this.setModelMaterial("LemonCat", materialLemonCat, 0);

    let materialPearCat = new StandardMaterial();
    materialPearCat.diffuseMap = AssetLoader.getAssetByKey("M_PearCat").resource;
    materialPearCat.update();
    this.setModelMaterial("Pear", materialPearCat, 0);

    let materialPineappleCat = new StandardMaterial();
    materialPineappleCat.diffuseMap = AssetLoader.getAssetByKey("M_Pineapple").resource;
    materialPineappleCat.update();
    this.setModelMaterial("Pineapple", materialPineappleCat, 0);

    let materialPumpkinCat = new StandardMaterial();
    materialPumpkinCat.diffuseMap = AssetLoader.getAssetByKey("M_PumpkinCat").resource;
    materialPumpkinCat.update();
    this.setModelMaterial("Pumpkin", materialPumpkinCat, 0);

    let materialTomatoCat = new StandardMaterial();
    materialTomatoCat.diffuseMap = AssetLoader.getAssetByKey("M_TomatoCat").resource;
    materialTomatoCat.update();
    this.setModelMaterial("TomatoCat", materialTomatoCat, 0);

  }

  static _configGridHighlight() {
    let tex = AssetLoader.getAssetByKey("tex_grid_highlight").resource;
    let mat = new StandardMaterial();
    mat.diffuseMap = tex;
    mat.diffuseTint = true;
    mat.diffuse = Util.createColor(17, 204, 0);
    mat.opacityMapChannel = "a";
    mat.blendType = BLEND_NORMAL;
    mat.opacityMap = tex;
    mat.update();
    AssetLoader.registerAsset(mat, "mat_grid_highlight", "material");
  }

  static registerGardientMaterial() {
    let mat = new StandardMaterial();
    mat.diffuse = Util.createColor(0, 0, 0);
    mat.opacityMap = AssetLoader.getAssetByKey("tex_gardient").resource;
    mat.opacityMapChannel = "r";
    mat.blendType = BLEND_SCREEN;
    mat.alphaTest = 1;
    AssetLoader.registerAsset(mat, "mat_gardient", "material");
  }

  static _configProjectile8() {
    let texHead = AssetLoader.getAssetByKey("tex_glow_9").resource;
    let texBlackHolde = AssetLoader.getAssetByKey("tex_glow_10").resource;
    let texGlow = AssetLoader.getAssetByKey("tex_glow_3").resource;

    let matHead = new StandardMaterial();
    matHead.diffuseMap = texHead;
    matHead.diffuseTint = true;
    matHead.diffuse = Util.createColor(228, 184, 255);
    matHead.opacityMap = texHead;
    matHead.opacityMapChannel = "r";
    matHead.blendType = BLEND_NORMAL;

    let matBlackHole = new StandardMaterial();
    matBlackHole.diffuseMap = texBlackHolde;
    matBlackHole.diffuseTint = true;
    matBlackHole.diffuse = Util.createColor(0, 0, 0);
    matBlackHole.opacityMap = texBlackHolde;
    matBlackHole.blendType = BLEND_NORMAL;
    matBlackHole.opacityMapChannel = "r";

    let matGlow = new StandardMaterial();
    matGlow.diffuse = Util.createColor(158, 0, 255);
    matGlow.opacityMap = texGlow;
    matGlow.blendType = BLEND_NORMAL;
    matGlow.opacityMapChannel = "r";

    AssetLoader.registerAsset(matHead, "mat_head", "material");
    AssetLoader.registerAsset(matBlackHole, "mat_black_hole", "material");
    AssetLoader.registerAsset(matGlow, "mat_glow", "material");
  }

  static _configArena() {
    this.material = new pc.StandardMaterial();
    this.material.diffuse = Util.createColor(151, 69, 46);
    this.material.update();
    this.setModelMaterial("arena", this.material, 0);

    this.material1 = new pc.StandardMaterial();
    this.material1.diffuse = Util.createColor(176, 170, 176);
    this.material1.update();
    this.setModelMaterial("arenaborder", this.material1, 0);

  }

  static _configSawBladeBase() {
    let mat = new StandardMaterial();
    mat.diffuse = Util.createColor(155, 161, 152);
    mat.update();
    this.setModelMaterial("sawblade_base", mat, 0);
  }

  static _configSawBlade() {
    let mat = new StandardMaterial();
    mat.diffuse = Util.createColor(137, 71, 191);
    mat.update();
    this.setModelMaterial("cua", mat, 0);

    let mat1 = new StandardMaterial();
    mat1.diffuse = Util.createColor(243, 177, 18);
    mat1.update();
    this.setModelMaterial("cua", mat1, 1);

    let mat2 = new StandardMaterial();
    mat2.diffuse = Util.createColor(0, 0, 0);
    mat2.update();
    this.setModelMaterial("cua", mat2, 2);

    let mat3 = new StandardMaterial();
    mat3.diffuse = Util.createColor(240, 172, 23);
    mat3.update();
    this.setModelMaterial("cua", mat3, 3);
  }

  static _createCanvasFont() {
    AssetLoader.createCanvasFont("Arial", 106, "bold");
  }

  static _configMapObjects() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterial("model_wall", mat, 0);
    this.setModelMaterial("model_red_damage", mat, 0);
    this.setModelMaterial("model_middle_wall", mat, 0);
    this.setModelMaterial("model_jump", mat, 0);
    this.setModelMaterial("model_sawBlade", mat, 0);
  }

  static _configWallEndGameMaterial() {
    let texGradient = AssetLoader.getAssetByKey("tex_gradient").resource;
    let matRed = new StandardMaterial();
    matRed.diffuseTint = true;
    matRed.diffuse = Util.createColor(255, 2, 0);
    matRed.opacityMap = texGradient;
    matRed.blendType = BLEND_NORMAL;
    matRed.opacityMapChannel = "r";
    matRed.depthWrite = false;
    AssetLoader.registerAsset(matRed, "mat_red_wall", "material");

    let matGreen = new StandardMaterial();
    matGreen.diffuseTint = true;
    matGreen.diffuse = Util.createColor(83, 255, 0);
    matGreen.opacityMap = texGradient;
    matGreen.blendType = BLEND_NORMAL;
    matGreen.opacityMapChannel = "g";
    matGreen.depthWrite = false;
    AssetLoader.registerAsset(matGreen, "mat_green_wall", "material");

  }

  static _configRoad() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_road").resource;
    mat.diffuseMap = tex;
    this.setModelMaterial("model_road", mat, 0);
  }

  static _configFinishLine() {
    let mat = new StandardMaterial();
    let tex = AssetLoader.getAssetByKey("tex_finish_line").resource;
    mat.diffuseMap = tex;
    mat.diffuseMapTiling.set(3, 0.37);
    this.setModelMaterial("model_finish_line", mat, 0);
  }

  static _configSkyboxCubemap() {
    let textures = [
      AssetLoader.getAssetByKey("tex_skybox_right"),
      AssetLoader.getAssetByKey("tex_skybox_left"),
      AssetLoader.getAssetByKey("tex_skybox_up"),
      AssetLoader.getAssetByKey("tex_skybox_down"),
      AssetLoader.getAssetByKey("tex_skybox_front"),
      AssetLoader.getAssetByKey("tex_skybox_back"),
    ];
    let cmSkybox = new Texture(Game.app.graphicsDevice, {
      cubemap: true,
    });
    cmSkybox.setSource(textures.map((texture) => texture.resource.getSource()));
    AssetLoader.registerAsset(cmSkybox, "cm_skybox", "cubemap");
  }

  /**
   * @param {pc.Texture} texture
   */
  static setTextureFiltering(texture, filter = FILTER_NEAREST, address = ADDRESS_REPEAT) {
    texture.minFilter = filter;
    texture.magFilter = filter;
    texture.addressU = address;
    texture.addressV = address;
  }

  static setSpriteSlice(spriteAsset, border = new Vec4(), pixelsPerUnit = 1) {
    let asset = AssetLoader.getAssetByKey(spriteAsset);
    asset.resource.renderMode = SPRITE_RENDERMODE_SLICED;
    this.setSpriteBorder(asset, border.x, border.y, border.z, border.w);
    this.setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit);
  }

  static setSpriteBorder(spriteAsset, left = 0, bottom = 0, right = 0, top = 0) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.atlas.frames[sprite.frameKeys[0]].border.set(left, bottom, right, top);
  }

  static setSpritePixelsPerUnit(spriteAsset, pixelsPerUnit = 100) {
    let sprite = AssetLoader.getAssetByKey(spriteAsset).resource;
    sprite.pixelsPerUnit = pixelsPerUnit;
  }

  static setModelTexture(modelAsset, textureAsset, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    let texture = AssetLoader.getAssetByKey(textureAsset);
    material.diffuseMap = texture.resource;
  }

  static setModelDiffuse(modelAsset, color, index = 0) {
    let material = this.getMaterial(modelAsset, index);
    material.diffuse.copy(color);
    material.diffuseTint = true;
  }

  static setModelMaterial(modelAsset, material, index = 0) {
    let model = AssetLoader.getAssetByKey(modelAsset).resource;
    model.meshInstances[index].material = material;
  }

  static setModelMaterialInRange(modelAsset, material, startIndex, endIndex) {
    for (var i = startIndex; i <= endIndex; i++) {
      this.setModelMaterial(modelAsset, material, i);
    }
  }

  static setModelMaterialWithIndexes(modelAsset, material, indexes = []) {
    indexes.forEach((index) => {
      this.setModelMaterial(modelAsset, material, index);
    });
  }

  static createColorMaterial(r = 255, g = 255, b = 255, a = 1) {
    let material = new StandardMaterial();
    if (typeof r === "object") {
      material.diffuse = r;
    }
    else {
      material.diffuse = Util.createColor(r, g, b, a);
    }
    return material;
  }

  /**
   * @param {string} modelName
   * @returns {pc.StandardMaterial}
   */
  static getMaterial(modelName, index = 0) {
    let model = AssetLoader.getAssetByKey(modelName);
    let material = model.resource.meshInstances[index].material;

    if (material.id === 1) { // default material
      material = new StandardMaterial();
      model.resource.meshInstances[index].material = material;
    }

    return material;
  }
}