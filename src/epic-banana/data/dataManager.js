
import dataDemo from "../../../assets/jsons/dataDemo.json";
import level1 from "../../../assets/jsons/level/level (1).json";
import level2 from "../../../assets/jsons/level/level (2).json";
import level3 from "../../../assets/jsons/level/level (3).json";
import level4 from "../../../assets/jsons/level/level (4).json";
import level5 from "../../../assets/jsons/level/level (5).json";
import level6 from "../../../assets/jsons/level/level (6).json";
import level7 from "../../../assets/jsons/level/level (7).json";
import level8 from "../../../assets/jsons/level/level (8).json";
import level9 from "../../../assets/jsons/level/level (9).json";
import level10 from "../../../assets/jsons/level/level (10).json";
import level11 from "../../../assets/jsons/level/level (11).json";
import level12 from "../../../assets/jsons/level/level (12).json";
import level13 from "../../../assets/jsons/level/level (13).json";
import level14 from "../../../assets/jsons/level/level (14).json";
import level15 from "../../../assets/jsons/level/level (15).json";
import level16 from "../../../assets/jsons/level/level (16).json";
import level17 from "../../../assets/jsons/level/level (17).json";
import level18 from "../../../assets/jsons/level/level (18).json";
import level19 from "../../../assets/jsons/level/level (19).json";
import level20 from "../../../assets/jsons/level/level (20).json";
import level21 from "../../../assets/jsons/level/level (21).json";
import level22 from "../../../assets/jsons/level/level (22).json";
import level23 from "../../../assets/jsons/level/level (23).json";
import level24 from "../../../assets/jsons/level/level (24).json";
import level25 from "../../../assets/jsons/level/level (25).json";
import level26 from "../../../assets/jsons/level/level (26).json";
import level27 from "../../../assets/jsons/level/level (27).json";
import level28 from "../../../assets/jsons/level/level (28).json";
import level29 from "../../../assets/jsons/level/level (29).json";
import level30 from "../../../assets/jsons/level/level (30).json";
import level31 from "../../../assets/jsons/level/level (31).json";
import level32 from "../../../assets/jsons/level/level (32).json";
import level33 from "../../../assets/jsons/level/level (33).json";
import level34 from "../../../assets/jsons/level/level (34).json";
import level35 from "../../../assets/jsons/level/level (35).json";
import level36 from "../../../assets/jsons/level/level (36).json";
import level37 from "../../../assets/jsons/level/level (37).json";
import level38 from "../../../assets/jsons/level/level (38).json";
import level39 from "../../../assets/jsons/level/level (39).json";
import level40 from "../../../assets/jsons/level/level (40).json";
import level41 from "../../../assets/jsons/level/level (41).json";
import level42 from "../../../assets/jsons/level/level (42).json";
import level43 from "../../../assets/jsons/level/level (43).json";
import level44 from "../../../assets/jsons/level/level (44).json";
import level45 from "../../../assets/jsons/level/level (45).json";
import level46 from "../../../assets/jsons/level/level (46).json";
import level47 from "../../../assets/jsons/level/level (47).json";
import level48 from "../../../assets/jsons/level/level (48).json";
import level49 from "../../../assets/jsons/level/level (49).json";
import level50 from "../../../assets/jsons/level/level (50).json";
import level51 from "../../../assets/jsons/level/level (51).json";
import level52 from "../../../assets/jsons/level/level (52).json";
import level53 from "../../../assets/jsons/level/level (53).json";
import level54 from "../../../assets/jsons/level/level (54).json";
import level55 from "../../../assets/jsons/level/level (55).json";
import level56 from "../../../assets/jsons/level/level (56).json";
import level57 from "../../../assets/jsons/level/level (57).json";
import level58 from "../../../assets/jsons/level/level (58).json";
import level59 from "../../../assets/jsons/level/level (59).json";
import level60 from "../../../assets/jsons/level/level (60).json";
import portrait from "../../../assets/jsons/portrait.json"
import landscape from "../../../assets/jsons/landscape.json"
import levelRise from "../../../assets/jsons/levelRise.json"
import dataChallenge from "../../../assets/jsons/challenge.json"
import { DataLocal } from "./dataLocal";
import { UserData } from "./userData";
import dataSpin from "../../../assets/jsons/data_spin.json";
import { Game } from "../../game";
import cardCharacter from "../../../assets/jsons/cardChacracter.json"
import { Util } from "../../helpers/util";
import { ObjectType } from "../objects/level/objectType";
import stat from "../../../assets/jsons/stat.json";
import { CharacterType } from "../objects/character/characterType";
import { GameConstant } from "../../gameConstant";


