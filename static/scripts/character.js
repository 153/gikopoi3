import { RenderCache } from "./rendercache.js";
import { annualEvents } from "./annualevents.js";

// Some character SVGs contain a "gikopoipoi_eyes_open"/"gikopoipoi_eyes_closed" pair of
// elements (ported over from gikopoi2's assets) that can be toggled to make the character blink.
// This never modifies the SVG files themselves, only the in-memory copy used to render a frame.
function isBlinkCapable(svgString)
{
    return typeof svgString === "string" && svgString.includes("gikopoipoi_eyes_");
}

function setEyesDisplay(svgString, hasEyesClosed)
{
    const template = document.createElement("template");
    template.innerHTML = svgString;
    const svgRoot = template.content.firstElementChild;
    if (!svgRoot) return svgString;

    const setDisplay = (id, display) =>
        svgRoot.querySelectorAll('[id="' + id + '"]').forEach(el => { el.style.display = display; });

    setDisplay("gikopoipoi_eyes_open", hasEyesClosed ? "none" : "inline");
    setDisplay("gikopoipoi_eyes_closed", hasEyesClosed ? "inline" : "none");

    return svgRoot.outerHTML;
}

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
        const stringToImage = (svgString, hasEyesClosed) => new Promise((resolve) => {
            const img = new Image()
            if (dto.isBase64)
                img.src = "data:image/png;base64," + svgString
            else
                img.src = "data:image/svg+xml;base64," + btoa(hasEyesClosed ? setEyesDisplay(svgString, true) : svgString)
            img.addEventListener("load", () => resolve(img))
        })

        // Loads an image and, if the source SVG is blink-capable, its eyes-closed counterpart too
        // (falling back to the same image otherwise, so callers never need to special-case it).
        const loadImageWithBlinkVariant = async (svgString, isFlipped) =>
        {
            const image = RenderCache.Image(await stringToImage(svgString, false), this.scale, isFlipped)
            const eyesClosedImage = isBlinkCapable(svgString)
                ? RenderCache.Image(await stringToImage(svgString, true), this.scale, isFlipped)
                : image
            return [image, eyesClosedImage]
        }

        ;[this.frontSittingImage, this.frontSittingImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontSitting, false)
        ;[this.frontStandingImage, this.frontStandingImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontStanding, false)
        ;[this.frontWalking1Image, this.frontWalking1ImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking1, false)
        ;[this.frontWalking2Image, this.frontWalking2ImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking2, false)
        ;[this.backSittingImage, this.backSittingImageEyesClosed] = await loadImageWithBlinkVariant(dto.backSitting, false)
        ;[this.backStandingImage, this.backStandingImageEyesClosed] = await loadImageWithBlinkVariant(dto.backStanding, false)
        ;[this.backWalking1Image, this.backWalking1ImageEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking1, false)
        ;[this.backWalking2Image, this.backWalking2ImageEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking2, false)

        ;[this.frontSittingFlippedImage, this.frontSittingFlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontSitting, true)
        ;[this.frontStandingFlippedImage, this.frontStandingFlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontStanding, true)
        ;[this.frontWalking1FlippedImage, this.frontWalking1FlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking1, true)
        ;[this.frontWalking2FlippedImage, this.frontWalking2FlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking2, true)
        ;[this.backSittingFlippedImage, this.backSittingFlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.backSitting, true)
        ;[this.backStandingFlippedImage, this.backStandingFlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.backStanding, true)
        ;[this.backWalking1FlippedImage, this.backWalking1FlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking1, true)
        ;[this.backWalking2FlippedImage, this.backWalking2FlippedImageEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking2, true)

        // Alternate images
        ;[this.frontSittingImageAlt, this.frontSittingImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontSittingAlt || dto.frontSitting, false)
        ;[this.frontStandingImageAlt, this.frontStandingImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontStandingAlt || dto.frontStanding, false)
        ;[this.frontWalking1ImageAlt, this.frontWalking1ImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking1Alt || dto.frontWalking1, false)
        ;[this.frontWalking2ImageAlt, this.frontWalking2ImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking2Alt || dto.frontWalking2, false)
        ;[this.backSittingImageAlt, this.backSittingImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backSittingAlt || dto.backSitting, false)
        ;[this.backStandingImageAlt, this.backStandingImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backStandingAlt || dto.backStanding, false)
        ;[this.backWalking1ImageAlt, this.backWalking1ImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking1Alt || dto.backWalking1, false)
        ;[this.backWalking2ImageAlt, this.backWalking2ImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking2Alt || dto.backWalking2, false)

        ;[this.frontSittingFlippedImageAlt, this.frontSittingFlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontSittingAlt || dto.frontSitting, true)
        ;[this.frontStandingFlippedImageAlt, this.frontStandingFlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontStandingAlt || dto.frontStanding, true)
        ;[this.frontWalking1FlippedImageAlt, this.frontWalking1FlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking1Alt || dto.frontWalking1, true)
        ;[this.frontWalking2FlippedImageAlt, this.frontWalking2FlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.frontWalking2Alt || dto.frontWalking2, true)
        ;[this.backSittingFlippedImageAlt, this.backSittingFlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backSittingAlt || dto.backSitting, true)
        ;[this.backStandingFlippedImageAlt, this.backStandingFlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backStandingAlt || dto.backStanding, true)
        ;[this.backWalking1FlippedImageAlt, this.backWalking1FlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking1Alt || dto.backWalking1, true)
        ;[this.backWalking2FlippedImageAlt, this.backWalking2FlippedImageAltEyesClosed] = await loadImageWithBlinkVariant(dto.backWalking2Alt || dto.backWalking2, true)
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
    furoshiki_chotto: new Character("furoshiki_chotto", "svg", false),
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
    pumpkin_shobon: new Character("pumpkin_shobon", "svg", false),
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
    chindonnya_shobon: new Character("chindonnya_shobon", "svg", false),
    shii_raincoat: new Character("shii_raincoat", "svg", false),
    shobon_raincoat: new Character("shobon_raincoat", "svg", false),
    shii_shintaisou: new Character("shii_shintaisou", "svg", false),
    giko_megane: new Character("giko_megane", "svg", false),    
    shii_megane: new Character("shii_megane", "svg", false),
    giko_headphones: new Character("giko_headphones", "svg", false),
    shii_headphones: new Character("shii_headphones", "svg", false),
    nanamegiko: new Character("nanamegiko", "svg", false),
    giko_matsuri: new Character("giko_matsuri", "svg", false),
    roubon: new Character("roubon", "svg", false),
    yukata_shii: new Character("yukata_shii", "svg", false),

    // begin gikopoi.com OC
    mitsugiko: new Character ("mitsugiko", "svg", false),    
    giko_cop: new Character ("giko_cop", "png", false),
    shujin: new Character("shujin", "svg", false),
    giko_batman: new Character ("giko_batman", "png", false),
    giko_hungover: new Character ("giko_hungover", "png", false),
    giko_hot: new Character ("giko_hot", "png", false),
    giko_icy: new Character ("giko_icy", "png", false),
    giko_islam: new Character ("giko_islam", "png", false),
    shii_islam: new Character ("shii_islam", "png", false),
    giko_shroom: new Character("giko_shroom", "png", false),
    akai: new Character("akai", "png", false),    
    bif_alien: new Character("bif_alien", "png", false),
    bif_wizard: new Character("bif_wizard", "png", false),
    boomer: new Character("boomer", "svg", false),
    hotaru: new Character("hotaru", "png", false),
    crow: new Character("crow", "svg", false),    

    clown_dokuo: new Character("clown_dokuo", "png", false),
    winter_shii: new Character("winter_shii", "svg", false),
    longcat: new Character("longcat", "png", false),
    kuma: new Character("kuma", "svg", false),
    mona: new Character("mona", "png", false),
    kiga: new Character("kiga", "png", false),
    foe: new Character("foe", "svg", false),
    domo: new Character("domo", "svg", false),
    onesan: new Character("onesan", "svg", false),
