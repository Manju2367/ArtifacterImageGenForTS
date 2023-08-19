"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const enka_network_api_1 = require("enka-network-api");
const fs_1 = require("fs");
const functions_1 = require("./functions");
const apiBaseUrl = new URL("https://enka.network/ui");
const enka = new enka_network_api_1.EnkaClient({
    defaultLanguage: "jp",
    defaultImageBaseUrl: apiBaseUrl.href
});
const destCharacter = path_1.default.join(__dirname, "character");
const destWeapon = path_1.default.join(__dirname, "weapon");
const destArtifact = path_1.default.join(__dirname, "artifact");
const artifactTypeMap = {
    EQUIP_BRACER: "flower",
    EQUIP_DRESS: "crown",
    EQUIP_NECKLACE: "wing",
    EQUIP_RING: "cup",
    EQUIP_SHOES: "clock"
};
// 一覧に載っているがアクセスできないファイル？
const URLBlackList = [
    "https://enka.network/ui/UI_EquipIcon_Claymore_Quartz.png",
    "https://enka.network/ui/UI_EquipIcon_Pole_Flagpole.png",
    "https://enka.network/ui/UI_EquipIcon_Catalyst_Amber.png",
    "https://enka.network/ui/UI_EquipIcon_Bow_Hardwood.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Sword_YoutouEnchanted.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Sword_YoutouShattered.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Claymore_Quartz.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Pole_Flagpole.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Catalyst_Amber.png",
    "https://api.ambr.top/assets/UI/UI_EquipIcon_Bow_Hardwood.png"
];
const isKeyofTargetUrl = (arg) => {
    let obj = {
        normalAttack: "",
        elementalBurst: "",
        elementalSkill: "",
        splashImage: "",
        constellations: ""
    };
    return Object.keys(obj).includes(arg);
};
if (!(0, fs_1.existsSync)(destCharacter))
    (0, fs_1.mkdirSync)(destCharacter);
if (!(0, fs_1.existsSync)(destWeapon))
    (0, fs_1.mkdirSync)(destWeapon);
if (!(0, fs_1.existsSync)(destArtifact))
    (0, fs_1.mkdirSync)(destArtifact);
// キャラクター
enka.getAllCharacters().forEach((character, c) => {
    try {
        let name = character.name.get();
        let element = character.element?.name.get().charAt(0);
        let targetUrl = {
            normalAttack: character.normalAttack.icon.url,
            elementalSkill: character.elementalSkill?.icon.url,
            elementalBurst: character.elementalBurst?.icon.url,
            splashImage: name === "旅人" ? `https://api.ambr.top/assets/UI/${character.splashImage.url.split("/").reverse()[0]}` : character.splashImage.url,
            constellations: character.constellations.map(c => c.icon.url)
        };
        // 旅人の場合
        if (name === "旅人") {
            if (character.gender === "MALE")
                name = `空(${element})`;
            else if (character.gender === "FEMALE")
                name = `蛍(${element})`;
        }
        let dest = path_1.default.join(destCharacter, name);
        if (!(0, fs_1.existsSync)(dest))
            (0, fs_1.mkdirSync)(dest);
        Object.keys(targetUrl).forEach(key => {
            if (isKeyofTargetUrl(key)) {
                let url = targetUrl[key];
                // 配列？
                if (url instanceof Array) {
                    url.forEach((con, i) => {
                        const filename = path_1.default.join(dest, `constellations${i + 1}.png`);
                        // ファイルが存在する？
                        if (!(0, fs_1.existsSync)(filename) && !URLBlackList.includes(con)) {
                            (0, functions_1.downloadFile)(con, filename).then(() => {
                                console.log(`Downloaded ${con}`);
                            }).catch(err => {
                                console.log(`Failed request file ${con}.`);
                            });
                        }
                    });
                }
                else if (typeof url === "string") {
                    const filename = path_1.default.join(dest, `${key}.png`);
                    if (!(0, fs_1.existsSync)(filename) && !URLBlackList.includes(url)) {
                        (0, functions_1.downloadFile)(url, filename).then(() => {
                            console.log(`Downloaded ${url}`);
                        }).catch(err => {
                            console.log(`Failed request file ${url}.`);
                        });
                    }
                }
            }
        });
    }
    catch (err) {
        console.log(err);
    }
});
// キャラクターコスチューム
enka.getAllCostumes().forEach(cos => {
    if (cos.splashImage) {
        let charId = cos.characterId;
        let charName = enka.getCharacterById(charId).name.get();
        let destCharName = path_1.default.join(destCharacter, charName);
        let destCostume = path_1.default.join(destCharName, "costumes");
        let filename = path_1.default.join(destCostume, `${cos.name.get()}.png`);
        let imageUrl = cos.splashImage.url;
        if (!(0, fs_1.existsSync)(destCharName))
            (0, fs_1.mkdirSync)(destCharName);
        if (!(0, fs_1.existsSync)(destCostume))
            (0, fs_1.mkdirSync)(destCostume);
        if (!(0, fs_1.existsSync)(filename) && !URLBlackList.includes(imageUrl)) {
            (0, functions_1.downloadFile)(imageUrl, filename).then(() => {
                console.log(`Downloaded ${imageUrl}`);
            }).catch(err => {
                console.log(`Failed request file ${imageUrl}.`);
            });
        }
    }
});
// 武器
enka.getAllWeapons().forEach(weapon => {
    weapon.awakenIcon;
    let name = weapon.name.get();
    let imageUrl = `https://api.ambr.top/assets/UI/${weapon.icon.url.split("/").reverse()[0]}`;
    let filename = path_1.default.join(destWeapon, `${name}.png`);
    if (!(0, fs_1.existsSync)(filename) && !URLBlackList.includes(imageUrl)) {
        (0, functions_1.downloadFile)(imageUrl, filename).then(() => {
            console.log(`Downloaded ${imageUrl}`);
        }).catch(err => {
            console.log(`Failed request file ${imageUrl}.`);
        });
    }
});
// 聖遺物
enka.getAllArtifacts().forEach(artifact => {
    let setName = artifact.set.name.get();
    let type = artifact.equipType;
    let imageUrl = artifact.icon.url;
    let dest = path_1.default.join(destArtifact, setName);
    let filename = path_1.default.join(dest, `${artifactTypeMap[type]}.png`);
    if (!(0, fs_1.existsSync)(dest))
        (0, fs_1.mkdirSync)(dest);
    // 画像が存在しない場合
    if (!(0, fs_1.existsSync)(filename) && !URLBlackList.includes(imageUrl)) {
        (0, functions_1.downloadFile)(imageUrl, filename).then(() => {
            console.log(`Downloaded ${imageUrl}`);
        }).catch(err => {
            console.log(`Failed request file ${imageUrl}.`);
        });
    }
});
