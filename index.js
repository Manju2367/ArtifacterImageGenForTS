"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = exports.calcScore = void 0;
const path_1 = __importDefault(require("path"));
const sharp_1 = __importDefault(require("sharp"));
const sharp_utils_1 = require("sharp-utils");
// paths
const testPath = path_1.default.join(__dirname, "test");
const assetsPath = path_1.default.join(__dirname, "assets");
const fontPath = path_1.default.join(assetsPath, "ja-jp.ttf");
const basePath = path_1.default.join(__dirname, "base");
const characterPath = path_1.default.join(__dirname, "character");
const weaponPath = path_1.default.join(__dirname, "weapon");
const constellationPath = path_1.default.join(__dirname, "constellation");
const emotePath = path_1.default.join(__dirname, "emotes");
const artifactGradePath = path_1.default.join(__dirname, "artifactGrades");
const artifactPath = path_1.default.join(__dirname, "artifact");
const baseSize = {
    width: 1920,
    height: 1080
};
const textToImage = new sharp_utils_1.TextToImage(fontPath);
const fightProp = {
    FIGHT_PROP_BASE_HP: "基礎HP",
    FIGHT_PROP_HP: "HP",
    FIGHT_PROP_HP_PERCENT: "HPパーセンテージ",
    FIGHT_PROP_BASE_ATTACK: "基礎攻撃力",
    FIGHT_PROP_ATTACK: "攻撃力",
    FIGHT_PROP_ATTACK_PERCENT: "攻撃パーセンテージ",
    FIGHT_PROP_BASE_DEFENSE: "基礎防御力",
    FIGHT_PROP_DEFENSE: "防御力",
    FIGHT_PROP_DEFENSE_PERCENT: "防御パーセンテージ",
    FIGHT_PROP_BASE_SPEED: "",
    FIGHT_PROP_SPEED_PERCENT: "",
    FIGHT_PROP_CRITICAL: "会心率",
    FIGHT_PROP_ANTI_CRITICAL: "",
    FIGHT_PROP_CRITICAL_HURT: "会心ダメージ",
    FIGHT_PROP_ELEMENT_MASTERY: "元素熟知",
    FIGHT_PROP_CHARGE_EFFICIENCY: "元素チャージ効率",
    FIGHT_PROP_ADD_HURT: "",
    FIGHT_PROP_SUB_HURT: "",
    FIGHT_PROP_HEAL_ADD: "与える治療効果",
    FIGHT_PROP_HEALED_ADD: "受ける治療効果",
    FIGHT_PROP_FIRE_ADD_HURT: "炎元素ダメージ",
    FIGHT_PROP_FIRE_SUB_HURT: "",
    FIGHT_PROP_WATER_ADD_HURT: "水元素ダメージ",
    FIGHT_PROP_WATER_SUB_HURT: "",
    FIGHT_PROP_GRASS_ADD_HURT: "草元素ダメージ",
    FIGHT_PROP_GRASS_SUB_HURT: "",
    FIGHT_PROP_ELEC_ADD_HURT: "雷元素ダメージ",
    FIGHT_PROP_ELEC_SUB_HURT: "",
    FIGHT_PROP_ICE_ADD_HURT: "氷元素ダメージ",
    FIGHT_PROP_ICE_SUB_HURT: "",
    FIGHT_PROP_WIND_ADD_HURT: "風元素ダメージ",
    FIGHT_PROP_WIND_SUB_HURT: "",
    FIGHT_PROP_PHYSICAL_ADD_HURT: "物理ダメージ",
    FIGHT_PROP_PHYSICAL_SUB_HURT: "",
    FIGHT_PROP_ROCK_ADD_HURT: "岩元素ダメージ",
    FIGHT_PROP_ROCK_SUB_HURT: "",
    FIGHT_PROP_MAX_HP: "",
    FIGHT_PROP_CUR_ATTACK: "",
    FIGHT_PROP_CUR_DEFENSE: "",
    FIGHT_PROP_CUR_SPEED: "",
    FIGHT_PROP_CUR_HP: "",
    FIGHT_PROP_SKILL_CD_MINUS_RATIO: "",
    FIGHT_PROP_SHIELD_COST_MINUS_RATIO: ""
};
const convAsMap = {
    hp: "HP",
    atk: "攻撃力",
    def: "防御力",
    chg: "元素チャージ効率",
    mst: "元素熟知"
};
const statusNameMap = {
    HP: {
        short: "HP%",
        long: "HPパーセンテージ"
    },
    攻撃力: {
        short: "攻撃%",
        long: "攻撃パーセンテージ"
    },
    防御力: {
        short: "防御%",
        long: "防御パーセンテージ"
    },
    元素チャージ効率: {
        short: "元チャ効率",
        long: "元素チャージ効率"
    }
};
const artifactTypeMap = {
    EQUIP_BRACER: "flower",
    EQUIP_DRESS: "crown",
    EQUIP_NECKLACE: "wing",
    EQUIP_RING: "cup",
    EQUIP_SHOES: "clock"
};
const scoreRank = {
    total: {
        SS: 220,
        S: 200,
        A: 180
    },
    EQUIP_BRACER: {
        SS: 50,
        S: 45,
        A: 40
    },
    EQUIP_NECKLACE: {
        SS: 50,
        S: 45,
        A: 40
    },
    EQUIP_SHOES: {
        SS: 45,
        S: 40,
        A: 35
    },
    EQUIP_RING: {
        SS: 45,
        S: 40,
        A: 37
    },
    EQUIP_DRESS: {
        SS: 40,
        S: 35,
        A: 30
    }
};
/**
 * 聖遺物のスコア計算
 * @param {Artifact} artifact 聖遺物
 * @param {ConvAs} type 換算
 * @returns {number}
 */
