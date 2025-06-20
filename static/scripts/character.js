import { RenderCache } from "./rendercache.js";
import { annualEvents } from "./annualevents.js";

export class Character
{
    constructor(name, format, isHidden, scale)
    {
        this.characterName = name;
        this.format = format;
        this.isHidden = isHidden
        this.scale = scale || 0.5

        this.frontSittingImage = null;
        this.frontStandingImage = null;
        this.frontWalking1Image = null;
        this.frontWalking2Image = null;
        this.backSittingImage = null;
        this.backStandingImage = null;
        this.backWalking1Image = null;
        this.backWalking2Image = null;
    }

    async loadImages(dto)
    {
        const stringToImage = (svgString) => new Promise((resolve) => {
            const img = new Image()
            if (dto.isBase64)
                img.src = "data:image/png;base64," + svgString
            else
                img.src = "data:image/svg+xml;base64," + btoa(svgString)
            img.addEventListener("load", () => resolve(img))
        })

        this.frontSittingImage = RenderCache.Image(await stringToImage(dto.frontSitting), this.scale)
        this.frontStandingImage = RenderCache.Image(await stringToImage(dto.frontStanding), this.scale)
        this.frontWalking1Image = RenderCache.Image(await stringToImage(dto.frontWalking1), this.scale)
        this.frontWalking2Image = RenderCache.Image(await stringToImage(dto.frontWalking2), this.scale)
        this.backSittingImage = RenderCache.Image(await stringToImage(dto.backSitting), this.scale)
        this.backStandingImage = RenderCache.Image(await stringToImage(dto.backStanding), this.scale)
        this.backWalking1Image = RenderCache.Image(await stringToImage(dto.backWalking1), this.scale)
        this.backWalking2Image = RenderCache.Image(await stringToImage(dto.backWalking2), this.scale)
        
        this.frontSittingFlippedImage = RenderCache.Image(await stringToImage(dto.frontSitting), this.scale, true)
        this.frontStandingFlippedImage = RenderCache.Image(await stringToImage(dto.frontStanding), this.scale, true)
        this.frontWalking1FlippedImage = RenderCache.Image(await stringToImage(dto.frontWalking1), this.scale, true)
        this.frontWalking2FlippedImage = RenderCache.Image(await stringToImage(dto.frontWalking2), this.scale, true)
        this.backSittingFlippedImage = RenderCache.Image(await stringToImage(dto.backSitting), this.scale, true)
        this.backStandingFlippedImage = RenderCache.Image(await stringToImage(dto.backStanding), this.scale, true)
        this.backWalking1FlippedImage = RenderCache.Image(await stringToImage(dto.backWalking1), this.scale, true)
        this.backWalking2FlippedImage = RenderCache.Image(await stringToImage(dto.backWalking2), this.scale, true)
        
        // Alternate images
        this.frontSittingImageAlt = RenderCache.Image(await stringToImage(dto.frontSittingAlt || dto.frontSitting), this.scale)
        this.frontStandingImageAlt = RenderCache.Image(await stringToImage(dto.frontStandingAlt || dto.frontStanding), this.scale)
        this.frontWalking1ImageAlt = RenderCache.Image(await stringToImage(dto.frontWalking1Alt || dto.frontWalking1), this.scale)
        this.frontWalking2ImageAlt = RenderCache.Image(await stringToImage(dto.frontWalking2Alt || dto.frontWalking2), this.scale)
        this.backSittingImageAlt = RenderCache.Image(await stringToImage(dto.backSittingAlt || dto.backSitting), this.scale)
        this.backStandingImageAlt = RenderCache.Image(await stringToImage(dto.backStandingAlt || dto.backStanding), this.scale)
        this.backWalking1ImageAlt = RenderCache.Image(await stringToImage(dto.backWalking1Alt || dto.backWalking1), this.scale)
        this.backWalking2ImageAlt = RenderCache.Image(await stringToImage(dto.backWalking2Alt || dto.backWalking2), this.scale)
        
        this.frontSittingFlippedImageAlt = RenderCache.Image(await stringToImage(dto.frontSittingAlt || dto.frontSitting ), this.scale, true)
        this.frontStandingFlippedImageAlt = RenderCache.Image(await stringToImage(dto.frontStandingAlt || dto.frontStanding ), this.scale, true)
        this.frontWalking1FlippedImageAlt = RenderCache.Image(await stringToImage(dto.frontWalking1Alt || dto.frontWalking1 ), this.scale, true)
        this.frontWalking2FlippedImageAlt = RenderCache.Image(await stringToImage(dto.frontWalking2Alt || dto.frontWalking2 ), this.scale, true)
        this.backSittingFlippedImageAlt = RenderCache.Image(await stringToImage(dto.backSittingAlt || dto.backSitting ), this.scale, true)
        this.backStandingFlippedImageAlt = RenderCache.Image(await stringToImage(dto.backStandingAlt || dto.backStanding ), this.scale, true)
        this.backWalking1FlippedImageAlt = RenderCache.Image(await stringToImage(dto.backWalking1Alt || dto.backWalking1 ), this.scale, true)
        this.backWalking2FlippedImageAlt = RenderCache.Image(await stringToImage(dto.backWalking2Alt || dto.backWalking2 ), this.scale, true)
    }
}