export class DataManager {
  static init() {
    this.levelDatas = [];
    this.levelDatas.push(level1);
    this.levelDatas.push(level2);
    this.levelDatas.push(level3);
    this.levelDatas.push(level4);
    this.levelDatas.push(level5);
    this.levelDatas.push(level6);
    this.levelDatas.push(level7);
    this.levelDatas.push(level8);
    this.levelDatas.push(level9);
    this.levelDatas.push(level10);
    this.levelDatas.push(level11);
    this.levelDatas.push(level12);
    this.levelDatas.push(level13);
    this.levelDatas.push(level14);
    this.levelDatas.push(level15);
    this.levelDatas.push(level16);
    this.levelDatas.push(level17);
    this.levelDatas.push(level18);
    this.levelDatas.push(level19);
    this.levelDatas.push(level20);
    this.levelDatas.push(level21);
    this.levelDatas.push(level22);
    this.levelDatas.push(level23);
    this.levelDatas.push(level24);
    this.levelDatas.push(level25);
    this.levelDatas.push(level26);
    this.levelDatas.push(level27);
    this.levelDatas.push(level28);
    this.levelDatas.push(level29);
    this.levelDatas.push(level30);
    this.levelDatas.push(level31);
    this.levelDatas.push(level32);
    this.levelDatas.push(level33);
    this.levelDatas.push(level34);
    this.levelDatas.push(level35);
    this.levelDatas.push(level36);
    this.levelDatas.push(level37);
    this.levelDatas.push(level38);
    this.levelDatas.push(level39);
    this.levelDatas.push(level40);
    this.levelDatas.push(level41);
    this.levelDatas.push(level42);
    this.levelDatas.push(level43);
    this.levelDatas.push(level44);
    this.levelDatas.push(level45);
    this.levelDatas.push(level46);
    this.levelDatas.push(level47);
    this.levelDatas.push(level48);
    this.levelDatas.push(level49);
    this.levelDatas.push(level50);
    this.levelDatas.push(level51);
    this.levelDatas.push(level52);
    this.levelDatas.push(level53);
    this.levelDatas.push(level54);
    this.levelDatas.push(level55);
    this.levelDatas.push(level56);
    this.levelDatas.push(level57);
    this.levelDatas.push(level58);
    this.levelDatas.push(level59);
    this.levelDatas.push(level60);
    this.currentLevel = DataLocal.currentLevel;
    UserData.init();
    this.finishLine = null;
  }

  static getLevelData() {
    if (UserData.currentLevel == 0) return dataDemo;
    if (UserData.currentLevel > this.levelDatas.length) return this.levelDatas[Util.randomInt(40, 60)];

    this.levelDatas[UserData.currentLevel - 1].levelData.forEach((data) => {
      if (data.tp == ObjectType.FINISH_LINE) {
        this.finishLine = data;
      }
    });

    return this.levelDatas[UserData.currentLevel - 1];
  }

  static getSpinData() {
    return dataSpin;
  }

  static getChallengeData() {
    if (UserData.levelChallenge > dataChallenge.length) return dataChallenge[Util.randomInt(0, dataChallenge.length)];
    return dataChallenge[UserData.levelChallenge - 1];
  }

  static getCardCharacterData() {
    return stat;
  }

  static getDataStat(type, level) {
    if (type === CharacterType.MELEE) {
      return stat.melee[level - 1];
    } else {
      return stat.range[level - 1];
    }
  }

  static getLevelRise() {
    return levelRise;
  }

  static getDataReposive() {
    if (Game.isPortrait()) {
      return portrait;
    } else {
      return landscape;
    }
  }

  static nextLevel() {
    UserData.currentLevel++;
    DataLocal.updateCurrentLevelData(UserData.currentLevel);
    const callback = (data, error) => {
      if (error) {
        console.log("error push game rank: " + error);
      } else {
        console.log("push game rank success");
      }
    };
    window.AbigamesSdk?.user.pushGameRank(UserData.currentLevel, callback);
  }

  static nextLevelChallenge() {
    UserData.levelChallenge++;
    DataLocal.updateDataByKey(GameConstant.INDEXEDDB_LEVEL_CHALLENGE, UserData.levelChallenge);
  }
}
