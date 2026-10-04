import { calculateRealCoordinates, BLOCK_HEIGHT, BLOCK_WIDTH } from "./utils.js";
import { RenderCache } from "./rendercache.js";
import { characters } from "./character.js";

const blinkOpenMinLength = 6000;
const blinkOpenLengthVariation = 1000;
const blinkClosedLength = 1000;

export default class User
{
    constructor(character, name)
    {
        this.id = null;
        this.name = name;
        // default to giko if the user has somehow set a non-existing character id
        this.character = character || characters.giko; 

        this.logicalPositionX = 0;
        this.logicalPositionY = 0;
        this.currentPhysicalPositionX = 0;
        this.currentPhysicalPositionY = 0;
        this.isWalking = false;
        this.isSpinning = false;
        this.isMoved = true;
        this.direction = "up";
        this.stepLength = this.character.characterName ==  "onigiri" ? (1000/60) * 10 : (1000/60) * 8;
        this.framesUntilNextStep = this.stepLength;
        this.frameCount = 0
        this.isInactive = false;
        
        this.nameImage = null;
        
        this.message = null;
        this.lastMessage = null;
        this.lastMovement = null;
        this.bubblePosition = "up";
        this.bubbleImage = null;
        this.voicePitch = null;
        this.isAlternateCharacter = false;

        this.isBlinking = false;
        // The blinking pattern/timing is derived deterministically from the user's id, computed
        // lazily in animateBlinking() once the id is known (it isn't available yet at construction time).
        this.blinkingPattern = null;
        this.blinkingStartShift = 0;
    }

    moveImmediatelyToPosition(room, logicalPositionX, logicalPositionY, direction)
    {
        this.logicalPositionX = logicalPositionX;
        this.logicalPositionY = logicalPositionY;

        const realTargetCoordinates = calculateRealCoordinates(room, this.logicalPositionX, this.logicalPositionY);

        this.currentPhysicalPositionX = realTargetCoordinates.x;
        this.currentPhysicalPositionY = realTargetCoordinates.y;
        this.direction = direction;
        this.isMoved = true;
    }

    moveToPosition(logicalPositionX, logicalPositionY, direction)
    {
        if (this.logicalPositionX != logicalPositionX || this.logicalPositionY != logicalPositionY)
        {
            this.isWalking = true;
        }

        this.logicalPositionX = logicalPositionX;
        this.logicalPositionY = logicalPositionY;
        this.direction = direction;
        this.isMoved = true;
    }
    
    calculatePhysicalPosition(room, delta)
    {
        if (!this.isWalking)
            return

        if (delta == 0)
            return
            
        const blockWidth = room.blockWidth ? room.blockWidth : BLOCK_WIDTH;
        const blockHeight = room.blockHeight ? room.blockHeight : BLOCK_HEIGHT;

        const characterSpeedDivider =
        {
            shar_naito: 13,
            shii_shintaisou: 13,
            roubon: 80,
        }[this.character.characterName] || 40;

        let walkingSpeedX = blockWidth / characterSpeedDivider
        let walkingSpeedY = blockHeight / characterSpeedDivider

        if (room.id == "long_st" || room.id == "kyougijou")
        {
            walkingSpeedX *= 2;
            walkingSpeedY *= 2;
        }

        // Adjust for delta since last animation frame
        walkingSpeedX *= delta / (1000 / 60)
        walkingSpeedY *= delta / (1000 / 60)

        const realTargetCoordinates = calculateRealCoordinates(room, this.logicalPositionX, this.logicalPositionY);

        const xDelta = Math.min(Math.abs(this.currentPhysicalPositionX - realTargetCoordinates.x), walkingSpeedX)
        const yDelta = Math.min(Math.abs(this.currentPhysicalPositionY - realTargetCoordinates.y), walkingSpeedY)

        if (this.currentPhysicalPositionX > realTargetCoordinates.x) this.currentPhysicalPositionX -= xDelta
        else if (this.currentPhysicalPositionX < realTargetCoordinates.x) this.currentPhysicalPositionX += xDelta

        if (this.currentPhysicalPositionY > realTargetCoordinates.y) this.currentPhysicalPositionY -= yDelta
        else if (this.currentPhysicalPositionY < realTargetCoordinates.y) this.currentPhysicalPositionY += yDelta

        if (xDelta === 0 && yDelta === 0)
        {
            this.isWalking = false;
            this.isSpinning = false;
        }

        this.framesUntilNextStep  -= delta;

        if (this.framesUntilNextStep < 0)
            this.framesUntilNextStep = this.stepLength;

        this.frameCount += delta;
        if (this.frameCount == Number.MAX_SAFE_INTEGER)
            this.frameCount = 0
    }

