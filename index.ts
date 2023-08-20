import path from "path"
import { Artifact, Character, EnkaClient, EquipType, FightProp } from "enka-network-api"
import sharp from "sharp"
import { TextToImage, mask, createImage, roundedRect } from "sharp-utils"
import { exit } from "process"



type ConvAs = "hp" | "atk" | "def" | "chg" | "mst"

// paths
const testPath          = path.join(__dirname, "test")
const assetsPath        = path.join(__dirname, "assets")
const fontPath          = path.join(assetsPath, "ja-jp.ttf")
const basePath          = path.join(__dirname, "base")
const characterPath     = path.join(__dirname, "character")
const weaponPath        = path.join(__dirname, "weapon")
const constellationPath = path.join(__dirname, "constellation")
const emotePath         = path.join(__dirname, "emotes")
const artifactGradePath = path.join(__dirname, "artifactGrades")
const artifactPath      = path.join(__dirname, "artifact")

const baseSize = {
    width: 1920,
    height: 1080
}

const textToImage = new TextToImage(fontPath, {
    anchor: "left top",
    attributes: {
        fill: "#FFFFFF",
        stroke: "none"
    }
})

const fightProp: {
    [key in FightProp]: string
} = {
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
}

const convAsMap = {
    hp: "HP",
    atk: "攻撃力",
    def: "防御力",
    chg: "元素チャージ効率",
    mst: "元素熟知"
}

const statusNameMap: {
    [key: string]: {
        short: string,
        long: string
    }
} = {
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
}

const artifactTypeMap: {
    [key in EquipType]: string
} = {
    EQUIP_BRACER    : "flower",
    EQUIP_DRESS     : "crown",
    EQUIP_NECKLACE  : "wing",
    EQUIP_RING      : "cup",
    EQUIP_SHOES     : "clock"
}

const scoreRank: {
    [key: string]: {
        SS: number,
        S: number,
        A: number
    }
} = {
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
}



/**
 * 聖遺物のスコア計算
 * @param {Artifact} artifact 聖遺物
 * @param {ConvAs} type 換算
 * @returns {number} 
 */
export const calcScore = (artifact: Artifact|null, type: ConvAs = "atk"): number => {
    if(artifact === null) return 0

    let score = 0
    artifact.substats.total.forEach(stat => {
        let value = Math.floor(stat.getMultipliedValue() * 10) / 10

        // 会心率
        if(fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CRITICAL) {
            score += (value * 2)
        }
        // 会心ダメージ
        if(fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CRITICAL_HURT) {
            score += value
        }

        // HP%, 攻撃力%, 防御力%, 元素チャージ効率換算
        if(
            (type === "hp"  && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_HP_PERCENT)  ||
            (type === "atk" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_ATTACK_PERCENT) ||
            (type === "def" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_DEFENSE_PERCENT) ||
            (type === "chg" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_CHARGE_EFFICIENCY)
        ) {
            score += value
        }
        // 元素熟知換算
        if(type == "mst" && fightProp[stat.fightProp] === fightProp.FIGHT_PROP_ELEMENT_MASTERY) {
            score += (value * 0.25)
        }
    })

    return Math.round(score * 10) / 10
}

