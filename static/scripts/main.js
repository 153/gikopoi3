//localStorage.debug = '*'; // socket.io debug
localStorage.clear()

import Character from "./character.js";
import User from "./user.js";
import { loadImage, calculateRealCoordinates, globalScale, sleep, postJson } from "./utils.js";
import VideoChunkPlayer from "./video-chunk-player.js";
import { messages } from "./lang.js";

const i18n = new VueI18n({
    locale: 'ja',
    fallbackLocale: 'ja',
    messages,
})

const vueApp = new Vue({
    i18n,
    el: '#vue-app',
    data: {
        gikoCharacter: new Character("giko"),
        socket: null,
        users: {},
        currentRoom: null,
        myUserID: null,
        isWaitingForServerResponseOnMovement: false,
        justSpawnedToThisRoom: true,
        isLoadingRoom: false,
        requestedRoomChange: false,
        forceUserInstantMove: false,
        webcamStream: null,
        isInfoboxVisible: false,

        // Possibly redundant data:
        username: "",
        roomid: "admin_st",
        serverStats: {
            userCount: 0
        },
        loggedIn: false,
        wantToStream: false,
        iAmStreaming: false,
        someoneIsStreaming: false, // this won't be enough when we allow more than one stream slot in the same room
        roomAllowsStreaming: false,
        currentStreamerName: "",
        connectionLost: false,
        steppingOnPortalToNonAvailableRoom: false,
    },
    methods: {
        login: async function (ev)
        {
            ev.preventDefault()
            if (this.username === "")
                this.username = i18n.t('default_user_name')
            this.loggedIn = true
            await this.gikoCharacter.loadImages()
            this.registerKeybindings()
            await this.connectToServer(this.username)
            this.paint()
        },
        showWarningToast: function showWarningToast(text)
        {
            // TODO make this a nice, non-blocking message
            alert(text)
        },
        connectToServer: async function (username)
        {
            const loginResponse = await postJson("/login", { userName: username })

            this.myUserID = await loginResponse.json()

            this.socket = io()

            this.socket.on("connect", () => 
            {
                this.connectionLost = false;
                this.socket.emit("user-connect", this.myUserID);
                // TODO, give the server a way to reply "sorry, can't reconnect you"
                // so we can show a decent error message
            });

            this.socket.on("disconnect", () =>
            {
                document.getElementById("connection-lost-sound").play()
                this.connectionLost = true;
            })
            this.socket.on("server-cant-log-you-in", () =>
            {
                this.connectionLost = true;
            })

            this.socket.on("server-update-current-room-state", async (roomDto, usersDto) =>
            {
                this.isLoadingRoom = true

                this.currentRoom = roomDto
                this.roomid = this.currentRoom.id
                this.users = {}

                for (const u of usersDto)
                    this.addUser(u);

                loadImage(this.currentRoom.backgroundImageUrl).then(image => {
                    this.currentRoom.backgroundImage = image
                })
                for (const o of this.currentRoom.objects)
                {
                    loadImage("rooms/" + this.currentRoom.id + "/" + o.url).then(image =>
                    {
                        o.image = image
                        const { x, y } = calculateRealCoordinates(this.currentRoom, o.x, o.y);
                        o.physicalPositionX = x + (o.xOffset || 0)
                        o.physicalPositionY = y + (o.yOffset || 0)
                        console.log(o)
                    })
                }

                // Force update of user coordinates using the current room's logics (origin coordinates, etc)
                this.forcePhysicalPositionRefresh()

                document.getElementById("room-canvas").focus()
                this.justSpawnedToThisRoom = true
                this.isLoadingRoom = false
                this.requestedRoomChange = false

                // stream stuff
                this.roomAllowsStreaming = this.currentRoom.streams.length > 0

                console.log(this.currentRoom)

                // TODO THIS WON'T WORK FOR MULTIPLE STREAMS IN THE SAME ROOM!
                const activeStream = this.currentRoom.streams.find(s => s.isActive)

                if (activeStream)
                {
                    this.someoneIsStreaming = true
                    this.currentStreamerName = this.users[activeStream.userId].name
                }
            });

            this.socket.on("server-msg", (userName, msg) =>
            {
                const chatLog = document.getElementById("chatLog");
                if (userName != "SYSTEM")
                    document.getElementById("message-sound").play()

                chatLog.innerHTML += userName + ": " + msg + "<br/>";
                chatLog.scrollTop = chatLog.scrollHeight;
            });

            this.socket.on("server-stats", (serverStats) =>
            {
                this.serverStats = serverStats;
            });

            this.socket.on("server-move", (userId, x, y, direction, isInstant) =>
            {
                const user = this.users[userId];

                const oldX = user.logicalPositionX
                const oldY = user.logicalPositionY

                if (isInstant)
                    user.moveImmediatelyToPosition(this.currentRoom, x, y, direction)
                else
                    user.moveToPosition(x, y, direction)

                if (userId == this.myUserID)
                {
                    this.isWaitingForServerResponseOnMovement = false
                    if (oldX != x || oldY != y)
                        this.justSpawnedToThisRoom = false
                }
            });

            this.socket.on("server-reject-movement", () => this.isWaitingForServerResponseOnMovement = false)

            this.socket.on("server-user-joined-room", async (user) =>
            {
                document.getElementById("login-sound").play()
                this.addUser(user);
            });

            this.socket.on("server-user-left-room", (userId) =>
            {
                if (userId != this.myUserID)
                    delete this.users[userId];
            });

            const receivedVideoPlayer = new VideoChunkPlayer(document.getElementById("received-video-1"))

            this.socket.on("server-stream-data", (data) =>
            {
                receivedVideoPlayer.playChunk(data)
            })
            this.socket.on("server-not-ok-to-stream", (reason) =>
            {
                this.wantToStream = false
                this.showWarningToast(reason)
            })
            this.socket.on("server-ok-to-stream", () =>
            {
                this.wantToStream = false
                this.iAmStreaming = true
                this.someoneIsStreaming = true
                this.startStreaming()
            })
            this.socket.on("server-stream-started", (streamInfo) =>
            {
                this.someoneIsStreaming = true
                this.currentStreamerName = this.users[streamInfo.userId].name
            })
            this.socket.on("server-stream-stopped", (streamInfo) =>
            {
                const { streamSlotId } = streamInfo
                this.someoneIsStreaming = false
                receivedVideoPlayer.stop() // kinda useless, now that i'm using the someoneIsStreaming variable to drive the visibility of the video player
            })

            let version = Infinity

            const ping = async () =>
            {
                if (this.connectionLost)
                    return
                const response = await postJson("/ping/" + this.myUserID, { userId: this.myUserID })
                const { version: newVersion } = await response.json()
                // if (newVersion > version)
                // {
                //     // TODO refresh page while keeping username ,selected character and room
                //     showWarningToast("Sorry, a new version of gikopoi2 is ready, please refresh this page!")
                // }
                // else
                // {
                //     version = newVersion
                // }
            }

            setInterval(ping, 1000 * 60)
        },
        addUser: function (userDTO)
        {
            const newUser = new User(this.gikoCharacter, userDTO.name);
            newUser.moveImmediatelyToPosition(this.currentRoom, userDTO.position.x, userDTO.position.y, userDTO.direction);
            this.users[userDTO.id] = newUser;
        },
        drawImage: function (image, x, y, scale)
        {
            if (!image) return // image might be null when rendering a room that hasn't been fully loaded

            if (!scale)
                scale = 1

            const context = document.getElementById("room-canvas").getContext("2d");
            context.drawImage(image,
                x,
                y - image.height * globalScale * scale,
                image.width * globalScale * scale,
                image.height * globalScale * scale)
        },
        drawHorizontallyFlippedImage: function (image, x, y)
        {
            const context = document.getElementById("room-canvas").getContext("2d");
            context.scale(-1, 1)
            this.drawImage(image, - x - image.width / 2, y)
            context.setTransform(1, 0, 0, 1, 0, 0); // clear transformation
        },
        drawCenteredText: function (text, x, y)
        {
            const context = document.getElementById("room-canvas").getContext("2d");
            // const width = context.measureText(text).width
            context.font = "bold 13px Arial, Helvetica, sans-serif"
            context.textBaseline = "bottom"
            context.textAlign = "center"
            context.fillStyle = "blue"
            context.fillText(text, x, y)
        },
        // TODO: Refactor this entire function
        paint: function (timestamp)
        {
            if (this.forceUserInstantMove)
            {
                this.forcePhysicalPositionRefresh()
                this.forceUserInstantMove = false
            }

            const context = document.getElementById("room-canvas").getContext("2d");
            context.fillStyle = "#c0c0c0"
            context.fillRect(0, 0, 721, 511)

            if (this.currentRoom)
            {
                context.fillStyle = this.currentRoom.backgroundColor
                context.fillRect(0, 0, 721, 511)

                // draw background
                this.drawImage(this.currentRoom.backgroundImage, 0, 511, this.currentRoom.scale)

                const allObjects = this.currentRoom.objects.map(o => ({
                    o,
                    type: "room-object",
                    priority: o.x + 1 + (this.currentRoom.size.y - o.y)
                }))
                    .concat(Object.values(this.users).map(o => ({
                        o,
                        type: "user",
                        priority: o.logicalPositionX + 1 + (this.currentRoom.size.y - o.logicalPositionY)
                    })))
                    .sort((a, b) =>
                    {
                        if (a.priority < b.priority) return -1
                        if (a.priority > b.priority) return 1
                        return 0
                    })

                for (const o of allObjects)
                {
                    if (o.type == "room-object")
                    {
                        this.drawImage(o.o.image, o.o.physicalPositionX, o.o.physicalPositionY, this.currentRoom.scale * o.o.scale)
                    }
                    else // o.type == "user"
                    {
                        if (!this.isLoadingRoom)
                        {
                            // draw users only when the room is fully loaded, so that the "physical position" calculations
                            // are done with the correct room's data.
                            this.drawCenteredText(o.o.name.replace(/&gt;/g, ">").replace(/&lt;/g, "<"), o.o.currentPhysicalPositionX + 40, o.o.currentPhysicalPositionY - 95)

                            switch (o.o.direction)
                            {
                                case "up":
                                case "right":
                                    this.drawHorizontallyFlippedImage(o.o.getCurrentImage(this.currentRoom), o.o.currentPhysicalPositionX, o.o.currentPhysicalPositionY)
                                    break;
                                case "down":
                                case "left":
                                    this.drawImage(o.o.getCurrentImage(this.currentRoom), o.o.currentPhysicalPositionX, o.o.currentPhysicalPositionY)
                                    break;
                            }
                        }

                        o.o.spendTime(this.currentRoom)
                    }
                }
            }
            this.changeRoomIfSteppingOnDoor()

            requestAnimationFrame(this.paint)
        },
        changeRoomIfSteppingOnDoor: function ()
        {
            if (this.justSpawnedToThisRoom) return
            if (this.isWaitingForServerResponseOnMovement) return
            if (this.requestedRoomChange) return

            const currentUser = this.users[this.myUserID]

            if (currentUser.isWalking) return

            this.steppingOnPortalToNonAvailableRoom = false

            const door = this.currentRoom.doors.find(d =>
                d.x == currentUser.logicalPositionX &&
                d.y == currentUser.logicalPositionY)

            if (!door) return

            const { targetRoomId, targetX, targetY } = door

            if (targetRoomId == "NOT_READY_YET")
            {
                this.steppingOnPortalToNonAvailableRoom = true
                return
            }

            if (this.webcamStream)
                this.stopStreaming()

            this.requestedRoomChange = true
            this.socket.emit("user-change-room", { targetRoomId, targetX, targetY });
        },
        forcePhysicalPositionRefresh: function ()
        {
            for (const u of Object.values(this.users))
                u.moveImmediatelyToPosition(this.currentRoom, u.logicalPositionX, u.logicalPositionY, u.direction)
        },
        sendNewPositionToServer: function (direction)
        {
            if (this.isLoadingRoom || this.isWaitingForServerResponseOnMovement || this.users[this.myUserID].isWalking)
                return

            this.isWaitingForServerResponseOnMovement = true
            this.socket.emit("user-move", direction);
        },
        sendMessageToServer: function ()
        {
            const inputTextbox = document.getElementById("input-textbox")

            if (inputTextbox.value == "") return;
            this.socket.emit("user-msg", inputTextbox.value);
            inputTextbox.value = "";
        },
        registerKeybindings: function ()
        {
            const onKeyDown = (event) =>
            {
                switch (event.key)
                {
                    case "ArrowLeft": this.sendNewPositionToServer("left"); break;
                    case "ArrowRight": this.sendNewPositionToServer("right"); break;
                    case "ArrowUp": this.sendNewPositionToServer("up"); break;
                    case "ArrowDown": this.sendNewPositionToServer("down"); break;
                }
            }

            const canvas = document.getElementById("room-canvas")

            canvas.addEventListener("keydown", onKeyDown);

            const inputTextbox = document.getElementById("input-textbox")

            inputTextbox.addEventListener("keydown", (event) =>
            {
                if (event.key != "Enter") return
                this.sendMessageToServer()
            })

            document.getElementById("send-button").addEventListener("click", () => this.sendMessageToServer())
            document.getElementById("start-streaming-button").addEventListener("click", () => this.wantToStartStreaming())
            document.getElementById("stop-streaming-button").addEventListener("click", () => this.stopStreaming())

            document.getElementById("btn-move-left").addEventListener("click", () => this.sendNewPositionToServer("left"))
            document.getElementById("btn-move-up").addEventListener("click", () => this.sendNewPositionToServer("up"))
            document.getElementById("btn-move-down").addEventListener("click", () => this.sendNewPositionToServer("down"))
            document.getElementById("btn-move-right").addEventListener("click", () => this.sendNewPositionToServer("right"))
            
            window.addEventListener("focus", () =>
            {
                this.forceUserInstantMove = true
            });
        },
        toggleInfobox: function () { this.isInfoboxVisible ^= true; },
        switchLanguage: function () { i18n.locale = (i18n.locale == "ja" ? "en" : "ja") },
        
        // WebRTC
        wantToStartStreaming: async function ()
        {
            try
            {
                this.wantToStream = true
                this.webcamStream = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: { aspectRatio: { ideal: 1.333333 } }
                })

                this.socket.emit("user-want-to-stream", {
                    streamSlotId: 0,
                    withVideo: true,
                    withSound: true,
                })
            }
            catch (err)
            {
                this.showWarningToast("sorry, can't find a webcam")
                this.wantToStream = false
                this.webcamStream = false
            }
        },
        startStreaming: async function ()
        {
            document.getElementById("local-video").srcObject = this.webcamStream;
            document.getElementById("local-video").style.display = "block";

            const recorder = new RecordRTCPromisesHandler(this.webcamStream, { type: "video" })
            while (this.webcamStream)
            {
                recorder.startRecording()
                await sleep(1000);
                await recorder.stopRecording();
                let blob = await recorder.getBlob();
                if (this.webcamStream)
                {
                    this.socket.emit("user-stream-data", blob);
                }
            }
        },
        stopStreaming: function ()
        {
            this.iAmStreaming = false
            this.someoneIsStreaming = false
            for (const track of this.webcamStream.getTracks())
                track.stop()
            document.getElementById("local-video").srcObject = this.webcamStream = null;
            document.getElementById("local-video").style.display = "none"
            this.socket.emit("user-want-to-stop-stream")
        },
        logout: async function ()
        {
            await postJson("/logout", { userID: this.myUserID })
        }
    }
})
