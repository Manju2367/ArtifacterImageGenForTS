# Artifacter Image Gen For TS

[ArtifacterImageGen](https://github.com/FuroBath/ArtifacterImageGen/tree/master)のTypeScript/JavaScript版。

## Installation

```
npm i aig.js
```

## Usage
アセットをダウンロードするスクリプトを実行します(多少時間がかかります)。
何故か一回ですべてダウンロードできないので、数回このスクリプトを実行して、コンソールにログが流れなくなるまで実行してください。

```
node node_modules/aig.js/dlAssets.js
```

[enka-network-api](https://www.npmjs.com/package/enka-network-api)(必須)でユーザー情報をフェッチし、[sharp](https://www.npmjs.com/package/sharp)で画像を保存する例。
```js
import { EnkaClient, Character, DetailedUser } from "enka-network-api"
import sharp from "sharp"
import { generate } from "aig.js"
import { exit } from "process"



const enka = new EnkaClient({
    defaultLanguage: "jp"
})

// ユーザー情報をfetch
let user = enka.fetchUser("8********")
if(user instanceof DetailedUser) {
    let character = user.characters[0]
    // 画像生成(攻撃力基準で計算)
    generate(character, "atk").then(result => {
        // sharpモジュールでBufferをpng画像として保存
        sharp(result).toFile("test.png")
        exit(1)
    })
}
```