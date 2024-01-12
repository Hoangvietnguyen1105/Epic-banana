import { Texture } from "playcanvas";
import { AssetLoader } from "../../../assetLoader/assetLoader";
import { Script } from "../../../template/systems/script/script";
import { Game } from "../../../game";

export const VideoPlayer = Script.createScript({
  name: "VideoPlayer",
  attributes: {
    videoAsset: { default: null },
    size: { default: null },
  },

  update() {
    if (this.playing) { 
      this.videoTexture.upload();
    }
  },

  resize() {
    if (this.frameVideo) {
      this.frameVideo.element.width = this.size.width;
      this.frameVideo.element.height = this.size.height;
    }
  },

  initialize() {
    // Tạo entity chứa element UI 3D
    this.frameVideo = new pc.Entity();
    this.frameVideo.addComponent('element', {
      type: pc.ELEMENTTYPE_IMAGE,
      anchor: new pc.Vec4(0.5, 0.5, 0.5, 0.5),
      pivot: new pc.Vec2(0.5, 0.5),
      height: this.size.height,
      width: this.size.width,
      margin: new pc.Vec4(),
      color: new pc.Color(1, 1, 1),
    });
    this.entity.addChild(this.frameVideo);

    this.videoElement = document.createElement('video');
    this.videoElement.loop = false;
    this.videoElement.style.display = 'none';

    this.videoTexture = new Texture(Game.app.graphicsDevice, {
      format: pc.PIXELFORMAT_R8_G8_B8,
      minFilter: pc.FILTER_LINEAR_MIPMAP_LINEAR,
      magFilter: pc.FILTER_LINEAR,
      addressU: pc.ADDRESS_CLAMP_TO_EDGE,
      addressV: pc.ADDRESS_CLAMP_TO_EDGE,
      mipmaps: false,
    });


    const elementComponent = this.frameVideo.element;
    elementComponent.texture = this.videoTexture;
    elementComponent.texture.minFilter = pc.FILTER_LINEAR;
    elementComponent.texture.magFilter = pc.FILTER_LINEAR;

    document.body.appendChild(this.videoElement);

    this.isPlaying = false;

    this.videoElement.addEventListener('ended', this.onVideoEnded.bind(this));
    this.videoElement.addEventListener("loadedmetadata", () => {
      this.videoTexture.setSource(this.videoElement);
    });
    this.videoElement.addEventListener("playing", () => {
      this.playing = true;
    });
    this.videoElement.load();
  },

  playVid(name) {
    this.videoAsset = name;
    this.videoElement.src = AssetLoader.getAssetByKey(name).getFileUrl();
  },

  onVideoEnded() {
    this.entity.fire('video:ended');
    this.playing = false;
  },

  onButtonClick() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.videoElement.play();
    } else {
      this.videoElement.pause();
    }
  },
});
