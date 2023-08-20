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
const textToImage = new sharp_utils_1.TextToImage(fontPath, {
    anchor: "left top",
    attributes: {
        fill: "#FFFFFF",
        stroke: "none"
    }
});
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
 *
 * @param image1
 * @param image2
 * @param x
 * @param y
 * @returns
 */
const composite = async (image1, image2, x = 0, y = 0) => {
    if (image2 instanceof Array) {
        return (0, sharp_1.default)(await (0, sharp_1.default)(await image1.toBuffer()).composite(image2).toBuffer()).png();
    }
    else if (image2 instanceof sharp_1.default) {
        return (0, sharp_1.default)(await (0, sharp_1.default)(await image1.toBuffer()).composite([{
                input: await image2.toBuffer(),
                left: x,
                top: y
            }]).toBuffer()).png();
    }
};
/**
 *
 * @param num
 * @param round
 * @returns
 */
const commaSplittedNumber = (num, round = -1) => {
    let str = round >= 0 ? (Math.round(num * 10 ** round) / 10 ** round).toLocaleString() : num.toLocaleString();
    let strS = str.split(".")[1];
    if (round > 0)
        str = `${str}${strS === undefined ? "." : ""}${strS === undefined ? Array(round + 1).join("0") : Array(round - strS.length + 1).join("0")}`;
    return str;
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
        "";
    const weaponSubStatusValue = weapon.weaponStats[1] ?
        weapon.weaponStats[1].isPercent ?
            weapon.weaponStats[1].getMultipliedValue().toFixed(1) :
            weapon.weaponStats[1].getMultipliedValue().toFixed() :
        "";
    const weaponSubStatusType = weapon.weaponStats[1] ?
        weapon.weaponStats[1].fightPropName.get("jp") :
        "";
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
    // 武器
    let weaponImage = (0, sharp_1.default)(path_1.default.join(weaponPath, `${weaponName}.png`))
        .resize(128, 128);
    let weaponPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let weaponNameImage = textToImage.getSharp(weaponName, "png", {
        fontSize: 26,
        y: -26
    });
    let weaponLevelImage = textToImage.getSharp(`Lv.${weaponLevel}`, "png", {
        fontSize: 24,
        y: -24
    });
    let rectWeaponLevel = (0, sharp_utils_1.roundedRect)(((await weaponLevelImage.metadata()).width ?? 0) + 4, 28, 0, 0, 1);
    let baseAttackIcon = (0, sharp_1.default)(path_1.default.join(emotePath, "基礎攻撃力.png"))
        .resize(23, 23);
    let weaponBaseAttackImage = textToImage.getSharp(`基礎攻撃力  ${weaponBaseAtk}`, "png", {
        fontSize: 23,
        y: -23
    });
    let rectWeaponRank = (0, sharp_utils_1.roundedRect)(40, 25, 0, 0, 1);
    let weaponRankImage = textToImage.getSharp(`R${weaponRank}`, "png", {
        fontSize: 24,
        y: -24
    });
    let weaponPasteList = [];
    weaponPasteList.push({ input: await weaponImage.toBuffer(), left: 1430, top: 50 }, { input: await weaponNameImage.toBuffer(), left: 1582, top: 47 }, { input: await rectWeaponLevel.toBuffer(), left: 1582, top: 80 }, { input: await weaponLevelImage.toBuffer(), left: 1584, top: 82 }, { input: await baseAttackIcon.toBuffer(), left: 1600, top: 120 }, { input: await weaponBaseAttackImage.toBuffer(), left: 1623, top: 120 }, { input: await rectWeaponRank.toBuffer(), left: 1430, top: 45 }, { input: await weaponRankImage.toBuffer(), left: 1433, top: 46 });
    if (weaponSubStatusValue) {
        let weaponSubStatusIcon = (0, sharp_1.default)(path_1.default.join(emotePath, `${["HP", "攻撃力", "防御力"].includes(weaponSubStatusType) ? statusNameMap[weaponSubStatusType].long : weaponSubStatusType}.png`))
            .resize(23, 23);
        let weaponSubStatusImage = textToImage.getSharp(`${Object.keys(statusNameMap).includes(weaponSubStatusName) ? statusNameMap[weaponSubStatusName].short : weaponSubStatusName}  ${weaponSubStatusValue}${weapon.weaponStats[1].isPercent ? "%" : ""}`, "png", {
            fontSize: 23,
            y: -23
        });
        weaponPasteList.push({ input: await weaponSubStatusIcon.toBuffer(), left: 1600, top: 155 }, { input: await weaponSubStatusImage.toBuffer(), left: 1623, top: 155 });
    }
    weaponPaste.composite(weaponPasteList);
    let weaponRareImage = (0, sharp_1.default)(path_1.default.join(assetsPath, "Rarelity", `${weaponRarelity}.png`));
    weaponRareImage.resize(Math.floor(((await weaponRareImage.metadata()).width ?? 0) * 0.97));
    let weaponRarePaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    weaponRarePaste
        .composite([{ input: await weaponRareImage.toBuffer(), left: 1422, top: 173 }]);
    // 天賦
    let talentBasePaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let characterTalentKeys = Object.keys(characterTalent);
    for (let i = 0; i < characterTalentKeys.length; i++) {
        let talentBase = (0, sharp_1.default)(path_1.default.join(assetsPath, "TalentBack.png"));
        talentBase.resize(Math.floor(((await talentBase.metadata()).width ?? 0) * 2 / 3));
        let talentBaseWidth = Math.floor(((await talentBase.metadata()).width ?? 0) * 2 / 3);
        let talentBaseHeight = Math.floor(((await talentBase.metadata()).height ?? 0) * 2 / 3);
        let talentPaste = (0, sharp_utils_1.createImage)(talentBaseWidth, talentBaseHeight);
        let talent = (0, sharp_1.default)(path_1.default.join(characterPath, characterName, `${characterTalentKeys[i]}.png`))
            .resize(50, 50);
        talentPaste = await composite(talentPaste, talent, Math.floor(talentBaseWidth / 2) - 25, Math.floor(talentBaseHeight / 2) - 25) ?? talentPaste;
        talentBase = await composite(talentBase, talentPaste, 0, 0) ?? talentBase;
        talentBasePaste = await composite(talentBasePaste, talentBase, 15, 330 + i * 105) ?? talentBasePaste;
    }
    // 凸
    let constBase = (0, sharp_1.default)(path_1.default.join(constellationPath, `${characterElement}.png`))
        .resize(90, 90);
    let constLock = (0, sharp_1.default)(path_1.default.join(constellationPath, `${characterElement}LOCK.png`))
        .resize(90, 90);
    let constBasePaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    for (let i = 1; i < 7; i++) {
        if (i > characterConstellations.length) {
            constBasePaste = await composite(constBasePaste, constLock, 666, -10 + i * 93) ?? constBasePaste;
        }
        else {
            let charConst = (0, sharp_1.default)(path_1.default.join(characterPath, characterName, `constellations${i}.png`))
                .resize(45, 45);
            let constPaste = (0, sharp_utils_1.createImage)(90, 90);
            constPaste = await composite(constPaste, charConst, Math.floor(((await constPaste.metadata()).width ?? 0) / 2) - 25, Math.floor(((await constPaste.metadata()).height ?? 0) / 2) - 23) ?? constPaste;
            let constBaseClone = constBase.clone();
            constBaseClone = await composite(constBaseClone, constPaste, 0, 0) ?? constBaseClone;
            constBasePaste = await composite(constBasePaste, constBaseClone, 666, -10 + i * 93) ?? constBasePaste;
        }
    }
    // 左上のテキスト等
    let characterInfoPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let characterNameImage = textToImage.getSharp(characterName, "png", {
        fontSize: 48,
        y: -48
    });
    let characterLevelImage = textToImage.getSharp(`Lv.${characterLevel}`, "png", {
        fontSize: 25,
        y: -25
    });
    let friendshipImage = textToImage.getSharp(`${characterFriendship}`, "png", {
        fontSize: 25,
        y: -25
    });
    let rectFriendShip = (0, sharp_utils_1.roundedRect)(77, 102, 35 + ((await characterLevelImage.metadata()).width ?? 0) + 5, 74, 2, {
        imageWidth: 77 + ((await characterLevelImage.metadata()).width ?? 0) + ((await friendshipImage.metadata()).width ?? 0),
        imageHeight: 102,
        fill: {
            color: "#000000"
        }
    });
    rectFriendShip.toFile("test/rect.png");
    let friendshipIcon = (0, sharp_1.default)(path_1.default.join(assetsPath, "Love.png"));
    friendshipIcon.resize(Math.floor(((await friendshipIcon.metadata()).width ?? 0) * (24 / ((await friendshipIcon.metadata()).height ?? 1))), 24, { fit: "fill" });
    let normalAttackLevelImage = textToImage.getSharp(`Lv.${characterTalent.normalAttack}`, "png", {
        fontSize: 17,
        y: -17,
        attributes: {
            fill: characterTalent.normalAttack >= 10 ? "#0FF" : "#FFF"
        }
    });
    let elementalSkillLevelImage = textToImage.getSharp(`Lv.${characterTalent.elementalSkill}`, "png", {
        fontSize: 17,
        y: -17,
        attributes: {
            fill: characterTalent.elementalSkill >= 10 ? "#0FF" : "#FFF"
        }
    });
    let elementalBurstLevelImage = textToImage.getSharp(`Lv.${characterTalent.elementalBurst}`, "png", {
        fontSize: 17,
        y: -17,
        attributes: {
            fill: characterTalent.elementalBurst >= 10 ? "#0FF" : "#FFF"
        }
    });
    characterInfoPaste
        .composite([
        { input: await characterNameImage.toBuffer(), left: 30, top: 20 },
        { input: await characterLevelImage.toBuffer(), left: 35, top: 75 },
        { input: await rectFriendShip.toBuffer(), left: 0, top: 0 },
        { input: await friendshipIcon.toBuffer(), left: 42 + Math.floor((await characterLevelImage.metadata()).width ?? 0), top: 76 },
        { input: await friendshipImage.toBuffer(), left: 73 + ((await characterLevelImage.metadata()).width ?? 0), top: 74 },
        { input: await normalAttackLevelImage.toBuffer(), left: 42, top: 397 },
        { input: await elementalSkillLevelImage.toBuffer(), left: 42, top: 502 },
        { input: await elementalBurstLevelImage.toBuffer(), left: 42, top: 607 }
    ]);
    // キャラクターステータス
    let characterStatusPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let characterStatusPasteList = [];
    // HP
    let baseHealthImage = textToImage.getSharp(characterBaseHealth, "png", {
        fontSize: 12,
        y: -12
    });
    let addHealthImage = textToImage.getSharp(`+${characterAddHealth}`, "png", {
        fontSize: 12,
        y: -12,
        attributes: {
            fill: "#0F0"
        }
    });
    let maxHealthImage = textToImage.getSharp(characterMaxHealth, "png", {
        fontSize: 26,
        y: -26
    });
    // 攻撃力
    let baseAttackImage = textToImage.getSharp(characterBaseAttack, "png", {
        fontSize: 12,
        y: -12
    });
    let addAttackImage = textToImage.getSharp(`+${characterAddAttack}`, "png", {
        fontSize: 12,
        y: -12,
        attributes: {
            fill: "#0F0"
        }
    });
    let attackImage = textToImage.getSharp(characterAttack, "png", {
        fontSize: 26,
        y: -26
    });
    // 防御力
    let baseDefenseImage = textToImage.getSharp(characterBaseDefense, "png", {
        fontSize: 12,
        y: -12
    });
    let addDefenseImage = textToImage.getSharp(`+${characterAddDefense}`, "png", {
        fontSize: 12,
        y: -12,
        attributes: {
            fill: "#0F0"
        }
    });
    let defenseImage = textToImage.getSharp(characterDefense, "png", {
        fontSize: 26,
        y: -26
    });
    // 元素熟知
    let elementMasteryImage = textToImage.getSharp(characterElementMastery, "png", {
        fontSize: 26,
        y: -26
    });
    // 会心率
    let critRateImage = textToImage.getSharp(`${characterCritRate}%`, "png", {
        fontSize: 26,
        y: -26
    });
    // 会心ダメージ
    let critDamageImage = textToImage.getSharp(`${characterCritDamage}%`, "png", {
        fontSize: 26,
        y: -26
    });
    // 元素チャージ効率
    let chargeEfficiencyImage = textToImage.getSharp(`${characterChargeEfficiency}%`, "png", {
        fontSize: 26,
        y: -26
    });
    characterStatusPasteList.push({ input: await baseHealthImage.toBuffer(), left: 1360 - ((await baseHealthImage.metadata()).width ?? 0) - ((await addHealthImage.metadata()).width ?? 0) - 1, top: 97 + 70 * 0 }, { input: await addHealthImage.toBuffer(), left: 1360 - ((await addHealthImage.metadata()).width ?? 0), top: 97 + 70 * 0 }, { input: await maxHealthImage.toBuffer(), left: 1360 - ((await maxHealthImage.metadata()).width ?? 0), top: 67 + 70 * 0 }, { input: await baseAttackImage.toBuffer(), left: 1360 - ((await baseAttackImage.metadata()).width ?? 0) - ((await addAttackImage.metadata()).width ?? 0) - 1, top: 97 + 70 * 1 }, { input: await addAttackImage.toBuffer(), left: 1360 - ((await addAttackImage.metadata()).width ?? 0), top: 97 + 70 * 1 }, { input: await attackImage.toBuffer(), left: 1360 - ((await attackImage.metadata()).width ?? 0), top: 67 + 70 * 1 }, { input: await baseDefenseImage.toBuffer(), left: 1360 - ((await baseDefenseImage.metadata()).width ?? 0) - ((await addDefenseImage.metadata()).width ?? 0) - 1, top: 97 + 70 * 2 }, { input: await addDefenseImage.toBuffer(), left: 1360 - ((await addDefenseImage.metadata()).width ?? 0), top: 97 + 70 * 2 }, { input: await defenseImage.toBuffer(), left: 1360 - ((await defenseImage.metadata()).width ?? 0), top: 67 + 70 * 2 }, { input: await elementMasteryImage.toBuffer(), left: 1360 - ((await elementMasteryImage.metadata()).width ?? 0), top: 67 + 70 * 3 }, { input: await critRateImage.toBuffer(), left: 1360 - ((await critRateImage.metadata()).width ?? 0), top: 67 + 70 * 4 }, { input: await critDamageImage.toBuffer(), left: 1360 - ((await critDamageImage.metadata()).width ?? 0), top: 67 + 70 * 5 }, { input: await chargeEfficiencyImage.toBuffer(), left: 1360 - ((await chargeEfficiencyImage.metadata()).width ?? 0), top: 67 + 70 * 6 });
    // 元素ダメージ, 治療効果
    if (characterMaxValueStatus.value > 0) {
        let maxValueStatusIcon = (0, sharp_1.default)(path_1.default.join(emotePath, `${characterMaxValueStatus.name}.png`))
            .resize(40, 40);
        let maxValueStatusNameImage = textToImage.getSharp(characterMaxValueStatus.name, "png", {
            fontSize: 27,
            y: -27
        });
        let maxValueStatusImage = textToImage.getSharp(`${characterMaxValueStatus.value.toFixed(1)}%`, "png", {
            fontSize: 26,
            y: -26
        });
        characterStatusPasteList.push({ input: await maxValueStatusIcon.toBuffer(), left: 787, top: 62 + 70 * 7 }, { input: await maxValueStatusNameImage.toBuffer(), left: 845, top: 67 + 70 * 7 }, { input: await maxValueStatusImage.toBuffer(), left: 1360 - ((await maxValueStatusImage.metadata()).width ?? 0), top: 67 + 70 * 7 });
    }
    characterStatusPaste.composite(characterStatusPasteList);
    // 合計スコア
    let artifactScorePaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let scoreTotalImage = textToImage.getSharp(scoreTotal.toFixed(1), "png", {
        fontSize: 75,
        y: -75
    });
    let convAsImage = textToImage.getSharp(`${convAsMap[calcType]}換算`, "png", {
        fontSize: 24,
        y: -24
    });
    let scoreBadge;
    if (scoreTotal >= scoreRank.total.SS) {
        scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "SS.png"));
    }
    else if (scoreTotal >= scoreRank.total.S) {
        scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "S.png"));
    }
    else if (scoreTotal >= scoreRank.total.A) {
        scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "A.png"));
    }
    else {
        scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "B.png"));
    }
    scoreBadge.resize(Math.floor(((await scoreBadge.metadata()).width ?? 0) * 0.125));
    artifactScorePaste
        .composite([
        { input: await scoreTotalImage.toBuffer(), left: 1652 - Math.floor(((await scoreTotalImage.metadata()).width ?? 0) / 2), top: 420 },
        { input: await convAsImage.toBuffer(), left: 1867 - ((await convAsImage.metadata()).width ?? 0), top: 585 },
        { input: await scoreBadge.toBuffer(), left: 1806, top: 345 }
    ]);
    // 聖遺物
    let artifactPreviewPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    let artifactStatusPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    for (let i = 0; i < artifacts.length; i++) {
        let artifact = artifacts[i];
        if (artifact === null)
            continue;
        let artifactMask = (0, sharp_1.default)(path_1.default.join(assetsPath, "ArtifactMask.png"))
            .resize(332, 332);
        let artifactImage = (0, sharp_1.default)(path_1.default.join(artifactPath, artifact.artifactData.set.name.get("jp"), `${artifactTypeMap[artifact.artifactData.equipType]}.png`))
            .resize(332, 332)
            .modulate({
            brightness: 0.6,
            saturation: 0.6
        });
        artifactImage = await (0, sharp_utils_1.mask)(artifactImage, artifactMask);
        if (["flower", "crown"].includes(artifactTypeMap[artifact.artifactData.equipType])) {
            artifactPreviewPaste = await composite(artifactPreviewPaste, artifactImage, -37 + 373 * i, 570) ?? artifactPreviewPaste;
        }
        else if (["wing", "cup"].includes(artifactTypeMap[artifact.artifactData.equipType])) {
            artifactPreviewPaste = await composite(artifactPreviewPaste, artifactImage, -36 + 373 * i, 570) ?? artifactPreviewPaste;
        }
        else {
            artifactPreviewPaste = await composite(artifactPreviewPaste, artifactImage, -35 + 373 * i, 570) ?? artifactPreviewPaste;
        }
        // メインOP
        let mainStatus = artifact.mainstat;
        let mainOpName = mainStatus.fightPropName.get("jp");
        let mainOpValue = mainStatus.isPercent ?
            commaSplittedNumber(mainStatus.getMultipliedValue(), 1) :
            commaSplittedNumber(mainStatus.getMultipliedValue(), 0);
        let mainOpIcon = (0, sharp_1.default)(path_1.default.join(emotePath, `${Object.keys(statusNameMap).includes(mainOpName) && mainStatus.isPercent ? statusNameMap[mainOpName].long : mainOpName}.png`))
            .resize(35, 35);
        let mainOpNameImage = textToImage.getSharp(Object.keys(statusNameMap).includes(mainOpName) && mainStatus.isPercent ? statusNameMap[mainOpName].short : mainOpName, "png", {
            fontSize: 29,
            y: -29
        });
        let mainOpValueImage = textToImage.getSharp(`${mainOpValue}${mainStatus.isPercent ? "%" : ""}`, "png", {
            fontSize: 49,
            y: -49
        });
        let artifactLevelImage = textToImage.getSharp(`+${artifact.level - 1}`, "png", {
            fontSize: 21,
            y: -21
        });
        let artifactLevelRect = (0, sharp_utils_1.roundedRect)(45, 24, 0, 0, 2);
        artifactStatusPaste = await composite(artifactStatusPaste, [
            {
                input: await mainOpIcon.toBuffer(),
                left: 340 + 373 * i - ((await mainOpNameImage.metadata()).width ?? 0),
                top: 655
            },
            {
                input: await mainOpNameImage.toBuffer(),
                left: 375 + 373 * i - ((await mainOpNameImage.metadata()).width ?? 0),
                top: 655
            },
            {
                input: await mainOpValueImage.toBuffer(),
                left: 375 + 373 * i - ((await mainOpValueImage.metadata()).width ?? 0),
                top: 690
            },
            {
                input: await artifactLevelRect.toBuffer(),
                left: 373 + 373 * i - 43,
                top: 748
            },
            {
                input: await artifactLevelImage.toBuffer(),
                left: 374 + 373 * i - ((await artifactLevelImage.metadata()).width ?? 0),
                top: 749
            }
        ]) ?? artifactStatusPaste;
        // サブOP
        let subStatusTotal = artifact.substats.total;
        let subStatusSplit = artifact.substats.split;
        let subStatusGrowth = {};
        subStatusSplit.forEach(growth => {
            if (!subStatusGrowth[fightProp[growth.fightProp]]) {
                subStatusGrowth[fightProp[growth.fightProp]] = [];
            }
            subStatusGrowth[fightProp[growth.fightProp]].push(growth.isPercent ?
                commaSplittedNumber(growth.getMultipliedValue(), 1) :
                String(Math.round(growth.getMultipliedValue())));
        });
        Object.keys(subStatusGrowth).forEach(type => subStatusGrowth[type] = subStatusGrowth[type].sort().join("+"));
        for (let j = 0; j < subStatusTotal.length; j++) {
            let subOpName = fightProp[subStatusTotal[j].fightProp];
            let subOpValue = subStatusTotal[j].isPercent ?
                commaSplittedNumber(subStatusTotal[j].getMultipliedValue(), 1) :
                commaSplittedNumber(subStatusTotal[j].getMultipliedValue(), 0);
            let subOpIcon = (0, sharp_1.default)(path_1.default.join(emotePath, `${Object.keys(statusNameMap).includes(subOpName) && subStatusTotal[j].isPercent ? statusNameMap[subOpName].long : subOpName}.png`))
                .resize(30, 30);
            let subOpNameImage = textToImage.getSharp(Object.keys(statusNameMap).includes(subStatusTotal[j].fightPropName.get("jp")) && subStatusTotal[j].isPercent ? statusNameMap[subStatusTotal[j].fightPropName.get("jp")].short : subOpName, "png", {
                fontSize: 25,
                y: -25
            });
            let subOpValueImage = textToImage.getSharp(`${subOpValue}${subStatusTotal[j].isPercent ? "%" : ""}`, "png", {
                fontSize: 25,
                y: -25
            });
            let subOpGrowthImage = textToImage.getSharp(subStatusGrowth[subOpName], "png", {
                fontSize: 11,
                y: -11,
                attributes: {
                    fill: "rgba(255, 255, 255, 0.7)"
                }
            });
            artifactStatusPaste = await composite(artifactStatusPaste, [
                {
                    input: await subOpIcon.toBuffer(),
                    left: 44 + 373 * i,
                    top: 811 + 50 * j
                },
                {
                    input: await subOpNameImage.toBuffer(),
                    left: 79 + 373 * i,
                    top: 811 + 50 * j
                },
                {
                    input: await subOpValueImage.toBuffer(),
                    left: 375 + 373 * i - ((await subOpValueImage.metadata()).width ?? 0),
                    top: 811 + 50 * j
                },
                {
                    input: await subOpGrowthImage.toBuffer(),
                    left: 375 + 373 * i - ((await subOpGrowthImage.metadata()).width ?? 0),
                    top: 840 + 50 * j
                }
            ]) ?? artifactStatusPaste;
        }
        // スコア
        let score = (0, exports.calcScore)(artifacts[i], calcType);
        let scoreBadge;
        if (score >= scoreRank[artifact.artifactData.equipType]["SS"]) {
            scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "SS.png"));
        }
        else if (score >= scoreRank[artifact.artifactData.equipType]["S"]) {
            scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "S.png"));
        }
        else if (score >= scoreRank[artifact.artifactData.equipType]["A"]) {
            scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "A.png"));
        }
        else {
            scoreBadge = (0, sharp_1.default)(path_1.default.join(artifactGradePath, "B.png"));
        }
        scoreBadge.resize(Math.floor(((await scoreBadge.metadata()).width ?? 0) / 11));
        let scoreText = textToImage.getSharp("Score", "png", {
            fontSize: 27,
            y: -27,
            attributes: {
                fill: "#A0A0A0"
            }
        });
        let scoreImage = textToImage.getSharp(commaSplittedNumber(score, 1), "png", {
            fontSize: 36,
            y: -36
        });
        artifactStatusPaste = await composite(artifactStatusPaste, [
            {
                input: await scoreBadge.toBuffer(),
                left: 85 + 373 * i,
                top: 1013
            },
            {
                input: await scoreText.toBuffer(),
                left: 295 + 373 * i - ((await scoreImage.metadata()).width ?? 0),
                top: 1025
            },
            {
                input: await scoreImage.toBuffer(),
                left: 380 + 373 * i - ((await scoreImage.metadata()).width ?? 0),
                top: 1016
            }
        ]) ?? artifactStatusPaste;
    }
    let artifactSet = {};
    artifacts.forEach(a => {
        if (a !== null) {
            artifactSet[a.artifactData.set.name.get("jp")] === undefined ?
                artifactSet[a.artifactData.set.name.get("jp")] = 1 :
                artifactSet[a.artifactData.set.name.get("jp")]++;
        }
    });
    let setCount = Object.keys(artifactSet).filter(set => artifactSet[set] >= 2);
    let setBonusPaste = (0, sharp_utils_1.createImage)(baseSize.width, baseSize.height);
    for (let i = 0; i < setCount.length; i++) {
        if (artifactSet[setCount[i]] >= 4) {
            let setText = textToImage.getSharp(setCount[i], "png", {
                fontSize: 23,
                y: -23,
                attributes: {
                    fill: "#0F0"
                }
            });
            let setCountRect = (0, sharp_utils_1.roundedRect)(44, 25, 0, 0, 1);
            let setCountImage = textToImage.getSharp(String(artifactSet[setCount[i]]), "png", {
                fontSize: 19,
                y: -19
            });
            setBonusPaste = await composite(setBonusPaste, [
                {
                    input: await setText.toBuffer(),
                    left: 1536,
                    top: 263
                },
                {
                    input: await setCountRect.toBuffer(),
                    left: 1818,
                    top: 263
                },
                {
                    input: await setCountImage.toBuffer(),
                    left: 1834,
                    top: 265
                }
            ]) ?? setBonusPaste;
        }
        else if (artifactSet[setCount[i]] >= 2) {
            let setText = textToImage.getSharp(setCount[i], "png", {
                fontSize: 23,
                y: -23,
                attributes: {
                    fill: "#0F0"
                }
            });
            let setCountRect = (0, sharp_utils_1.roundedRect)(44, 25, 0, 0, 1);
            let setCountImage = textToImage.getSharp(String(artifactSet[setCount[i]]), "png", {
                fontSize: 19,
                y: -19
            });
            setBonusPaste = await composite(setBonusPaste, [
                {
                    input: await setText.toBuffer(),
                    left: 1536,
                    top: 243 + 35 * i
                },
                {
                    input: await setCountRect.toBuffer(),
                    left: 1818,
                    top: 243 + 35 * i
                },
                {
                    input: await setCountImage.toBuffer(),
                    left: 1834,
                    top: 245 + 35 * i
                }
            ]) ?? setBonusPaste;
        }
    }
    return base.composite([
        { input: await characterPaste.toBuffer(), left: 0, top: 0 },
        { input: await shadow.toBuffer(), left: 0, top: 0 },
        { input: await weaponPaste.toBuffer(), left: 0, top: 0 },
        { input: await weaponRarePaste.toBuffer(), left: 0, top: 0 },
        { input: await talentBasePaste.toBuffer(), left: 0, top: 0 },
        { input: await constBasePaste.toBuffer(), left: 0, top: 0 },
        { input: await characterInfoPaste.toBuffer(), left: 0, top: 0 },
        { input: await characterStatusPaste.toBuffer(), left: 0, top: 0 },
        { input: await artifactScorePaste.toBuffer(), left: 0, top: 0 },
        { input: await artifactPreviewPaste.toBuffer(), left: 0, top: 0 },
        { input: await artifactStatusPaste.toBuffer(), left: 0, top: 0 },
        { input: await setBonusPaste.toBuffer(), left: 0, top: 0 }
    ]).toBuffer();
};
exports.generate = generate;