export const characters = {
    // original characters
    giko: new Character("giko", "svg", false),
    shii: new Character("shii", "svg", false),    
    naito: new Character("naito", "svg", false),
    giko_hat: new Character("giko_hat", "svg", false),
    shii_hat: new Character("shii_hat", "svg", false),
    furoshiki: new Character("furoshiki", "svg", false),
    shii_pianica: new Character("shii_pianica", "svg", false),
    dark_naito_walking: new Character("dark_naito_walking", "svg", false),
    shar_naito: new Character("shar_naito", "svg", false),
    naitoapple: new Character("naitoapple", "svg", false),
    hentai_giko: new Character("hentai_giko", "svg", false),    
    tinpopo: new Character("tinpopo", "svg", false),

    // begin gikopoipoi OC
    nida: new Character("nida", "svg", false),
    onigiri: new Character("onigiri", "svg", false),    
    hikki: new Character("hikki", "svg", false),
    shobon: new Character("shobon", "svg", false),
    salmon: new Character("salmon", "svg", false),
    shobon_hat: new Character("shobon_hat", "svg", false),    
    golden_furoshiki: new Character("golden_furoshiki", "svg", false),
    furoshiki_shii: new Character("furoshiki_shii", "svg", false),
    sakura_furoshiki_shii: new Character("sakura_furoshiki_shii", "svg", false),
    furoshiki_shobon: new Character("furoshiki_shobon", "svg", false),
    shii_toast: new Character("shii_toast", "svg", false),        
    shii_uniform: new Character("shii_uniform", "svg", false),
    hungry_giko: new Character("hungry_giko", "svg", false),
    rikishi_naito: new Character("rikishi_naito", "svg", false),
    takenoko: new Character("takenoko", "svg", false),
    kaminarisama_naito: new Character("kaminarisama_naito", "svg", false),
    panda_naito: new Character("panda_naito", "svg", false),
    wild_panda_naito: new Character("wild_panda_naito", "svg", false),
    funkynaito: new Character("funkynaito", "png", false),
    molgiko: new Character("molgiko", "png", false),
    tikan_giko: new Character("tikan_giko", "svg", false),
    hotsuma_giko: new Character("hotsuma_giko", "svg", false),
    dokuo: new Character("dokuo", "svg", false),
    tabako_dokuo: new Character("tabako_dokuo", "svg", false),
    himawari: new Character("himawari", "svg", false),
    zonu: new Character("zonu", "svg", false),
    george: new Character("george", "svg", false),
    chotto_toorimasu_yo: new Character("chotto_toorimasu_yo", "svg", false),
    tokita_naito: new Character("tokita_naito", "svg", false),
    pumpkinhead: new Character("pumpkinhead", "svg", false),
    naito_yurei: new Character("naito_yurei", "svg", false),
    shiinigami: new Character("shiinigami", "svg", false),
    youkanman: new Character("youkanman", "svg", false),
    baba_shobon: new Character("baba_shobon", "svg", false),
    uzukumari: new Character("uzukumari", "svg", false),
    giko_basketball: new Character("giko_basketball", "svg", false),
    giko_shamisen: new Character("giko_shamisen", "svg", false),
    mikan_naito: new Character("mikan_naito", "svg", false),
    shii_syakuhati: new Character("shii_syakuhati", "svg", false),
    taiko_naito: new Character("taiko_naito", "svg", false),
    shii_raincoat: new Character("shii_raincoat", "svg", false),
    shobon_raincoat: new Character("shobon_raincoat", "svg", false),
    shii_shintaisou: new Character("shii_shintaisou", "svg", false),


    // begin gikopoi.com OC
    mitsugiko: new Character ("mitsugiko", "svg", false),    
    giko_cop: new Character ("giko_cop", "png", false),
    shujin: new Character("shujin", "svg", false),
    giko_batman: new Character ("giko_batman", "png", false),
    giko_hungover: new Character ("giko_hungover", "png", false),
    giko_islam: new Character ("giko_islam", "png", false),
    shii_islam: new Character ("shii_islam", "png", false),
    giko_shroom: new Character("giko_shroom", "png", false),
    akai: new Character("akai", "png", false),    
    bif_alien: new Character("bif_alien", "png", false),
    bif_wizard: new Character("bif_wizard", "png", false),
    hotaru: new Character("hotaru", "png", false),
    winter_shii: new Character("winter_shii", "svg", false),
    longcat: new Character("longcat", "png", false),    
    mona: new Character("mona", "png", false),
    foe: new Character("foe", "svg", false),
    kimono_giko: new Character("kimono_giko", "svg", false),
    kimono_shii: new Character("kimono_shii", "svg", false),
    okabe_giko: new Character("okabe_giko", "svg", false),
    kurisu_shii: new Character("kurisu_shii", "svg", false),
    negativ: new Character("negativ", "png", false),
    rainbow: new Character("rainbow", "png", false),
    sonichu: new Character("sonichu", "png", false),
    yume: new Character("yume", "png", false),

    // begin secret characters
    ika: new Character("ika", "svg", true),
    giko_gold: new Character("giko_gold", "png", true),
    naito_npc: new Character("naito_npc", "png", true),
    habbo: new Character("habbo", "png", true),
    glenda: new Character("glenda", "svg", true),
    gacha: new Character("gacha", "svg", true),
    blankchan: new Character ("blankchan", "png", false),    
    goatse: new Character("goatse", "png", true),
    
}

export const loadCharacters = async (crispMode) => {

    const response = await fetch("/characters/" + (crispMode ? "crisp" : "regular"))
    const dto = await response.json()

    return Promise.all(Object.keys(characters).map(characterId => characters[characterId].loadImages(dto[characterId])))
}