const calcScore = (artifact, type = "atk") => {
    if (artifact === null)
        return 0;
    let score = 0;
    artifact.substats.total.forEach(stat => {
        let value = Math.floor(stat.getMultipliedValue() * 10) / 10;
        // 会心率
        if (fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CRITICAL) {
            score += (value * 2);
        }
        // 会心ダメージ
        if (fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CRITICAL_HURT) {
            score += value;
        }
        // HP%, 攻撃力%, 防御力%, 元素チャージ効率換算
        if ((type === "hp" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_HP_PERCENT) ||
            (type === "atk" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_ATTACK_PERCENT) ||
            (type === "def" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_DEFENSE_PERCENT) ||
            (type === "chg" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CHARGE_EFFICIENCY)) {
            score += value;
        }
        // 元素熟知換算
        if (type == "mst" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_ELEMENT_MASTERY) {
            score += (value * 0.25);
        }
    });
    return Math.round(score * 10) / 10;
};
exports.calcScore = calcScore;
const generate = async (character, calcType = "atk") => {
    // キャラクター
    const characterElement = character.characterData.element?.name.get("jp").charAt(0);
    const characterName = character.characterData.name.get("jp") === "旅人" ?
        (character.characterData.gender === "MALE" ? `空(${characterElement})` : `蛍(${characterElement})`) :
        character.characterData.name.get("jp");
    const characterStatus = character.stats;
    const characterMaxHealth = Math.round(characterStatus.maxHealth.getMultipliedValue()).toLocaleString();
    const characterBaseHealth = Math.round(characterStatus.healthBase.getMultipliedValue()).toLocaleString();
    const characterAddHealth = (Math.round(characterStatus.maxHealth.getMultipliedValue()) - Math.round(characterStatus.healthBase.getMultipliedValue())).toLocaleString();
    const characterAttack = Math.round(characterStatus.attack.getMultipliedValue()).toLocaleString();
    const characterBaseAttack = Math.round(characterStatus.attackBase.getMultipliedValue()).toLocaleString();
    const characterAddAttack = (Math.round(characterStatus.attack.getMultipliedValue()) - Math.round(characterStatus.attackBase.getMultipliedValue())).toLocaleString();
    const characterDefense = Math.round(characterStatus.defense.getMultipliedValue()).toLocaleString();
    const characterBaseDefense = Math.round(characterStatus.defenseBase.getMultipliedValue()).toLocaleString();
    const characterAddDefense = (Math.round(characterStatus.defense.getMultipliedValue()) - Math.round(characterStatus.defenseBase.getMultipliedValue())).toLocaleString();
    const characterElementMastery = Math.round(characterStatus.elementMastery.getMultipliedValue()).toLocaleString();
    const characterCritRate = characterStatus.critRate.getMultipliedValue().toFixed(1);
    const characterCritDamage = characterStatus.critDamage.getMultipliedValue().toFixed(1);
    const characterChargeEfficiency = characterStatus.chargeEfficiency.getMultipliedValue().toFixed(1);
    const characterPyroDamage = {
        name: characterStatus.pyroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.pyroDamage.getMultipliedValue() * 10) / 10
    };
    const characterHydroDamage = {
        name: characterStatus.hydroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.hydroDamage.getMultipliedValue() * 10) / 10
    };
    const characterCryoDamage = {
        name: characterStatus.cryoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.cryoDamage.getMultipliedValue() * 10) / 10
    };
    const characterElectroDamage = {
        name: characterStatus.electroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.electroDamage.getMultipliedValue() * 10) / 10
    };
    const characterDendroDamage = {
        name: characterStatus.dendroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.dendroDamage.getMultipliedValue() * 10) / 10
    };
    const characterAnemoDamage = {
        name: characterStatus.anemoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.anemoDamage.getMultipliedValue() * 10) / 10
    };
    const characterGeoDamage = {
        name: characterStatus.geoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.geoDamage.getMultipliedValue() * 10) / 10
    };
    const characterPhysicalDamage = {
        name: characterStatus.physicalDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.physicalDamage.getMultipliedValue() * 10) / 10
    };
    const characterHealAdd = {
        name: characterStatus.healAdd.fightPropName.get("jp"),
        value: Math.round(characterStatus.healAdd.getMultipliedValue() * 10) / 10
    };
    const characterMaxValueStatus = [
        characterPyroDamage,
        characterHydroDamage,
        characterCryoDamage,
        characterElectroDamage,
        characterDendroDamage,
        characterAnemoDamage,
        characterGeoDamage,
        characterPhysicalDamage,
        characterHealAdd
    ].reduce((a, b) => a.value > b.value ? a : b);
    const characterConstellations = character.unlockedConstellations;
    const characterLevel = character.level;
    const characterFriendship = character.friendship;
    const characterTalent = {
        normalAttack: character.skillLevels[0].level.value,
        elementalSkill: character.skillLevels[1].level.value,
        elementalBurst: character.skillLevels[2].level.value
    };
    // 武器
    const weapon = character.weapon;
    const weaponName = weapon.weaponData.name.get("jp");
    const weaponLevel = weapon.level;
    const weaponRank = weapon.refinementRank;
    const weaponRarelity = weapon.weaponData.stars;
    const weaponBaseAtk = weapon.weaponStats[0].getMultipliedValue().toFixed();
    const weaponSubStatusName = weapon.weaponStats[1] ?
        weapon.weaponStats[1].fightPropName.get("jp") :
        undefined;
    const weaponSubStatusValue = weapon.weaponStats[1] ?
        weapon.weaponStats[1].isPercent ?
            weapon.weaponStats[1].getMultipliedValue().toFixed(1) :
            weapon.weaponStats[1].getMultipliedValue().toFixed() :
        undefined;
    const weaponSubStatusType = weapon.weaponStats[1] ?
        weapon.weaponStats[1].fightPropName.get("jp") :
        undefined;
    // 聖遺物
    const artifacts = [null, null, null, null, null];
    character.artifacts.forEach(artifact => {
        if (artifact.artifactData.equipType === "EQUIP_BRACER") {
            artifacts[0] = artifact;
        }
        else if (artifact.artifactData.equipType === "EQUIP_NECKLACE") {
            artifacts[1] = artifact;
        }
        else if (artifact.artifactData.equipType === "EQUIP_SHOES") {
            artifacts[2] = artifact;
        }
        else if (artifact.artifactData.equipType === "EQUIP_RING") {
            artifacts[3] = artifact;
        }
        else if (artifact.artifactData.equipType === "EQUIP_DRESS") {
            artifacts[4] = artifact;
        }
    });
    const scoreFlower = (0, exports.calcScore)(artifacts[0], calcType);
    const scoreWing = (0, exports.calcScore)(artifacts[1], calcType);
    const scoreClock = (0, exports.calcScore)(artifacts[2], calcType);
    const scoreCup = (0, exports.calcScore)(artifacts[3], calcType);
    const scoreCrown = (0, exports.calcScore)(artifacts[4], calcType);
    const scoreTotal = scoreFlower + scoreWing + scoreClock + scoreCup + scoreCrown;
    // ベース
    let base = (0, sharp_1.default)(path_1.default.join(basePath, `${characterElement}.png`));
    let shadow = (0, sharp_1.default)(path_1.default.join(assetsPath, "Shadow.png"));
    // キャラクター
    let characterPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let characterImage = (0, sharp_1.default)(path_1.default.join(characterPath, characterName, character.costume.isDefault ? "splashImage.png" : `costumes/${character.costume.name.get("jp")}.png`));
    if (/蛍\(.\)/.test(characterName) || /空\(.\)/.test(characterName)) {
        let paste = (0, sharp_utils_1.createImage)(2048, 1024);
        characterImage.resize(Math.floor(2048 * 0.9));
        paste.composite([{
                input: await characterImage.toBuffer(),
                left: Math.floor((2048 - 2048 * 0.9) / 2),
                top: (1024 - Math.floor(1024 * 0.9)) + 20,
            }]);
        characterImage = (0, sharp_1.default)(await paste.toBuffer());
    }
    characterImage
        .extract({
        left: 289,
        top: 0,
        width: 1728 - 289,
        height: 1024
    })
        .resize(Math.floor((1728 - 289) * 0.75));
    let characterAvatarMask = (0, sharp_1.default)(path_1.default.join(assetsPath, "CharacterMask.png"))
        .resize(Math.floor((1728 - 289) * 0.75), Math.floor(1024 * 0.75));
    characterImage = await (0, sharp_utils_1.mask)(characterImage, characterAvatarMask);
    characterPaste.composite([{
            input: await characterImage.toBuffer(),
            left: -160,
            top: -45
        }]);
    return base.composite([
        { input: await characterPaste.toBuffer(), left: 0, top: 0 },
        { input: await shadow.toBuffer(), left: 0, top: 0 },
        // { input: await weaponPaste.toBuffer(), left: 0, top: 0},
        // { input: await weaponRarePaste.toBuffer(), left: 0, top: 0},
        // { input: await talentBasePaste.toBuffer(), left: 0, top: 0},
        // { input: await constBasePaste.toBuffer(), left: 0, top: 0},
        // { input: await characterInfoPaste.toBuffer(), left: 0, top: 0},
        // { input: await characterStatusPaste.toBuffer(), left: 0, top: 0},
        // { input: await artifactScorePaste.toBuffer(), left: 0, top: 0},
        // { input: await artifactPreviewPaste.toBuffer(), left: 0, top: 0},
        // { input: await artifactStatusPaste.toBuffer(), left: 0, top: 0},
        // { input: await setBonusPaste.toBuffer(), left: 0, top: 0 }
    ]).toBuffer();
};
exports.generate = generate;
