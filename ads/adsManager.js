import { Entity } from "playcanvas";
import { Debug } from "../src/helpers/debug";
import { Game } from "../src/game";
import { AdBannerSize, AdEvent, AdState, AdVideoConfig } from "./adsConstant";
export class AdsManager {
  static init() {
    this.emitter = new Entity();
    this.state = AdState.INIT;
    this.adBlocked = false;
    if (!window.AbigamesSdk) {
      Debug.error("AdsManager", "AbigamesSdk is not defined");
      return;
    }
    this.abiGameSDK = window.AbigamesSdk;
    this.abiGameSDK.init({
      gameId: '650d7390bb2ae988433c243c', onStart: () => {
        Debug.log("AdsManager", "Ads is started");
        this.state = AdState.LOADING;
        this.emitter.fire(AdEvent.AD_INIT_STARTED);
      }
    }).then(() => {
      Debug.log("AdsManager", "Ads is initialized");
      this.state = AdState.LOADED;
      this.emitter.fire(AdEvent.AD_INIT_COMPLETED);
    }).catch((err) => {
      this.emitter.fire(AdEvent.AD_INIT_ERROR);
      Debug.error("AdsManager", err);
    });
  }

  static showBanner(elementId, bannerSize = AdBannerSize.SIZE4) {
    this.abiGameSDK.ads.displayBannerAds({ size: bannerSize, containerId: elementId }, (err) => {
      if (err) {
        Debug.log("AdsManager", "Error on request banner ads: " + err);
        return;
      }
      Debug.log("AdsManagerz", "Banner ads is shown");
    });
  }

  static hasAdblock(callback) {
    this.abiGameSDK.ads.hasAdblock((isBlock) => {
      this.adBlocked = isBlock;
      callback && callback(isBlock);
      Debug.log("AdsManager", "Adblock is " + (isBlock ? "enabled" : "disabled"));
    });
  }

  static showVideo(type, config = new AdVideoConfig()) {
    if (this.state !== AdState.LOADED || this.adBlocked) {
      config.onError && config.onError({ err: { breakType: "AdsBlock" } });
      this.onAdError();
      Debug.log("AdsManager", "Ads is not loaded");
      return;
    }

    this.abiGameSDK.ads.displayVideoAds(type, {
      adStarted: () => {
        config.onStarted && config.onStarted();
        this.onAdStarted();
      },
      adFinished: () => {
        config.onFinished && config.onFinished();
        this.onAdFinished();
      },
      adError: (err) => {
        config.onError && config.onError(err);
        this.onAdError();
      },
    });
  }

  // when start video ads disable input and pause game
  // doc: https://static.gamedistribution.com/developer/developers-guidelines.html

  static onAdStarted() {
    Game.pause();
    Game.app.elementInput.enabled = false;
    this.emitter.fire(AdEvent.AD_STARTED);
  }

  static onAdFinished() {
    Game.app.elementInput.enabled = true;
    Game.resume();
    this.emitter.fire(AdEvent.AD_COMPLETED);
  }

  static onAdError(err) {
    Game.app.elementInput.enabled = true;
    Game.resume();
    console.error("AdsManager", err);
    this.emitter.fire(AdEvent.AD_ERROR, err);
  }
}