    getCurrentImage(room)
    {
        // Picks the character image variant matching this user's current state: normal/alt
        // character, and (if blink-capable) eyes open/closed.
        const hasEyesClosed = this.isBlinking || this.isSpinning || this.isInactive;
        const suffix = (this.isAlternateCharacter ? "Alt" : "") + (hasEyesClosed ? "EyesClosed" : "");
        const getImage = (state, isFlipped) =>
            this.character[state + (isFlipped ? "Flipped" : "") + "Image" + suffix];

        if (this.isSpinning)
        {
            const spinCycle = Math.round((this.frameCount*60/1000) / 2) % 4
            switch (spinCycle)
            {
                case 0:
                    // this.direction = "up"
                    return getImage("backWalking1", false);
                case 1:
                    // this.direction = "left"
                    return getImage("backWalking1", true);
                case 2:
                    // this.direction = "down"
                    return getImage("frontWalking1", true);
                case 3:
                    // this.direction = "right"
                    return getImage("frontWalking1", false);
            }
        }
        else if (this.isWalking)
        {
            const walkCycle = this.framesUntilNextStep > this.stepLength / 2;
            const walkState = walkCycle ? "Walking1" : "Walking2";
            switch (this.direction)
            {
                case "up":
                    return getImage("back" + walkState, false);
                case "left":
                    return getImage("back" + walkState, true);
                case "down":
                    return getImage("front" + walkState, true);
                case "right":
                    return getImage("front" + walkState, false);
            }
        }
        else
        {
            const isSitting = !!room.sit.find(s => s.x == this.logicalPositionX && s.y == this.logicalPositionY)
            const restState = isSitting ? "Sitting" : "Standing";

            switch (this.direction)
            {
                case "up":
                    return getImage("back" + restState, false);
                case "left":
                    return getImage("back" + restState, true);
                case "down":
                    return getImage("front" + restState, true);
                case "right":
                    return getImage("front" + restState, false);
            }
        }
    }
    
    // Computes this user's per-character deterministic blinking schedule from their id, the
    // first time it's needed (the id isn't known yet when the User is constructed).
    computeBlinkingPattern()
    {
        const id = this.id;
        // this needs an id in the uuid format
        const uniquePattern = id.slice(0, 8) + id.slice(9, 9+4) + id.slice(15, 15+3) + id.slice(20, 20+3) + id.slice(24, 24+12)

        this.blinkingPattern = uniquePattern.slice(2).split("").map(v => parseInt(v, 16)).map((value, index, values) =>
            (values[index] = (values[index-1] || 0) + (blinkOpenMinLength + Math.floor((value/16) * blinkOpenLengthVariation) + blinkClosedLength)))
        this.blinkingStartShift = (parseInt(uniquePattern.slice(0, 2), 16) / 256) * this.blinkingPattern[this.blinkingPattern.length-1]
    }

    animateBlinking(now)
    {
        if (!this.id) return false;
        if (!this.blinkingPattern) this.computeBlinkingPattern();

        const currentCycleTime = (now + this.blinkingStartShift) % this.blinkingPattern[this.blinkingPattern.length-1]
        const isBlinking = ((this.blinkingPattern.find(b => currentCycleTime < b) - currentCycleTime) - blinkClosedLength) <= 0
        if (this.isBlinking != isBlinking)
        {
            this.isBlinking = isBlinking
            return true
        }
        return false
    }

    resetBlinking()
    {
        this.isBlinking = false;
    }

    checkIfRedrawRequired()
    {
        if (this.isWalking) return true;
        if (this.isMoved)
        {
            this.isMoved = false;
            return true;
        }
    }

    makeSpin()
    {
        this.isSpinning = true;
    }
}