//    superfoe: new Character("superfoe", "svg", false),
    kimono_giko: new Character("kimono_giko", "svg", false),
    kimono_shii: new Character("kimono_shii", "svg", false),
    okabe_giko: new Character("okabe_giko", "svg", false),
    kurisu_shii: new Character("kurisu_shii", "svg", false),
    negativ: new Character("negativ", "png", false),
    rainbow: new Character("rainbow", "png", false),
    sonichu: new Character("sonichu", "png", false),
    garf: new Character("garf", "svg", false),    
    yume: new Character("yume", "png", false),
    tukan: new Character("tukan", "svg", false),
    ppakun: new Character("ppakun", "svg", false),
    zai: new Character("zai", "svg", false),
    
    // begin petsuki characters
    peng: new Character("peng", "svg", false),    
    siam: new Character("siam", "svg", false),
    mike: new Character("mike", "svg", false),
    kuro: new Character("kuro", "svg", false),
    bunn: new Character("bunn", "svg", false),
    hamtaro: new Character("hamtaro", "svg", false),    

    // begin secret characters
    ika: new Character("ika", "svg", true),
    giko_gold: new Character("giko_gold", "png", true),
    naito_npc: new Character("naito_npc", "png", true),
    habbo: new Character("habbo", "png", true),
    glenda: new Character("glenda", "svg", true),
    gacha: new Character("gacha", "svg", true),
    mini: new Character("mini", "svg", true),
    ufo: new Character("ufo", "svg", true),    
    blankchan: new Character ("blankchan", "png", false),    
    goatse: new Character("goatse", "png", true),
    
}

export const loadCharacters = async (crispMode) => {

    const response = await fetch("/characters/" + (crispMode ? "crisp" : "regular"))
    const dto = await response.json()

    return Promise.all(Object.keys(characters).map(characterId => characters[characterId].loadImages(dto[characterId])))
}
