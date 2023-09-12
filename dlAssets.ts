import path from "path"
import { EnkaClient } from "enka-network-api"
import { existsSync, mkdirSync } from "fs"
import { downloadFile } from "./functions"



const apiBaseUrl = new URL("https://enka.network/ui")
const enka = new EnkaClient({
    defaultLanguage: "jp",
    defaultImageBaseUrl: apiBaseUrl.href
})
const destCharacter = path.join(__dirname, "character")
const destWeapon = path.join(__dirname, "weapon")
const destArtifact = path.join(__dirname, "artifact")

const artifactTypeMap = {
    EQUIP_BRACER    : "flower",
    EQUIP_DRESS     : "crown",
    EQUIP_NECKLACE  : "wing",
    EQUIP_RING      : "cup",
    EQUIP_SHOES     : "clock"
}

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
]

interface TargetUrl {
    normalAttack: string
    elementalSkill: string | undefined
    elementalBurst: string | undefined
    splashImage: string
    constellations: Array<string>
}

const isKeyofTargetUrl = (arg: string): arg is keyof TargetUrl => {
    let obj: { [key in keyof TargetUrl]: string } = {
        normalAttack: "",
        elementalBurst: "",
        elementalSkill: "",
        splashImage: "",
        constellations: ""
    }
    return Object.keys(obj).includes(arg)
}





if(!existsSync(destCharacter)) mkdirSync(destCharacter)
if(!existsSync(destWeapon)) mkdirSync(destWeapon)
if(!existsSync(destArtifact)) mkdirSync(destArtifact)

// キャラクター
enka.getAllCharacters().forEach((character, c) => {
    try {
        let name = character.name.get()
        let element = character.element?.name.get().charAt(0)
        let targetUrl: TargetUrl = {
            normalAttack: character.normalAttack.icon.url,
            elementalSkill: character.elementalSkill?.icon.url,
            elementalBurst: character.elementalBurst?.icon.url,
            splashImage: name === "旅人" ? `https://api.ambr.top/assets/UI/${ character.splashImage.url.split("/").reverse()[0] }` : character.splashImage.url,
            constellations: character.constellations.map(c => c.icon.url)
        }

        // 旅人の場合
        if(name === "旅人") {
            if(character.gender === "MALE") name = `空(${ element })`
            else if(character.gender === "FEMALE") name = `蛍(${ element })`
        }

        let dest = path.join(destCharacter, name)

        if(!existsSync(dest)) mkdirSync(dest)
        Object.keys(targetUrl).forEach(key => {
            if(isKeyofTargetUrl(key)) {
                let url = targetUrl[key]

                // 配列？
                if(url instanceof Array) {
                    url.forEach((con: string, i: number) => {
                        const filename = path.join(dest, `constellations${ i + 1 }.png`)
                        // ファイルが存在する？
                        if(!existsSync(filename) && !URLBlackList.includes(con)) {
                            downloadFile(con, filename).then(() => {
                                console.log(`Downloaded ${ con }`)
                            }).catch(err => {
                                console.log(`Failed request file ${ con }.`)
                            })
                        }
                    })
                } else if(typeof url === "string") {
                    const filename = path.join(dest, `${ key }.png`)
                    if(!existsSync(filename) && !URLBlackList.includes(url)) {
                        downloadFile(url, filename).then(() => {
                            console.log(`Downloaded ${ url }`)
                        }).catch(err => {
                            console.log(`Failed request file ${ url }.`)
                        })
                    }
                }
            }
        })
    } catch(err) {
        console.log(err)
    }
})

// キャラクターコスチューム
enka.getAllCostumes().forEach(cos => {
    if(cos.splashImage) {
        let charId = cos.characterId
        let charName = enka.getCharacterById(charId).name.get()
        let destCharName = path.join(destCharacter, charName)
        let destCostume = path.join(destCharName, "costumes")
        let filename = path.join(destCostume, `${ cos.name.get() }.png`)
        let imageUrl = cos.splashImage.url

        if(!existsSync(destCharName)) mkdirSync(destCharName)
        if(!existsSync(destCostume)) mkdirSync(destCostume)
        if(!existsSync(filename) && !URLBlackList.includes(imageUrl)) {
            downloadFile(imageUrl, filename).then(() => {
                console.log(`Downloaded ${ imageUrl }`)
            }).catch(err => {
                console.log(`Failed request file ${ imageUrl }.`)
            })
        }
    }
})

// 武器
enka.getAllWeapons().forEach(weapon => {
    weapon.awakenIcon
    let name = weapon.name.get()
    let imageUrl = `https://api.ambr.top/assets/UI/${ weapon.icon.url.split("/").reverse()[0] }`
    let filename = path.join(destWeapon, `${ name }.png`)

    if(!existsSync(filename) && !URLBlackList.includes(imageUrl)) {
        downloadFile(imageUrl, filename).then(() => {
            console.log(`Downloaded ${ imageUrl }`)
        }).catch(err => {
            console.log(`Failed request file ${ imageUrl }.`)
        })
    }
})

// 聖遺物
enka.getAllArtifacts().forEach(artifact => {
    let setName = artifact.set.name.get()
    let type = artifact.equipType
    let imageUrl = artifact.icon.url
    let dest = path.join(destArtifact, setName)
    let filename = path.join(dest, `${ artifactTypeMap[type] }.png`)

    if(!existsSync(dest)) mkdirSync(dest)
    // 画像が存在しない場合
    if(!existsSync(filename) && !URLBlackList.includes(imageUrl)) {
        downloadFile(imageUrl, filename).then(() => {
            console.log(`Downloaded ${ imageUrl }`)
        }).catch(err => {
            console.log(`Failed request file ${ imageUrl }.`)
        })
    }
})
