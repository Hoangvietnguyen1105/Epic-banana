import { Game } from "../../game";
import { GameConstant } from "../../gameConstant";
import { Debug } from "../../template/debug";
import { DataManager } from "./dataManager";

export const DataLocalEvent = Object.freeze({
  Initialize: "initialize",
});

export const DataLocalState = Object.freeze({
  Loaded: "loaded",
  Loading: "loading",
  Unloaded: "unloaded",
});


export class DataLocal {
  static init() {
    if (!window.indexedDB) {
      Debug.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.")
      return;
    }
    this.state = DataLocalState.Unloaded;
    this.dbName = GameConstant.INDEXEDDB_NAME;
    this.dbVersion = GameConstant.INDEXEDDB_VERSION;
    this.db = null;
    this.totalLoad = 0;
    this.totalData = 12;
    var request = window.indexedDB.open(this.dbName, this.dbVersion);
    request.onupgradeneeded = (event) => {
      this.db = event.target.result;
      if (!this.db.objectStoreNames.contains(GameConstant.INDEXEDDB_STORE_NAME)) {
        this.db.createObjectStore(GameConstant.INDEXEDDB_STORE_NAME);
      }
    }
    this.state = DataLocalState.Loading;
    request.onsuccess = (event) => {
      this.db = event.target.result;
      this.getCurrency();
      this.getCurrentLevel();
      this.getLevelRangeUnlock();
      this.getLevelMeleeUnlock();
      this.getChars();
      this.getLevelRise();
      this.getStackMelee();
      this.getStackRange();
      this.getPriceMelee();
      this.getPriceRange();
      this.getKeys();
      this.getLevelChallenge();
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }

  static checkLoad() {
    this.totalLoad++;
    if (this.totalLoad === this.totalData) {
      this.state = DataLocalState.Loaded;
      Game.app.fire(DataLocalEvent.Initialize);
    }
  }

  static getCurrentLevel() {
    this.getData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.currentLevel = GameConstant.LEVEL_BEGIN;
        this.addData(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY, this.currentLevel);
      } else {
        this.currentLevel = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getLevelChallenge() {
    this.getData(GameConstant.INDEXEDDB_LEVEL_CHALLENGE).then((value) => {
      if (typeof (value) === "undefined") {
        this.levelChallenge = 1;
        this.addData(GameConstant.INDEXEDDB_LEVEL_CHALLENGE, this.levelChallenge);
      } else {
        this.levelChallenge = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getKeys() {
    this.getData(GameConstant.INDEXEDDB_KEYS).then((value) => {
      if (typeof (value) === "undefined") {
        this.keys = 0;
        this.addData(GameConstant.INDEXEDDB_KEYS, this.keys);
      } else {
        this.keys = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getChars() {
    this.getData(GameConstant.INDEXEDDB_CHARS_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.chars = [];
        for (let i = 0; i < 15; i++) {
          this.chars.push(null);
        }
        this.addData(GameConstant.INDEXEDDB_CHARS_KEY, this.chars);
      } else {
        this.chars = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getLevelRise() {
    this.getData(GameConstant.INDEXEDDB_LEVEL_RISE_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.levelRise = [];
        for (let i = 0; i < DataManager.getLevelRise().length; i++) {
          this.levelRise.push([true, true]);
        }
        this.addData(GameConstant.INDEXEDDB_LEVEL_RISE_KEY, this.levelRise);
      } else {
        this.levelRise = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getCurrency() {
    this.getData(GameConstant.INDEXEDDB_CURRENCY_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.currency = 0;
        this.addData(GameConstant.INDEXEDDB_CURRENCY_KEY, this.currency);
      } else {
        this.currency = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getStackMelee() {
    this.getData(GameConstant.INDEXEDDB_STACK_MELEE_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.stackMelee = GameConstant.STACK_MELEE_BEGIN;
        this.addData(GameConstant.INDEXEDDB_STACK_MELEE_KEY, this.stackMelee);
      } else {
        this.stackMelee = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getStackRange() {
    this.getData(GameConstant.INDEXEDDB_STACK_RANGE_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.stackRange = GameConstant.STACK_RANGE_BEGIN;
        this.addData(GameConstant.INDEXEDDB_STACK_RANGE_KEY, this.stackRange);
      } else {
        this.stackRange = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getPriceMelee() {
    this.getData(GameConstant.INDEXEDDB_PRICE_MELEE_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.priceMelee = 100;
        this.addData(GameConstant.INDEXEDDB_PRICE_MELEE_KEY, this.priceMelee);
      } else {
        this.priceMelee = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getPriceRange() {
    this.getData(GameConstant.INDEXEDDB_PRICE_RANGE_KEY).then((value) => {
      if (typeof (value) === "undefined") {
        this.priceRange = 100;
        this.addData(GameConstant.INDEXEDDB_PRICE_RANGE_KEY, this.priceRange);
      } else {
        this.priceRange = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getLevelRangeUnlock() {
    this.getData(GameConstant.LEVEL_RANGE_UNLOCK).then((value) => {
      if (typeof (value) === "undefined") {
        this.levelRangeUnlock = 1;
        this.addData(GameConstant.LEVEL_RANGE_UNLOCK, this.levelRangeUnlock);
      } else {
        this.levelRangeUnlock = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static getLevelMeleeUnlock() {
    this.getData(GameConstant.LEVEL_MELEE_UNLOCK).then((value) => {
      if (typeof (value) === "undefined") {
        this.levelMeleeUnlock = 1;
        this.addData(GameConstant.LEVEL_MELEE_UNLOCK, this.levelMeleeUnlock);
      } else {
        this.levelMeleeUnlock = value;
      }
      this.checkLoad();
    }).catch((error) => {
      console.error(error);
    });
  }

  static addData(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.add(value, key);
    request.onsuccess = () => {
      Debug.log("add success", key);
    }
    request.onerror = (err) => {
      Debug.error("add error", err);
    }
  }

  static getData(key) {
    return new Promise((resolve, reject) => {
      const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
      let request = userData.get(key);
      request.onsuccess = (event) => {
        resolve(event.target.result);
      }
      request.onerror = (event) => {
        reject(event);
      }
    });
  }

  static updateCurrentLevelData(value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value;
      this.currentLevel = data;
      var requestUpdate = userData.put(data, GameConstant.INDEXEDDB_CURRENT_LEVEL_KEY);
      requestUpdate.onsuccess = () => {
        Debug.log("update success");
      }
      requestUpdate.onerror = (err) => {
        Debug.error("update error", err);
      }
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }

  static updateDataByKey(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(key);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = parseFloat(value.toFixed(1));
      var requestUpdate = userData.put(data, key);
      requestUpdate.onsuccess = () => {
        Debug.log("update " + key + " success");
      }
      requestUpdate.onerror = (err) => {
        Debug.error("update " + key + " error", err);
      }
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }

  static updateDataListByKey(key, value) {
    const userData = this.db.transaction(GameConstant.INDEXEDDB_STORE_NAME, "readwrite").objectStore(GameConstant.INDEXEDDB_STORE_NAME);
    var request = userData.get(key);
    request.onsuccess = (event) => {
      var data = event.target.result;
      data = value
      var requestUpdate = userData.put(data, key);
      requestUpdate.onsuccess = () => {
        Debug.log("update " + key + " success");
      }
      requestUpdate.onerror = (err) => {
        Debug.error("update " + key + " error", err);
      }
    }
    request.onerror = (event) => {
      Debug.error("error: ", event);
    }
  }
}