export const generate = async (character: Character, calcType: ConvAs = "atk"): Promise<Buffer> => {
    // キャラクター
    const characterElement          = character.characterData.element?.name.get("jp").charAt(0)
    const characterName             = character.characterData.name.get("jp") === "旅人" ?
                                        (character.characterData.gender === "MALE" ? `空(${ characterElement })` : `蛍(${ characterElement })`) :
                                        character.characterData.name.get("jp")
    const characterStatus           = character.stats
    const characterMaxHealth        = Math.round(characterStatus.maxHealth.getMultipliedValue()).toLocaleString()
    const characterBaseHealth       = Math.round(characterStatus.healthBase.getMultipliedValue()).toLocaleString()
    const characterAddHealth        = (Math.round(characterStatus.maxHealth.getMultipliedValue()) - Math.round(characterStatus.healthBase.getMultipliedValue())).toLocaleString()
    const characterAttack           = Math.round(characterStatus.attack.getMultipliedValue()).toLocaleString()
    const characterBaseAttack       = Math.round(characterStatus.attackBase.getMultipliedValue()).toLocaleString()
    const characterAddAttack        = (Math.round(characterStatus.attack.getMultipliedValue()) - Math.round(characterStatus.attackBase.getMultipliedValue())).toLocaleString()
    const characterDefense          = Math.round(characterStatus.defense.getMultipliedValue()).toLocaleString()
    const characterBaseDefense      = Math.round(characterStatus.defenseBase.getMultipliedValue()).toLocaleString()
    const characterAddDefense       = (Math.round(characterStatus.defense.getMultipliedValue()) - Math.round(characterStatus.defenseBase.getMultipliedValue())).toLocaleString()
    const characterElementMastery   = Math.round(characterStatus.elementMastery.getMultipliedValue()).toLocaleString()
    const characterCritRate         = characterStatus.critRate.getMultipliedValue().toFixed(1)
    const characterCritDamage       = characterStatus.critDamage.getMultipliedValue().toFixed(1)
    const characterChargeEfficiency = characterStatus.chargeEfficiency.getMultipliedValue().toFixed(1)
    const characterPyroDamage       = {
        name: characterStatus.pyroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.pyroDamage.getMultipliedValue() * 10) / 10
    }
    const characterHydroDamage      = {
        name: characterStatus.hydroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.hydroDamage.getMultipliedValue() * 10) / 10
    }
    const characterCryoDamage       = {
        name: characterStatus.cryoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.cryoDamage.getMultipliedValue() * 10) / 10
    }
    const characterElectroDamage    = {
        name: characterStatus.electroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.electroDamage.getMultipliedValue() * 10) / 10
    }
    const characterDendroDamage     = {
        name: characterStatus.dendroDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.dendroDamage.getMultipliedValue() * 10) / 10
    }
    const characterAnemoDamage      = {
        name: characterStatus.anemoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.anemoDamage.getMultipliedValue() * 10) / 10
    }
    const characterGeoDamage        = {
        name: characterStatus.geoDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.geoDamage.getMultipliedValue() * 10) / 10
    }
    const characterPhysicalDamage   = {
        name: characterStatus.physicalDamage.fightPropName.get("jp"),
        value: Math.round(characterStatus.physicalDamage.getMultipliedValue() * 10) / 10
    }
    const characterHealAdd          = {
        name: characterStatus.healAdd.fightPropName.get("jp"),
        value: Math.round(characterStatus.healAdd.getMultipliedValue() * 10) / 10
    }
    const characterMaxValueStatus   = [
        characterPyroDamage, 
        characterHydroDamage, 
        characterCryoDamage, 
        characterElectroDamage, 
        characterDendroDamage, 
        characterAnemoDamage, 
        characterGeoDamage, 
        characterPhysicalDamage, 
        characterHealAdd
    ].reduce((a, b) => a.value > b.value ? a : b)
    const characterConstellations   = character.unlockedConstellations
    const characterLevel            = character.level
    const characterFriendship       = character.friendship
    const characterTalent           = {
        normalAttack    : character.skillLevels[0].level.value,
        elementalSkill  : character.skillLevels[1].level.value,
        elementalBurst  : character.skillLevels[2].level.value
    }
    
    // 武器
    const weapon                    = character.weapon
    const weaponName                = weapon.weaponData.name.get("jp")
    const weaponLevel               = weapon.level
    const weaponRank                = weapon.refinementRank
    const weaponRarelity            = weapon.weaponData.stars
    const weaponBaseAtk             = weapon.weaponStats[0].getMultipliedValue().toFixed()
    const weaponSubStatusName       = weapon.weaponStats[1] ?
                                      weapon.weaponStats[1].fightPropName.get("jp") :
                                      ""
    const weaponSubStatusValue      = weapon.weaponStats[1] ?
                                      weapon.weaponStats[1].isPercent ?
                                      weapon.weaponStats[1].getMultipliedValue().toFixed(1) :
                                      weapon.weaponStats[1].getMultipliedValue().toFixed() :
                                      ""
    const weaponSubStatusType       = weapon.weaponStats[1] ?
                                      weapon.weaponStats[1].fightPropName.get("jp") :
                                      ""

    // 聖遺物
    const artifacts: Array<Artifact|null> = [null, null, null, null, null]
    character.artifacts.forEach(artifact => {
        if(artifact.artifactData.equipType === "EQUIP_BRACER") {
            artifacts[0] = artifact
        } else if(artifact.artifactData.equipType === "EQUIP_NECKLACE") {
            artifacts[1] = artifact
        } else if(artifact.artifactData.equipType === "EQUIP_SHOES") {
            artifacts[2] = artifact
        } else if(artifact.artifactData.equipType === "EQUIP_RING") {
            artifacts[3] = artifact
        } else if(artifact.artifactData.equipType === "EQUIP_DRESS") {
            artifacts[4] = artifact
        }
    })
    const scoreFlower               = calcScore(artifacts[0], calcType)
    const scoreWing                 = calcScore(artifacts[1], calcType)
    const scoreClock                = calcScore(artifacts[2], calcType)
    const scoreCup                  = calcScore(artifacts[3], calcType)
    const scoreCrown                = calcScore(artifacts[4], calcType)
    const scoreTotal                = scoreFlower + scoreWing + scoreClock + scoreCup + scoreCrown










    // ベース
    let base = sharp(path.join(basePath, `${ characterElement }.png`))
    let shadow = sharp(path.join(assetsPath, "Shadow.png"))



    // キャラクター
    let characterPaste = createImage(baseSize.width, baseSize.height)
    let characterImage = sharp(path.join(characterPath, characterName, character.costume.isDefault ? "splashImage.png" : `costumes/${ character.costume.name.get("jp") }.png`))
    if(/蛍\(.\)/.test(characterName) || /空\(.\)/.test(characterName)) {
        let paste = createImage(2048, 1024)
        characterImage.resize(Math.floor(2048*0.9))
        paste.composite([{
            input: await characterImage.toBuffer(),
            left: Math.floor((2048 - 2048*0.9) / 2),
            top: (1024 - Math.floor(1024*0.9)) + 20,
        }])
        characterImage = sharp(await paste.toBuffer())
    }
    
    characterImage
        .extract({
            left: 289,
            top: 0,
            width: 1728 - 289,
            height: 1024
        })
        .resize(Math.floor((1728 - 289) * 0.75))
    let characterAvatarMask = sharp(path.join(assetsPath, "CharacterMask.png"))
        .resize(Math.floor((1728 - 289) * 0.75), Math.floor(1024 * 0.75))
    characterImage = await mask(characterImage, characterAvatarMask)

    characterPaste.composite([{
        input: await characterImage.toBuffer(),
        left: -160,
        top: -45
    }])



    // 武器
    let weaponImage = sharp(path.join(weaponPath, `${ weaponName }.png`))
        .resize(128, 128)
    let weaponPaste = createImage(baseSize.width, baseSize.height)

    let weaponNameImage = textToImage.getSharp(weaponName, "png", {
        fontSize: 26,
        y: -26
    })
    let weaponLevelImage = textToImage.getSharp(`Lv.${ weaponLevel }`, "png", {
        fontSize: 24,
        y: -24
    })
    let rectWeaponLevel = roundedRect(((await weaponLevelImage.metadata()).width ?? 0) + 4, 28, 0, 0, 1)
    

    let baseAttackIcon = sharp(path.join(emotePath, "基礎攻撃力.png"))
        .resize(23, 23)
    let weaponBaseAttackImage = textToImage.getSharp(`基礎攻撃力  ${ weaponBaseAtk }`, "png", {
        fontSize: 23,
        y: -23
    })

    let rectWeaponRank = roundedRect(40, 25, 0, 0, 1)
    let weaponRankImage = textToImage.getSharp(`R${ weaponRank }`, "png", {
        fontSize: 24,
        y: -24
    })

    let weaponPasteList = []
    weaponPasteList.push(
        { input: await weaponImage.toBuffer(), left: 1430, top: 50 },
        { input: await weaponNameImage.toBuffer(), left: 1582, top: 47 },
        { input: await rectWeaponLevel.toBuffer(), left: 1582, top: 80 },
        { input: await weaponLevelImage.toBuffer(), left: 1584, top: 82 },
        { input: await baseAttackIcon.toBuffer(), left: 1600, top: 120 },
        { input: await weaponBaseAttackImage.toBuffer(), left: 1623, top: 120 },
        { input: await rectWeaponRank.toBuffer(), left: 1430, top: 45 },
        { input: await weaponRankImage.toBuffer(), left: 1433, top: 46 }
    )
    
    if(weaponSubStatusValue) {
        let weaponSubStatusIcon = sharp(path.join(emotePath, `${ ["HP", "攻撃力", "防御力"].includes(weaponSubStatusType) ? statusNameMap[weaponSubStatusType].long : weaponSubStatusType }.png`))
            .resize(23, 23)
        let weaponSubStatusImage = textToImage.getSharp(`${ Object.keys(statusNameMap).includes(weaponSubStatusName) ? statusNameMap[weaponSubStatusName].short : weaponSubStatusName }  ${ weaponSubStatusValue }${ weapon.weaponStats[1].isPercent ? "%" : "" }`, "png", {
            fontSize: 23,
            y: -23
        })

        weaponPasteList.push(
            { input: await weaponSubStatusIcon.toBuffer(), left: 1600, top: 155 },
            { input: await weaponSubStatusImage.toBuffer(), left: 1623, top: 155 }
        )
    }

    weaponPaste.composite(weaponPasteList)

    let weaponRareImage = sharp(path.join(assetsPath, "Rarelity", `${ weaponRarelity }.png`))
    weaponRareImage.resize(Math.floor(((await weaponRareImage.metadata()).width ?? 0) * 0.97))
    let weaponRarePaste = createImage(baseSize.width, baseSize.height)
    
    weaponRarePaste
        .composite([{ input: await weaponRareImage.toBuffer(), left: 1422, top: 173 }])



    return base.composite(
        [
            { input: await characterPaste.toBuffer(), left: 0, top: 0 },
            { input: await shadow.toBuffer(), left: 0, top: 0},
            { input: await weaponPaste.toBuffer(), left: 0, top: 0},
            { input: await weaponRarePaste.toBuffer(), left: 0, top: 0},
            // { input: await talentBasePaste.toBuffer(), left: 0, top: 0},
            // { input: await constBasePaste.toBuffer(), left: 0, top: 0},
            // { input: await characterInfoPaste.toBuffer(), left: 0, top: 0},
            // { input: await characterStatusPaste.toBuffer(), left: 0, top: 0},
            // { input: await artifactScorePaste.toBuffer(), left: 0, top: 0},
            // { input: await artifactPreviewPaste.toBuffer(), left: 0, top: 0},
            // { input: await artifactStatusPaste.toBuffer(), left: 0, top: 0},
            // { input: await setBonusPaste.toBuffer(), left: 0, top: 0 }
        ]
    ).toBuffer()
}