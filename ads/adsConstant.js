export const AdEvent = Object.freeze({
    AD_STARTED: "adStarted",
    AD_COMPLETED: "adCompleted",
    AD_ERROR: "adError",
    AD_INIT_STARTED: "adInitStarted",
    AD_INIT_COMPLETED: "adInitCompleted",
    AD_INIT_ERROR: "adInitError",
  });
  export const AdState = Object.freeze({
    INIT: "init",
    LOADING: "loading",
    LOADED: "loaded",
  });
  
  export const AdBannerSize = Object.freeze({
    SIZE1: "300x250",
    SIZE2: "320x50",
    SIZE3: "728x90",
    SIZE4: "320x100",
    SIZE5: "468x60",
  });
  
  export const AdVideoType = Object.freeze({
    REWARDED: "rewarded",
    INTERSTITIAL: "interstitial",
  });
  
  export class AdVideoConfig{
    constructor(onStarted, onFinished, onError){
      this.onStarted = onStarted;
      this.onFinished = onFinished;
      this.onError = onError;
    }
  }