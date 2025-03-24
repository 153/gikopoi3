// ==UserScript==
// @name     _experimental-playgikopoi
// @version  1
// @grant    none
// @run-at   document-end
// @match    https://play.gikopoi.com/*
// ==/UserScript==

document.querySelector('head').appendChild(document.createElement('script').appendChild(document.createTextNode('(' + async function inject() {

  document.currentScript?.remove();
  var GITHUB_PATH = 'https://raw.githubusercontent.com/iwamizawa-software/experimental-poipoi/main/';
  var consolelog = function () {
    var log = Array.from(arguments).map(err => err.stack ? err.message + '\n' + err.stack : err).join('\n');
    console.log(log);
    if (experimentalConfig?.debugWebhook?.startsWith('https://discord.com/api/webhooks/'))
      fetch(experimentalConfig.debugWebhook, { method : 'POST', headers : {'Content-Type' : 'application/json'}, body : JSON.stringify({content : log})});
  };
  window.onunhandledrejection = event => { consolelog(event.reason);};
  Object.defineProperty(console, 'error', {
    set: function () {},
    get: () => consolelog
  });
  var ready = async function (obj, key) {
    if (obj[key])
      return obj[key];
    var value, callback;
    Object.defineProperty(obj, key, {
      set: v => {
        if (value = v) {
          console.log(key + ' is ready');
          callback(value);
        }
      },
      get: () => value
    });
    return {then: c=>{callback = c}};
  };
  var sleep = t => ({then: f => setTimeout(f, t)});
  var getObjectAsync = async function (obj, key) {
    while (!obj[key])
      await sleep(1000);
    return obj[key];
  };
  var observedSelectors = [];
  var observer = new MutationObserver(mutations => {
    observedSelectors = observedSelectors.filter(obj => {
      var element = document.querySelector(obj.selector);
      if (element)
        obj.resolve(element);
      else
        return true;
    });
    if (!observedSelectors.length)
      observer.disconnect();
  });
  var querySelectorAsync = async selector => document.querySelector(selector) || new Promise(resolve => {
    if (!observedSelectors.length)
      observer.observe(document.body, {subtree: true, childList: true});
    observedSelectors.push({selector, resolve});
  });
  // PIP
  if (HTMLVideoElement.prototype.requestPictureInPicture) {
    querySelectorAsync('#video-streams').then(element => {
      var observer = new MutationObserver(() => {
        Array.from(element.querySelectorAll('.stream-buttons')).forEach(div => {
          var experimentalButtons = Array.from(div.querySelectorAll('.experimental-buttons'));
          if (div.querySelector('[id^=drop-stream-button]') && div.parentNode.querySelector('[id^=video-container]')?.style.display === '') {
            if (!experimentalButtons.length) {
              var pipButton = document.createElement('button');
              pipButton.className = 'experimental-buttons';
              pipButton.textContent = 'PIP';
              pipButton.onclick = () => {
                var video = div.parentNode.querySelector('[id^=received-video]');
                if (video) {
                  video.onpause = video.play;
                  video.requestPictureInPicture().catch(async err => {
                    if (err.name === 'NotSupportedError') {
                      if (navigator.userAgent?.includes('Android')) {
                        await asyncAlert(text('全画面表示になったら画面下から上にスワイプし、ホームボタンを押してください', 'Press home button after fullscreen'));
                        video.requestFullscreen();
                      } else {
                        experimentalConfig.hidePIP = experimentalConfig.hideWidgetButton = true;
                        modifyConfig(experimentalConfig, true);
                      }
                    }
                  });
                }
              }
              div.insertBefore(pipButton, div.firstChild);
            }
          } else {
            experimentalButtons.forEach(button => button.remove());
          }
        });
      });
      observer.observe(element, {subtree: true, childList: true});
    });
  }
  var abonQueue = [];
  var abon = async function (id) {
    abonQueue.push(id);
    if (abonQueue.length > 1)
      return;
    while (abonQueue.length) {
      (await getObjectAsync(vueApp, 'socket')).emit('user-block', abonQueue[0]);
      await sleep(100);
      abonQueue.shift();
    }
  };
  // ルーラリンク
  var roomNameToKey = {}, roomNameRegex = /0^/;
  var createRoomNameRegex = function () {
    Object.keys(vueApp._i18n.messages.en.room).forEach(key => {
      var roomName = vueApp._i18n.t('room.' + key, 'ja').split(' ');
      roomNameToKey[roomName = roomName[1] || roomName[0]] = key;
      var halfSize = roomName.replace(/[！-～]/g, s => String.fromCharCode(s.charCodeAt() - (0xFF01 - 0x21)));
      roomNameToKey[key] = roomNameToKey[halfSize] = roomNameToKey[halfSize.toLowerCase()] = roomNameToKey[roomName.toLowerCase()] = key;
    });
    roomNameToKey['開発前'] = 'admin_st';
    roomNameRegex = new RegExp('(^|じゃ|[ 　「])(' + Object.keys(roomNameToKey).sort((a, b) => b.length - a.length).join('|') + ')(で$|$|に?(?:来|集|きて|こい|行|[居い][るた])|にて|[ 　」])', 'g');
  };
  var replaceRulaLink = html => html.replace(roomNameRegex, (s, s1, s2, s3) => `${s1}<a href="javascript:void%20vueApp.changeRoom('${roomNameToKey[s2]}')">${s2}</a>${s3}`);

  await ready(window, 'vueApp');
  await ready(window.vueApp, '_isMounted');
  createRoomNameRegex();
  var characterIconData = {"giko":{"type":".svg","x":-50,"y":24,"width":190},"naito":{"type":".svg","x":-48,"y":13,"width":190},"shii":{"type":".svg","x":-50,"y":24,"width":190},"hikki":{"type":".svg","x":-44,"y":-12,"width":190},"tinpopo":{"type":".svg","x":-50,"y":26,"width":190},"shobon":{"type":".svg","x":-50,"y":-20,"width":190},"nida":{"type":".svg","x":-50,"y":27,"width":190},"salmon":{"type":".svg","x":17,"y":-54,"width":190},"giko_hat":{"type":".svg","x":-50,"y":10,"width":190},"shii_hat":{"type":".svg","x":-50,"y":10,"width":190},"shobon_hat":{"type":".svg","x":-41,"y":-20,"width":190},"furoshiki":{"type":".svg","x":-50,"y":24,"width":190},"golden_furoshiki":{"type":".svg","x":-50,"y":24,"width":190},"furoshiki_shii":{"type":".svg","x":-50,"y":24,"width":190},"sakura_furoshiki_shii":{"type":".svg","x":-50,"y":24,"width":190},"furoshiki_shobon":{"type":".svg","x":-41,"y":-20,"width":190},"naitoapple":{"type":".svg","x":-50,"y":10,"width":190},"shii_pianica":{"type":".svg","x":-46,"y":24,"width":190},"shii_uniform":{"type":".svg","x":-50,"y":24,"width":190},"hungry_giko":{"type":".svg","x":-45,"y":15,"width":190},"rikishi_naito":{"type":".svg","x":-30,"y":-18,"width":170},"hentai_giko":{"type":".svg","x":-45,"y":33,"width":170},"dark_naito_walking":{"type":".svg","x":-48,"y":13,"width":190},"takenoko":{"type":".svg","x":0,"y":0,"width":100},"kaminarisama_naito":{"type":".svg","x":-48,"y":13,"width":190},"panda_naito":{"type":".svg","x":-48,"y":13,"width":190},"wild_panda_naito":{"type":".svg","x":-48,"y":13,"width":190},"funkynaito":{"type":".png","x":-48,"y":13,"width":190},"molgiko":{"type":".png","x":-80,"y":-70,"width":190},"tikan_giko":{"type":".svg","x":-50,"y":24,"width":190},"hotsuma_giko":{"type":".svg","x":-50,"y":24,"width":190},"dokuo":{"type":".svg","x":-58,"y":-33,"width":190},"onigiri":{"type":".svg","x":-38,"y":20,"width":170},"tabako_dokuo":{"type":".svg","x":-58,"y":-33,"width":190},"himawari":{"type":".svg","x":-47,"y":0,"width":190},"zonu":{"type":".svg","x":-70,"y":-46,"width":190},"george":{"type":".svg","x":-48,"y":13,"width":190},"chotto_toorimasu_yo":{"type":".svg","x":-54,"y":-34,"width":190},"tokita_naito":{"type":".svg","x":-40,"y":4,"width":170},"pumpkinhead":{"type":".svg","x":-74,"y":34,"width":230},"naito_yurei":{"type":".svg","x":-48,"y":13,"width":190},"shiinigami":{"type":".svg","x":-100,"y":2,"width":280},"youkanman":{"type":".svg","x":-46,"y":-50,"width":180},"baba_shobon":{"type":".svg","x":-50,"y":-20,"width":190},"uzukumari":{"type":".svg","x":-98,"y":-69,"width":190},"giko_basketball":{"type":".svg","x":-50,"y":24,"width":190},"giko_shamisen":{"type":".svg","x":-50,"y":24,"width":190},"mikan_naito":{"type":".svg","x":-48,"y":13,"width":190},"shii_syakuhati":{"type":".svg","x":-50,"y":24,"width":190},"taiko_naito":{"type":".svg","x":-48,"y":13,"width":190},"mitsugiko":{"type":".svg","x":-90,"y":-50,"width":190},"giko_cop":{"type":".png","x":-50,"y":24,"width":190},"giko_batman":{"type":".png","x":-50,"y":24,"width":190},"giko_hungover":{"type":".png","x":-50,"y":24,"width":190},"giko_islam":{"type":".png","x":-50,"y":24,"width":190},"shii_islam":{"type":".png","x":-50,"y":24,"width":190},"giko_shroom":{"type":".png","x":-55,"y":24,"width":190},"bif_alien":{"type":".png","x":-54,"y":-34,"width":190},"bif_wizard":{"type":".png","x":-54,"y":-34,"width":190},"winter_shii":{"type":".svg","x":-50,"y":0,"width":190},"longcat":{"type":".png","x":-50,"y":-30,"width":190},"hotaru":{"type":".png","x":-58,"y":0,"width":190},"mona":{"type":".png","x":-50,"y":33,"width":190},"foe":{"type":".svg","x":-50,"y":-50,"width":190},"kimono_giko":{"type":".svg","x":-50,"y":24,"width":190},"kimono_shii":{"type":".svg","x":-50,"y":24,"width":190},"shar_naito":{"type":".svg","x":-48,"y":13,"width":190},"ika":{"type":".svg","x":0,"y":18,"width":100},"giko_gold":{"type":".png","x":-50,"y":24,"width":190},"naito_npc":{"type":".png","x":-50,"y":0,"width":190},"habbo":{"type":".png","x":-40,"y":-40,"width":190},"blankchan":{"type":".png","x":-50,"y":24,"width":190},"goatse":{"type":".png","x":-50,"y":24,"width":190},"onigiri_alt":{"type":".svg","x":-38,"y":20,"width":170},"shobon_alt":{"type":".svg","x":-50,"y":-20,"width":190},"himawari_alt":{"type":".svg","x":-47,"y":0,"width":190},"george_alt":{"type":".svg","x":-48,"y":13,"width":190},"furoshiki_alt":{"type":".svg","x":-50,"y":24,"width":190},"furoshiki_shobon_alt":{"type":".svg","x":-41,"y":-20,"width":190},"tokita_naito_alt":{"type":".svg","x":-40,"y":4,"width":170},"youkanman_alt":{"type":".svg","x":-46,"y":-50,"width":180},"baba_shobon_alt":{"type":".svg","x":-50,"y":-20,"width":190},"takenoko_alt":{"type":".svg","x":0,"y":0,"width":100},"shobon_raincoat":{"type":".svg","x":-41,"y":-20,"width":190},"shii_raincoat":{"type":".svg","x":-46,"y":24,"width":190}};
  querySelectorAsync('#login-button').then(loginButton => {
    var select = document.createElement('select');
    Object.keys(vueApp._i18n.messages.en.room).map(key => ({
      value: key,
      text: vueApp._i18n.t('room.' + key, 'ja') + ' - ' + vueApp._i18n.messages.en.room[key],
      reading: vueApp._i18n.t('room.' + key, 'ja', {reading: true})
    })).sort((a, b) => a.reading > b.reading ? 1 : -1).forEach(({value, text}) => {
      var option = select.appendChild(document.createElement('option'));
      option.value = value;
      option.text = text;
    });
    select.value = (new URL(location.href)).searchParams.get('roomid') || 'bar';
    document.getElementById('area-selection').onchange = select.onchange = () => {
      history.replaceState(null, '', '?areaid=' + vueApp.areaId + '&roomid=' + select.value);
    };
    select.style.display = 'block';
    loginButton.before(select);
  });

//  Array.from(document.querySelectorAll('#character-selection label')).forEach(label => label.setAttribute('style', 'font-size:0'));

  if (window.iPhoneBookmarklet) {
    var audio = new Audio();
    audio.src = 'data:audio/mpeg;base64,/+MYxAAAAANIAAAAAExBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxDsAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxHYAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxLEAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVMQU1FMy4xMDBVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV/+MYxMQAAANIAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
    audio.loop = audio.controls = true;
    audio.setAttribute('style', 'position:fixed;bottom:0;right:0');
    document.body.append(audio);
    document.querySelector('head').appendChild(document.createElement('style')).textContent = '#main-section{padding-bottom:20px}';
  }

  if (localStorage.getItem('isInfoboxVisible') === null)
    vueApp.toggleInfobox();

  var text = (_gen, _for) => vueApp.areaId === 'gen' ? _gen : _for;
  var systemMessage = msg => vueApp.writeMessageToLog('SYSTEM', msg, null);
  var sendMessage = function (msg) {
    vueApp.socket.emit('user-msg', msg);
    if (experimentalConfig.clearBubble)
      vueApp.socket.emit('user-msg', '');
  };
  var asyncAlert = text => new Promise(resolve => vueApp.openDialog(text, '', ['OK'], 0, resolve));
  var createButtonContainer = function () {
    var fakePopup = document.createElement('div');
    fakePopup.className = 'popup';
    fakePopup.style.all = 'unset';
    return fakePopup;
  };
  var toIHash = id => '◇' + btoa(id.replace(/-/g, '').replace(/../g, function (s) {return String.fromCharCode('0x' + s)})).slice(0, 6);
  var addIHash = (name, id) => experimentalConfig.numbering === 2 ? name.replace(/(◆.+)?$/, toIHash(id) + '$1') : name;
  var removeSpace = str => str.replace(/[\u{0000}\u{0009}-\u{000D}\u{0020}\u{0085}\u{00A0}\u{00AD}\u{034F}\u{061C}\u{070F}\u{115F}\u{1160}\u{1680}\u{17B4}\u{17B5}\u{180E}\u{2000}-\u{200F}\u{2028}-\u{202F}\u{205F}-\u{206F}\u{2800}\u{3000}\u{3164}\u{FEFF}\u{FFA0}\u{110B1}\u{1BCA0}-\u{1BCA3}\u{1D159}\u{1D173}-\u{1D17A}\u{E0000}-\u{E0FFF}]/gu, '');
  var match = (str, cond, removeWorkaround) => {
    if (!cond || cond.constructor !== Array || typeof str !== 'string')
      return false;
    var targets = [];
    var nospace = removeSpace(str);
    if (nospace !== str)
      targets.push(nospace);
    if (removeWorkaround) {
      var removed = nospace.split('').filter(c => !removeWorkaround.includes(c)).join('');
      if (removed !== nospace)
        targets.push(removed);
    }
    targets.push(str);
    return cond.some(c => {
      if (!c)
        return false;
      if (/^\/.+\/([dgimsuy]*)$/i.test(c)) {
        var regex = new RegExp(c.slice(1, -(1 + RegExp.$1.length)), RegExp.$1);
        return targets.some(target => regex.test(target));
      } else {
        return targets.some(target => target.includes(c));
      }
    });
  };
  // キャラ付ログ
  var characterLogCSS = document.createElement('style');
  characterLogCSS.textContent = ':root{--characterlog-size:25px}.message:not(.system-message):before{content: "";width:var(--characterlog-size);height:var(--characterlog-size);display:inline-block;background-size:contain;background-repeat:no-repeat;vertical-align:bottom;margin-right:5px}';
  document.querySelector('head').append(characterLogCSS);
  var loadCharacterIcon = function (name, notAlt) {
    var data = characterIconData[name] || (characterIconData[name] = {type: '.svg', x: -50, y: 24, width: 190});
    if (data.loaded)
      return;
    data.loaded = true;
    var img = new Image();
    img.src = '/characters/' + name.replace(/_alt$/, '') + '/front-standing' + (!notAlt && name.endsWith('_alt') ? '-alt' : '') + data.type;
    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = canvas.height = 120;
      var ctx = canvas.getContext('2d');
      var ratio = data.width * 1.2 / this.width;
      ctx.drawImage(this, data.x * 1.2, data.y * 1.2, this.width * ratio, this.height * ratio);
      characterLogCSS.textContent += `[data-character-id=${name}]:before{background-image:url(${canvas.toDataURL()});}`;
      logWindow?.onstorage?.();
    };
    if (!notAlt)
      img.onerror = function () {
        data.loaded = false;
        loadCharacterIcon(name, true);
      };
  };
  // userscript CSS
  document.querySelector('head').appendChild(document.createElement('style')).textContent = '#chat-log-label{display:none}#chat-log-container{flex-direction:column}#enableSpeech:checked+button{background-color:#9f6161}.inactive-message:before{opacity:0.5}';
  // config
  var userCSS = document.querySelector('head').appendChild(document.createElement('style')), mentionSound, experimentalConfig;
  var vnCSS = document.querySelector('head').appendChild(document.createElement('style'));
  var apply = function () {
    userCSS.textContent = experimentalConfig.userCSS || '';
    vnCSS.textContent = (experimentalConfig.vtuberNiconico & 1 ? '.vtuber-character{display:none}' : '') +
                        (experimentalConfig.vtuberNiconico & 2 ? '.nico-nico-messages-container{display:none}' : '') +
                        (experimentalConfig.hideVoiceButton ? '#voiceButton{display:none}' : '') +
                        (experimentalConfig.hideWidgetButton || navigator.userAgent?.includes('Android') ? '#widgetButton{display:none}' : '') +
                        (experimentalConfig.hideLogWindowButton ? '#logWindowButton{display:none}' : '') +
                        (experimentalConfig.hideClearButton ? '#clearButton{display:none}' : '') +
                        (experimentalConfig.hideSaveButton ? '#saveButton{display:none}' : '') +
                        (experimentalConfig.hideConfigButton ? '#configButton{display:none}' : '') +
                        (experimentalConfig.hidePIP ? '.experimental-buttons{display:none}' : '') +
                        (experimentalConfig.brightness ? '#room-canvas{filter: brightness(' + experimentalConfig.brightness + ')}' : '') +
                        (experimentalConfig.showColorPicker ? '' : '#colorPicker{visibility:hidden;width:0;padding:0;border:0}') +
                        (experimentalConfig.outdoor ? 'h1,#character-selection,#canvas-container,.changelog{display:none}' : '');
    if (experimentalConfig.iconSize)
      characterLogCSS.textContent = characterLogCSS.textContent.replace(/--characterlog-size:\d+px/, '--characterlog-size:' + experimentalConfig.iconSize + 'px');
    characterLogCSS.media = experimentalConfig.displayIcon ? '' : 'a';
    logWindow?.onstorage?.();
    if (experimentalConfig.hasOwnProperty('roomColor') && vueApp.currentRoom) {
      vueApp.currentRoom.backgroundColor = experimentalConfig.roomColor;
      vueApp.isRedrawRequired = true;
    }
    if (mentionSound = experimentalConfig.mentionSound && new Audio(experimentalConfig.mentionSound))
      mentionSound.volume = experimentalConfig.mentionVolume || 1;
    if (experimentalConfig.stopBack)
      history.pushState(null, null);
    widget?.paint();
  };
  window.modifyConfig = function (obj, mainWindow) {
    var json = JSON.stringify(obj);
    if (experimentalConfig.useCookie) {
      document.cookie = 'experimentalConfig=' + encodeURIComponent(json) + '; expires=Tue, 31-Dec-2037 00:00:00 GMT;';
    } else {
      document.cookie = 'experimentalConfig=; expires=Fri, 31-Dec-1999 23:59:59 GMT;';
      localStorage.setItem('experimentalConfig', json);
    }
    experimentalConfig = JSON.parse(json);
    if (mainWindow)
      configWindow?.load?.(experimentalConfig);
    apply();
  };
  var configText = document.cookie.match(/experimentalConfig=([^;]+)/);
  experimentalConfig = Object.assign(
    await fetch(GITHUB_PATH + 'config.json?t=' + (new Date).getTime()).then(res => res.json()).catch(err => {console.log(err); return ({})}),
      Function('return (' + (configText?.[1] ? decodeURIComponent(configText[1]) : localStorage.getItem('experimentalConfig')) + ')')()
  );
// override default config
    experimentalConfig.clearBubble = false;
    experimentalConfig.numbering = 0;
    experimentalConfig.hideVoiceButton = true;
    experimentalConfig.hideWidgetButton = true;
    experimentalConfig.hideLogWindowButton = true;
    experimentalConfig.hideClearButton = true;
    experimentalConfig.hideSaveButton = true;
    experimentalConfig.autoComplete = true;
//    experimentalConfig.takeStreamImmediately = true;
//    experimentalConfig.hideConfigButton = true;
    experimentalConfig.hidePIP = true;
  ['ttsAllowList', 'ttsDenyList', 'autoBlock', 'autoIgnore', 'wordFilter'].forEach(key => {
    if (experimentalConfig[key] && experimentalConfig[key].constructor !== Array)
      experimentalConfig[key] = experimentalConfig[key].split?.(',') || [experimentalConfig[key] + ''];
  });
  apply();
  var isAnon = name => (new RegExp('^(?:' + vueApp.toDisplayName('') + '\\d*)?$')).test(name);
  var isMention = msg => vueApp.mentionSoundFunction?.(msg);
  // widget
  var createSpan = (className, textContent) => Object.assign(document.createElement('span'), {className, textContent});
  var widget = {
    streaming: function (id, name) {
      if (!this.log || vueApp.ignoredUserIds.has(id) || !experimentalConfig.widgetStreaming)
        return;
      this.addLog(id, name, 'streaming' + (isAnon(name) ? ' anon' : ''), text('が配信開始', ' has started streaming.'));
    },
    access: function (id, name, entering) {
      if (!this.log || vueApp.ignoredUserIds.has(id))
        return;
      var anon = isAnon(name);
      if (!((experimentalConfig.widgetAccess && !anon) || (experimentalConfig.widgetAnonAccess && anon)))
        return;
      this.addLog(id, name, 'access' + (anon ? ' anon' : ''), text('が' + (entering ? '入室' : '退室'), ' has ' + (entering ? 'entered' : 'exited') + ' the room.'));
    },
    comment: function (id, name, comment) {
      if (!this.log || vueApp.ignoredUserIds.has(id) || !comment)
        return;
      var anon = isAnon(name);
      if (!((experimentalConfig.widgetComment && !anon) || (experimentalConfig.widgetAnonComment && anon) || (experimentalConfig.widgetMention && isMention(comment))))
        return;
      this.addLog(id, name, 'comment' + (anon ? ' anon' : ''), comment);
    },
    addLog: function (id, name, className, content) {
      var p = this.log.appendChild(document.createElement('p'));
      while (this.log.children.length > experimentalConfig.widgetLength)
        this.log.firstElementChild.remove();
      p.className = className;
      var splitedName = vueApp.toDisplayName(name + '').split('◆');
      p.append(createSpan('name', splitedName[0]), createSpan('ihash', toIHash(id + '')));
      if (splitedName[1])
        p.append(createSpan('trip', '◆' + splitedName[1]));
      if (className.includes('comment'))
        p.append(createSpan('separator', ': '));
      p.append(createSpan('content', content + ''));
      this.paint();
    },
    init: function () {
      var div = this.container = document.createElement('div');
      div.setAttribute('style', 'display:flex;order:5;visibility:hidden;display:none');
      var video = this.video = document.createElement('video');
      video.style.border = '1px solid #000';
      video.style.height = '100px';
      video.playsInline = video.muted = video.autoplay = true;
      var canvas = this.canvas = document.createElement('canvas');
      canvas.setAttribute('style', 'position:fixed;top:0;right:0;width:1px;height:1px');
      document.body.append(canvas);
      var ctx = this.ctx = canvas.getContext('2d');
      canvas.width = video.width = experimentalConfig.widgetWidth;
      canvas.height = video.height = experimentalConfig.widgetHeight;
      video.style.width = canvas.width / canvas.height * 100 + 'px';
      video.srcObject = canvas.captureStream(experimentalConfig.widgetFps);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      (async () => {
        for (var i = 0; i < 6 && !this.log; i++) {
          await sleep(500);
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
      })();
      video.onpause = video.play;
      video.onenterpictureinpicture = () => {
        div.style.width = div.style.height = '1px';
        div.style.overflow = 'hidden';
      };
      var closeButton = document.createElement('button');
      closeButton.textContent = '×';
      video.onleavepictureinpicture = closeButton.onclick = () => this.close();
      div.append(video, '← ' + text('右クリックしてピクチャーインピクチャーを選択', 'Right-click and Select Picture-in-Picture'), closeButton);
      document.getElementById('chat-log-container').after(div);
    },
    open: function () {
      if (!this.log)
        this.container.style.display = this.container.style.visibility = '';
      this.log = document.createElement('div');
      this.log.className = 'log';
      this.paint();
      this.video.requestPictureInPicture?.().catch(async err => {
        if (err.name === 'NotSupportedError') {
          if (navigator.userAgent?.includes('Android')) {
            await asyncAlert(text('全画面表示になったら画面下から上にスワイプし、ホームボタンを押してください', 'Press home button after fullscreen'));
            this.video.requestFullscreen();
          } else {
            experimentalConfig.hidePIP = experimentalConfig.hideWidgetButton = true;
            modifyConfig(experimentalConfig, true);
            this.close();
          }
        }
      });
    },
    close: function () {
      this.log = null;
      if (this.video === document.pictureInPictureElement)
        document.exitPictureInPicture?.();
      this.container.style.visibility = 'hidden';
      this.video.remove();
      this.container.prepend(this.video);
    },
    paint: async function (retry) {
      if (!this.log || (retry && !this.img.complete))
        return;
      if (retry > 4) {
        asyncAlert('再描画エラー　報告お願いします　必要な情報はOSの種類（Windows, Mac, iPhoneとか）ブラウザの種類（Chrome, Edge, Firefoxとか）', 'Repaint error. Please tell me about OS and Browser.');
        return;
      }
      if (!retry) {
        var img = this.img = new Image();
        var width = this.canvas.width = this.video.width = experimentalConfig.widgetWidth;
        var height = this.canvas.height = this.video.height = experimentalConfig.widgetHeight;
        this.video.style.width = width / height * 100 + 'px';
        img.src = 'data:image/svg+xml,' + encodeURIComponent(
`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
<foreignObject width="${width}" height="${height}" requiredExtensions="http://www.w3.org/1999/xhtml">
<style>${experimentalConfig.widgetCSS}</style>
<body xmlns="http://www.w3.org/1999/xhtml">${(new XMLSerializer()).serializeToString(this.log)}</body></foreignObject></svg>`);
        await img.decode();
      }
      this.ctx.drawImage(this.img, 0, 0, width, height);
      this.video.srcObject.getTracks?.()?.[0]?.requestFrame?.();
      await sleep(500);
      var frames = this.video.getVideoPlaybackQuality?.()?.droppedVideoFrames || 0;
      if (this.lastDroppedVideoFrames < frames)
        this.paint((retry || 0) + 1);
      this.lastDroppedVideoFrames = frames;
    },
    lastDroppedVideoFrames: 0
  };
  console.log('injected');
  // 入室時
  var updateRoomState = vueApp.updateRoomState;
  var lastRoomName, henshined, bubbleChanged;
  vueApp.updateRoomState = async function (dto) {
    // 部屋背景色変更
    if (experimentalConfig.roomColor)
      dto.currentRoom.backgroundColor = experimentalConfig.roomColor;
    // 部屋名をログ出力
    var roomName = vueApp._i18n.t('room.' + dto?.currentRoom?.id);
    var numberOfUsers = (dto.connectedUsers.some(u => u.id === vueApp.myUserID) ? 0 : 1) + dto.connectedUsers.length;
    if (experimentalConfig.logRoomName && lastRoomName !== roomName)
      systemMessage(text(`${roomName}に入室 (${numberOfUsers}人)`, `Entered to  ${roomName} (${numberOfUsers} users)`));
    lastRoomName = roomName;
    // 入室時吹き出しを読み上げない
    var enableTTS = vueApp.enableTextToSpeech;
    vueApp.enableTextToSpeech = false;
    var r = await updateRoomState.call(this, dto);
    vueApp.enableTextToSpeech = enableTTS;
    // 開発前の吹き出しを消す
    if (experimentalConfig.clearBubbleAtLogin === 1 ? dto?.currentRoom?.id === 'admin_st' : experimentalConfig.clearBubbleAtLogin) {
      Object.values(vueApp.users).forEach(u => u.message = '');
      vueApp.resetBubbleImages();
    }
    // デフォルトで受信状態にする
    if (experimentalConfig.takeStreamImmediately)
      for (var i = 0; i < dto.streams.length; i++)
        vueApp.wantToTakeStream(i);
    // ログ窓タイトル変更
    if (logWindow && !logWindow.closed)
      logWindow.onresize();
    // デフォで変身
    if (experimentalConfig.henshin && !henshined) {
      getObjectAsync(vueApp, 'socket').then(socket => socket.emit('user-msg', '#henshin'));
      henshined = true;
    }
    // デフォで吹き出し位置変更
    if (experimentalConfig.bubblePosition && !bubbleChanged) {
      getObjectAsync(vueApp, 'socket').then(socket => socket.emit('user-bubble-position', ['up', 'right',  'left',  'down'][experimentalConfig.bubblePosition]));
      bubbleChanged = true;
    }
    // グラフ
    graph = new Graph(dto);
    return r;
  };
  // 無視解除時
  var unignoreUser = vueApp.unignoreUser;
  vueApp.unignoreUser = function (userId) {
    if (experimentalConfig.ignoreAll === 1) {
      var trip = vueApp.users?.[userId]?.name?.match(/◆.{10}/)?.[0];
      if (trip) {
        if (!experimentalConfig.unignoreList)
          experimentalConfig.unignoreList = [];
        if (!experimentalConfig.unignoreList.some(name => trip.includes(name))) {
          experimentalConfig.unignoreList.push(trip);
          modifyConfig(experimentalConfig, true);
        }
      }
    }
    return unignoreUser.apply(this, arguments);
  };
  // ユーザー追加時
  var addUser = vueApp.addUser;
  vueApp.addUser = function (userDTO) {
    // 偽ナンバリング
    if (match(userDTO.name, ['/' + vueApp.toDisplayName('') + '\\d+/']))
      userDTO.name = '(' + userDTO.name + ')';
    // 偽トリップ
    userDTO.name = userDTO.name?.replace(/◇|◊|🔶|🔷|🔸|🔹/g, 'O');
    // 名無しナンバリング
    if (experimentalConfig.numbering && typeof userDTO.id === 'string') {
      userDTO.name = vueApp.toDisplayName(userDTO.name);
      if (experimentalConfig.numbering === 1 && userDTO.name === vueApp.toDisplayName(''))
        userDTO.name += parseInt(userDTO.id.slice(-3), 16);
    }
    // 偽SYSTEM
    if (match(userDTO.name, ['' + /[SＳ][YＹ][SＳ][TＴ][EＥ][MＭ]/]))
      userDTO.name += '(偽)';
    // 自動あぼーん
    if (
      userDTO.id !== vueApp.myUserID && vueApp.socket &&
      (
        match(userDTO.name, experimentalConfig.autoBlock, experimentalConfig.filteringHelper) ||
        (experimentalConfig.ignoreAll === 2 && !match(userDTO.name, experimentalConfig.unignoreList))
      )
    ) {
        vueApp.ignoreUser(userDTO.id);
        vueApp.socket.emit('user-block', userDTO.id);
        userDTO.aboned = true;
        if (!experimentalConfig.withoutBlockMsg)
          systemMessage(userDTO.name + text('を自動相互あぼーんした', ' has been blocked automatically'));
    }
    // 自動一方あぼーん
    if (
      userDTO.id !== vueApp.myUserID &&
      (
        match(userDTO.name, experimentalConfig.autoIgnore, experimentalConfig.filteringHelper) ||
        (experimentalConfig.ignoreAll === 1 && !match(userDTO.name, experimentalConfig.unignoreList))
      )
    ) {
      vueApp.ignoreUser(userDTO.id);
      userDTO.aboned = true;
    }
    // 吹き出しNGワード
    if (match(userDTO.lastRoomMessage, experimentalConfig.bubbleFilter))
      queueMicrotask(() => {if (vueApp.users[userDTO.id]) vueApp.users[userDTO.id].message = '';});
    return addUser.call(this, userDTO);
  };
  // 名前補完
  var autoComplete = {};
  autoComplete.onkeydown = function (event) {
    if (experimentalConfig.autoComplete && event.target.id === 'input-textbox') {
      if (event.key === 'Tab') {
        event.preventDefault();
        if (!autoComplete.candidates) {
          var search = event.target.value.match(/[^ 　@＠>＞]*$/)?.[0] || '', s = search.toLowerCase();
          autoComplete.body = event.target.value.slice(0, event.target.value.length - search.length);
          autoComplete.candidates = Array.from(new Set(Object.values(vueApp.users)
            .filter(u => {
              if (u.id === vueApp.myUserID)
                return false;
              var n = ('' + u.name).normalize('NFKD').replace(/[\u0300-\u036f]+/g, '').normalize().toLowerCase();
              delete u.tripComplete;
              return (n[0] !== '◆' && !n.indexOf(s)) || (u.tripComplete = n.indexOf('◆' + s) !== -1);
            })
            .sort((a, b) => (a.lastCommentTime || 0) < (b.lastCommentTime || 0) ? 1 : -1)
            .map(u => u.tripComplete ? u.name : u.name.split('◆')[0])
          ));
          autoComplete.candidates.push(search);
          autoComplete.index = 0;
        }
        event.target.value = autoComplete.body + autoComplete.candidates[autoComplete.index];
        autoComplete.index = (autoComplete.index + 1) % autoComplete.candidates.length;
      } else {
        delete autoComplete.candidates;
      }
    }
  };
  // ブラウザバックを止める
  addEventListener('popstate', () => {
    if (experimentalConfig.stopBack)
      history.go(1);
  });
  document.addEventListener('keydown', event => {
    if (!event.key)
      return;
    // Ctrl+Delキーで吹き出し消す
    if (event.ctrlKey && event.key === 'Delete') {
      for (var id in vueApp.users)
        vueApp.users[id].message = '';
      vueApp.resetBubbleImages();
    // 動画回転
    } else if (event.altKey && /^[1-9]$/.test(event.key)) {
      var video = document.getElementById('received-video-' + (event.key - 1));
      if (video)
        video.style.transform = 'rotate(' + (video.dataset.rotate = (+(video.dataset.rotate || 0) + 90) % 360) + 'deg)';
    // 経路移動中止
    } else if (event.key === 'Escape' || !event.key.indexOf('Arrow')) {
      vueApp.route.clear();
    }
    // 名前補完
    autoComplete.onkeydown(event);
  });
  // 新しいメッセージボタン
  var chatLog, isAtBottom = () => (chatLog.scrollHeight - chatLog.clientHeight) - chatLog.scrollTop < 5;
  var newMessageButtonContainer = document.createElement('div');
  newMessageButtonContainer.id = 'new-message-button-container';
  newMessageButtonContainer.setAttribute('style', 'height:0;position:relative;top:-40px;text-align:center;width:100%;user-select:none;pointer-events:none');
  var newMessageButton = newMessageButtonContainer.appendChild(createButtonContainer()).appendChild(document.createElement('button'));
  newMessageButton.onclick = () => {
    chatLog.scrollTop = chatLog.scrollHeight - chatLog.clientHeight;
  };
  newMessageButton.style.pointerEvents = 'auto';
  var displayUserMessage = vueApp.displayUserMessage;
  vueApp.displayUserMessage = async function (user, msg) {
    // 配信遠隔停止
    if (vueApp.streamSlotIdInWhichIWantToStream !== null && /^(?:配信停止|stop streaming)$/i.test(msg) && match(vueApp.users[user?.id]?.name, experimentalConfig.streamStopper))
      vueApp.stopStreaming();
    // NGワード
    if (user?.id && match(msg, experimentalConfig.wordFilter, experimentalConfig.filteringHelper)) {
      if (user.id !== vueApp.myUserID && experimentalConfig.wordBlock) {
        if (experimentalConfig.wordBlock === 3)
          vueApp.ignoreUser(user.id);
        else
          (await getObjectAsync(vueApp, 'socket')).emit('user-block', user.id);
        if (!experimentalConfig.withoutBlockMsg)
          systemMessage(user.name + text('をNGワードあぼーんした', ' has been blocked by filtering'));
      }
      if (experimentalConfig.wordBlock !== 2)
        return;
    }
    // 吹き出しNGワード
    if (match(msg, experimentalConfig.bubbleFilter))
      queueMicrotask(() => {if (user) user.message = '';});
    // 読み上げ許可拒否リスト
    if (
      vueApp.enableTextToSpeech && 
      (
        (experimentalConfig.ttsAllowList?.length && !match(user?.name, experimentalConfig.ttsAllowList)) ||
        match(user?.name, experimentalConfig.ttsDenyList)
      )
    ) {
      vueApp.enableTextToSpeech = false;
      var promise = displayUserMessage.apply(this, arguments);
      vueApp.enableTextToSpeech = true;
      return promise;
    }
    return displayUserMessage.apply(this, arguments);
  };
  var writeMessageToLog = vueApp.writeMessageToLog;
  vueApp.writeMessageToLog = async function (userName, msg, userId) {
    // 新しいメッセージボタン
    if (!chatLog) {
      chatLog = document.getElementById('chatLog');
      chatLog.addEventListener('scroll', () => {
        if (isAtBottom())
          newMessageButtonContainer.style.display = 'none';
      });
    }
    if (!chatLog.parentNode.contains(newMessageButtonContainer)) {
      newMessageButton.textContent = text('↓ 新しいメッセージ', '↓ New Messages');
      newMessageButtonContainer.style.display = 'none';
      chatLog.parentNode.appendChild(newMessageButtonContainer);
    }
    if (!isAtBottom())
      newMessageButtonContainer.style.display = '';
    return writeMessageToLog.apply(this, arguments);
  };
  // Enter1回で吹き出しを消す
  var handleMessageInputKeypress = vueApp.handleMessageInputKeypress;
  vueApp.handleMessageInputKeypress = function (event) {
    var v = handleMessageInputKeypress.apply(this, arguments);
    if (experimentalConfig.clearBubble && v === false)
      vueApp.socket.emit('user-msg', '');
    return v;
  };
  // 自動色分け
  var saveTripColor = () => localStorage.setItem('experimentalColor', Array.from(document.querySelectorAll('.tripColor')).reduce((html, style) => html + style.outerHTML, ''));
  document.querySelector('head').insertAdjacentHTML('beforeend', localStorage.getItem('experimentalColor') || '');
  var setLogColor = () => {
  };
  // ログ右クリックメニュー
  var logMenu = document.body.appendChild(document.createElement('select'));
  var selectedMessage = {};
  logMenu.setAttribute('style', 'position:fixed;display:none');
  logMenu.onchange = function () {
    switch (logMenu.value) {
      case 'color':
        var colorPicker = document.getElementById('colorPicker');
        var styleId = selectedMessage.trip || selectedMessage.userId;
        var attrName = selectedMessage.trip ? 'data-trip' : 'data-user-id';
        var style = (document.getElementById('color-' + styleId) || document.querySelector('head').appendChild(document.createElement('style')));
        style.id = 'color-' + styleId;
        if (selectedMessage.trip)
          style.className = 'tripColor';
        if (logWindow && !logWindow.closed) {
          var logDoc = logWindow.document;
          var style2 = (logDoc.getElementById(style.id) || logDoc.querySelector('head').appendChild(logDoc.createElement('style')));
          style2.id = style.id;
        }
        (colorPicker.onchange = colorPicker.oninput = function () {
          style.textContent = `[${attrName}="${styleId}"],[${attrName}="${styleId}"] .message-author{color:${colorPicker.value}}`;
          if (style2)
            style2.textContent = style.textContent;
          if (style.className === 'tripColor')
            saveTripColor();
        })();
        colorPicker.click();
        break;
      case 'uncolor':
        document.getElementById('color-' + selectedMessage.trip)?.remove();
        document.getElementById('color-' + selectedMessage.userId)?.remove();
        if (logWindow && !logWindow.closed) {
          logWindow.document.getElementById('color-' + selectedMessage.trip)?.remove();
          logWindow.document.getElementById('color-' + selectedMessage.userId)?.remove();
        }
        if (selectedMessage.trip)
          saveTripColor();
        break;
      case 'ignore':
        vueApp.ignoreUser(selectedMessage.userId);
        break;
      case 'block':
        vueApp.blockUser(selectedMessage.userId);
        break;
      case 'mention':
        var textbox = document.getElementById('input-textbox');
        if (!textbox)
          break;
        textbox.value += (textbox.value.length && !textbox.value.endsWith(' ') ? ' ' : '') + '@' + selectedMessage.name + ' ';
        textbox.focus();
        break;
      case 'quote':
        var textbox = document.getElementById('input-textbox');
        if (!textbox)
          break;
        var length = textbox.value.length;
        textbox.value += ' > ' + selectedMessage.body;
        textbox.focus();
        textbox.setSelectionRange(length, length);
        break;
    }
    logMenu.style.display = 'none';
  };
  document.addEventListener('click', function (event) {
    if (event.target.parentNode !== logMenu)
      logMenu.style.display = 'none';
    if (experimentalConfig.youtube && event.target.href && /^https:\/\/(?:(?:www\.|m\.)?youtube\.com|youtu\.be)\/./.test(event.target.href))
      event.target.href = 'https://iwamizawa-software.github.io/experimental-poipoi/youtube.html#' + encodeURIComponent(event.target.href);
  });
  document.addEventListener('contextmenu', function (event) {
    logMenu.style.display = 'none';
    if (!event.ctrlKey && event.target.classList.contains('message-author')) {
      selectedMessage = {
        userId: event.target.parentNode.dataset.userId,
        trip: event.target.parentNode.dataset.trip || '',
        body: event.target.parentNode.querySelector('.message-body')?.textContent || ''
      };
      logMenu.innerHTML = `
<option disabled selected>-
<option value="color">${text('色', 'Color')}
<option value="uncolor">${text('色解除', 'Uncolor')}
<option value="mention">${text('メンション', 'Mention')}
<option value="quote">${text('引用', 'Quote')}
<option value="ignore">${text('一方あぼーん', 'Ignore')}
<option value="block">${text('相互あぼーん', 'Block')}
`;
      logMenu.size = logMenu.options.length;
      logMenu.options[0].text = selectedMessage.name = (event.target.textContent[0] === '◆' ? event.target.previousSibling.textContent : '') + event.target.textContent;
      logMenu.style.bottom = (document.documentElement.clientHeight - event.clientY) + 'px';
      logMenu.style.left = event.pageX + 'px';
      logMenu.style.display = 'block';
      event.preventDefault();
    }
  });
  // ユーザーリスト表示時
  var getUserListForListPopup = vueApp.getUserListForListPopup;
  vueApp.getUserListForListPopup = function () {
    var output = getUserListForListPopup.apply(this, arguments);
    if (experimentalConfig.numbering === 2)
      output.forEach(u => {
        if (u.isInRoom)
          u.name = addIHash(u.name, u.id);
      });
    return output;
  };
  // ログ追加時
  var writeLogToWindow;
  var autoColorIndex = 0;
  HTMLDivElement.prototype.appendChild = function (aChild) {
    if (this.id === 'chatLog') {
      try {
        // 白トリップ表示
        if (experimentalConfig.numbering === 2 && aChild.dataset.userId && aChild.dataset.userId !== 'null')
          aChild.querySelector('.message-author').innerHTML += toIHash(aChild.dataset.userId);
        // ルーラリンク
        var messageBody = aChild.querySelector('.message-body>span') || aChild.querySelector('.message-body');
        if (messageBody && !aChild.querySelector('.message-body a') && (messageBodyHTML = replaceRulaLink(messageBody.innerHTML)) !== messageBody.innerHTML)
          messageBody.innerHTML = messageBodyHTML;
        if (!this.childNodes.length)
          Array.from(document.querySelectorAll('style[id^=color-]:not(.tripColor)')).forEach(style => style.remove());
        if (aChild.dataset.userId && aChild.dataset.userId !== 'null') {
          // キャラ付ログ
          var user = vueApp.users[aChild.dataset.userId];
          if (user) {
            loadCharacterIcon(aChild.dataset.characterId = user.character?.characterName + (user.isAlternateCharacter ? '_alt' : ''));
            if (user.isInactive)
              aChild.classList.add('inactive-message');
          }
          // 自動色分け
          if (/◆(.{10})/.test(user?.name))
            aChild.dataset.trip = RegExp.$1;
          if (experimentalConfig.autoColor && (!aChild.dataset.trip || !document.getElementById('color-' + aChild.dataset.trip)) && !document.getElementById('color-' + aChild.dataset.userId)) {
            var colorList = experimentalConfig.autoColorList?.length ? experimentalConfig.autoColorList : ['#ff8000', '#008000', '#0080ff', '#8060ff', '#ff60ff'];
            var style = document.querySelector('head').appendChild(document.createElement('style'));
            style.id = 'color-' + aChild.dataset.userId;
            style.textContent = `[data-user-id="${aChild.dataset.userId}"],[data-user-id="${aChild.dataset.userId}"] .message-author{color:${colorList[autoColorIndex++ % colorList.length]}}`;
            if (logWindow && !logWindow.closed)
              logWindow.document.querySelector('head').append(style.cloneNode(true));
          }
          // 発言間隔秒数
          if (messageBody && user && experimentalConfig.spammer && experimentalConfig.displayMsgInterval && user.commentInterval && user.commentInterval !== Infinity) {
            var values = [user.commentInterval];
            if (user.commentIntervalAverage && user.commentIntervalAverage !== Infinity)
              values.push(user.commentIntervalAverage);
            messageBody.innerHTML += ` (${values.map(v => (v + '').replace(/(\.\d)\d+$/, '$1')).join(' ')})`;
          }
        }
        // ログ窓に書き出し
        if (writeLogToWindow)
          writeLogToWindow(aChild);
      } catch (err) {
        console.log(err);
      }
    }
    return Node.prototype.appendChild.call(this, aChild);
  };
  // ログイン時
  var logWindow, configWindow;
  var onlogin = function () {
    document.getElementById('disableButtonContainer')?.remove();
    // 音声入力
    var textbox = document.getElementById('input-textbox');
    var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      var buttonContainer = createButtonContainer();
      buttonContainer.appendChild(textbox.previousSibling);
      buttonContainer.innerHTML += '<br><input type="checkbox" id="enableSpeech" style="display:none"><button id="voiceButton" onclick="this.previousSibling.click()">' + text('音声', 'Voice') + '</button>'
      textbox.before(buttonContainer);
      var enableSpeech = document.getElementById('enableSpeech');
      enableSpeech.onclick = function () {
        recognition.lang = experimentalConfig.voiceLang || vueApp._i18n.locale;
        recognition[enableSpeech.checked ? 'start' : 'stop']();
      };
      var recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.onresult = function (event) {
        var result = [];
        for (var i = event.resultIndex; i < event.results.length; i++)
          if (event.results[i].isFinal)
            result.push(event.results[i][0].transcript);
        if (!(result = result.join(' ')))
          return;
        if (experimentalConfig.voiceLog)
          vueApp.writeMessageToLog(text('音声入力', 'Voice input'), result, 'voice input');
        else
          sendMessage(text(experimentalConfig.voiceFormatGen || '音声入力:message', experimentalConfig.voiceFormatFor || 'Voice input:message').replace(/message|$/, result));
      };
      recognition.onend = function () {
        if (enableSpeech.checked)
          recognition.start();
      };
    }
    // ログ窓
    var logButtons = createButtonContainer();
    logButtons.setAttribute('style', 'all:unset;display:flex;order:4');
    document.getElementById('chat-log-container').after(logButtons);
    var widgetButton = logButtons.appendChild(document.createElement('button'));
    widgetButton.id = 'widgetButton';
    widgetButton.textContent = 'Widget';
    widgetButton.onclick = () => widget.open();
    writeLogToWindow = function (div) {
      if (!logWindow || logWindow.closed)
        return;
      var log = logWindow.document.body.firstElementChild;
      var bottom = (log.scrollHeight - log.clientHeight) - log.scrollTop < 5;
      log.append(logWindow.document.importNode(div, true));
      if (bottom)
        log.scrollTop = log.scrollHeight - log.clientHeight;
      else
        logWindow.document.title = text('↓ 新しいメッセージ', '↓ New Messages');
    };
    var logWindowButton = logButtons.appendChild(document.createElement('button'));
    logWindowButton.id = 'logWindowButton';
    logWindowButton.textContent = text('ログ窓', 'Log Window');
    logWindowButton.onclick = function () {
      if (logWindow && !logWindow.closed) {
        logWindow.focus();
        return;
      }
      window.logWindow = logWindow = open('about:blank', 'log' + (new Date()).getTime(), 'width=300,height=500,menubar=no,toolbar=no,location=no');
      if (!logWindow) {
        asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
        return;
      }
      logWindow.document.write(`
<!doctype html>
<head>
<title>${vueApp._i18n.t('room.' + vueApp.currentRoom.id)}</title>
<style>
html,body,#chatLog,input{margin:0;padding:0;box-sizing:border-box;width:100%;height:100%;resize:none;overflow:auto}
#chatLog{height:calc(100% - 3em);padding:2px;font-size:12px}
.message-timestamp,.ignored-message{display:none}
input{display:block;position:fixed;bottom:0;height:2em}
</style>
<style id="log-style"></style>
${Array.from(document.querySelectorAll('style[id^=color]')).reduce((html, style) => html + style.outerHTML, '')}
<script>window.experimental = true;
window.interval = setInterval(function () {
  try {
    if (opener.logWindow !== window)
      throw 1;
  } catch (err) {
    document.title = "${text('切断されたログ', 'Disconnected log')}";
    clearInterval(interval);
  }
}, 10000);</script>
</head>
<body><input type="text" id="input-textbox"></body>
`);
      logWindow.onload = function () {
        var log = logWindow.document.importNode(document.getElementById('chatLog'), true);
        log.style.height = log.style.width = '';
        logWindow.document.body.firstElementChild.before(log);
        log.scrollTop = log.scrollHeight - log.clientHeight;
        logWindow.onresize = log.onscroll = function () {
          if ((log.scrollHeight - log.clientHeight) - log.scrollTop < 5)
            logWindow.document.title = vueApp._i18n.t('room.' + vueApp.currentRoom.id);
        };
        logWindow.document.body.lastElementChild.onkeypress = function (event) {
          if (this.value && event.key === 'Enter') {
            sendMessage(this.value);
            this.value = '';
          }
        };
        logWindow.document.body.lastElementChild.onkeydown = autoComplete.onkeydown;
      };
      logWindow.onfocus = function () {
        logWindow.document.body.lastElementChild.focus();
      };
      logWindow.onstorage = function () {
        if (!this.closed)
          logWindow.document.getElementById('log-style').textContent = experimentalConfig.logWindowCSS + (experimentalConfig.displayIcon ? characterLogCSS.textContent : '');
      };
      logWindow.onstorage();
      logWindow.vueApp = window.vueApp;
      logWindow.document.close();
    };
    addEventListener('unload', () => {
      if (logWindow && !logWindow.closed) {
        logWindow.document.title = text('切断されたログ', 'Disconnected log');
        logWindow.clearInterval(logWindow.interval);
      }
    });
    // ログクリアボタン
    var clearLog = logButtons.appendChild(document.createElement('button'));
    clearLog.id = 'clearButton';
    clearLog.textContent = text('クリア', 'Clear');
    clearLog.onclick = vueApp.clearLog;
    // ログ保存ボタン
    var download = logButtons.appendChild(document.createElement('button'));
    download.id = 'saveButton';
    download.textContent = text('保存', 'Save');
    var downloadLink = document.createElement('a');
    download.onclick = function () {
      URL.revokeObjectURL(downloadLink.href);
      var log = document.getElementById('chatLog').innerText;
      if (!log)
        return;
      downloadLink.href = URL.createObjectURL(new Blob([log.replace(/([^\r])\n/g, '$1\r\n')], {type: 'application/octet-stream'}));
      var opts = {year: 'numeric'};
      opts.month = opts.day = opts.hour = opts.minute = opts.second = '2-digit';
      downloadLink.download = (new Date()).toLocaleString([], opts).replace(/\D/g, '') + '.txt';
      downloadLink.click();
    };
    // 設定
    var configButton = logButtons.appendChild(document.createElement('button'));
    configButton.textContent = text('設定', '#config');
    configButton.id = 'configButton';
    configButton.onclick = function () {
      if (configWindow && !configWindow.closed) {
        try {
          configWindow.text();
          configWindow.focus();
          return;
        } catch (err) {}
      }
      configWindow = open('about:blank');
      if (!configWindow) {
        asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
        return;
      }
      configWindow.document.write(`
<!doctype html>
<head>
<title>${text('スクリプトの設定', 'Experimental Config')}</title>
<script>window.experimental = true; var text = function () {return arguments[${text(0, 1)}]};</script>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
<script>
(async function () {
  eval(await (await fetch('${GITHUB_PATH}experimental-config.js?t=' + (new Date).getTime())).text());
  load(${JSON.stringify(experimentalConfig)});
})();
</script>
</body>
`);
      configWindow.document.close();
    };
      // insert config button
      const buttons = document.getElementsByClassName('fa-cogs');
      const settingsButton = buttons.length ? buttons[0] : null;
      settingsButton.parentElement.appendChild(configButton);
      
    // カラーピッカー
    var colorPicker = logButtons.appendChild(document.createElement('input'));
    colorPicker.id = 'colorPicker';
    colorPicker.type = 'color';
    widget.init();
  };
  if (document.getElementById('input-textbox')) {
    onlogin();
  } else {
    var connectToServer = vueApp.connectToServer;
    vueApp.connectToServer = async function () {
      // 内藤髪制御
      if (localStorage.getItem('characterId') === 'naito' && experimentalConfig.hairControl) {
        vueApp.characterId = experimentalConfig.hairControl === 1 ? 'naito' : 'funkynaito';
        vueApp.selectedCharacter = vueApp.allCharacters.find(c => c.characterName === vueApp.characterId);
      }
      var r = await connectToServer.apply(this, arguments);
      onlogin();
      return r;
    };
  }
  // 呼び出し通知
  var getCharacterPath = user => {
    var name = user.characterId || user.character?.characterName;
    return 'characters/' + name + '/front-standing.' + (vueApp.allCharacters.find(c=>c.characterName===name) || {format:'svg'}).format;
  }
  var pngCache = {};
  var SVG2PNG = async function (url) {
    var callback;
    if (url.slice(-3) === 'png')
      return url;
    if (pngCache[url])
      return pngCache[url];
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var img = new Image();
      img.onload = function () {
        canvas.width = img.width;
        canvas.height = canvas.height;
        ctx.drawImage(img, 0, 0);
        callback(pngCache[url] = canvas.toDataURL('image/png'));
      };
      img.src = 'data:image/svg+xml,' + encodeURIComponent(await (await fetch(url)).text());
    } catch (err) {
      return url;
    }
    return {then:c=>callback=c};
  };
  var mention;
  var mentionNotification = async function (user, msg) {
    if (
      window.Notification &&
      experimentalConfig.notifyMention &&
      !document.hasFocus() &&
      user &&
      !vueApp.ignoredUserIds.has(user.id) &&
      isMention(msg)
    ) {
      mention = new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'mention',
        body: msg,
        requireInteraction: true
      });
      mention.onclick = function () {
        if (experimentalConfig.replyMsg)
          sendMessage(experimentalConfig.replyMsg);
        // Chromeはクリック時既定の動作がない
        focus();
        document.getElementById('input-textbox').focus();
      };
      mentionSound?.play?.();
    }
  };
  addEventListener('focus', function () {
    if (mention)
      mention.close();
  });
  // 入退室通知
  var accessNotification = async function (user, msg) {
    var notifyAccess = experimentalConfig.notifyAccess;
    if (
      window.Notification &&
      (((notifyAccess & 1) && document.hasFocus()) || ((notifyAccess & 2) && !document.hasFocus())) &&
      !vueApp.ignoredUserIds.has(user.id)
    ) {
      (new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'access',
        body: msg
      })).onclick = function (event) {
        this.close();
        event.preventDefault();
      };
    }
  };
  // 配信通知
  var streamNotification = async function (user, index) {
    if (window.Notification && experimentalConfig.notifyStream && !vueApp.showNotifications && !document.hasFocus()) {
      (new Notification(user.name, {
        // ChromeはNotification.iconにSVGを指定できない
        icon: await SVG2PNG(getCharacterPath(user)),
        tag: 'stream',
        body: text('ﾁｬﾝﾈﾙ' + (index + 1) + 'で配信開始', 'Start stream in Channel ' + (index + 1))
      })).onclick = function (event) {
        vueApp.wantToTakeStream(index);
        this.close();
        event.preventDefault();
      };
    }
  };
  // チェス通知
  var chess;
  var chessNotification = function () {
    if (window.Notification) {
      chess = new Notification(text('チェス', 'Chess'), {
        tag: 'chess',
        body: text('あなたの番です', "It's your turn."),
        requireInteraction: true
      });
      chess.onclick = focus.bind(window);
    }
    mentionSound?.play?.();
  };
  var closeChessNotification = function () {
    chess?.close();
  };
  addEventListener('focus', closeChessNotification);
  addEventListener('mousedown', closeChessNotification);
  // PC音声追加
  const DEVICE_ID = '3526701059AE4F9F8B811CA0EF190593';
  navigator.mediaDevices.enumerateDevices = async function () {
    var list = await MediaDevices.prototype.enumerateDevices.call(navigator.mediaDevices);
    return list.concat({
      deviceId: DEVICE_ID,
      label: 'Speaker Sound',
      kind: 'audioinput'
    });
  };
  navigator.mediaDevices.getUserMedia = async function (option) {
    var userMedia, stream;
    if (option?.audio?.deviceId?.exact === DEVICE_ID) {
      try {
        await asyncAlert('Check "Share audio", and share screen. Video is not changed.\nMaybe Firefox and mobile cannot use "Share audio".');
        var stream = await navigator.mediaDevices.getDisplayMedia({
          video: {displaySurface: 'monitor'},
          audio: {
            echoCancellation: false,
            noiseSuppression: false,
            autoGainControl: false,
            channelCount: 2
          }
        });
        stream.getVideoTracks().forEach(track => {
          track.stop();
          stream.removeTrack(track);
        });
        if (!stream.getAudioTracks().length)
          throw new Error('Audio track not found');
        delete option.audio;
      } catch (err) {
        asyncAlert('Audio track not found');
        console.log(err);
        throw err;
      }
    }
    if (option.video || option.audio) {
      userMedia = await MediaDevices.prototype.getUserMedia.apply(navigator.mediaDevices, arguments);
      if (stream)
        userMedia.addTrack(stream.getAudioTracks()[0]);
    } else {
      userMedia = stream;
    }
    return userMedia;
  };
  // グラフ
  var graph, Graph = function ({currentRoom, connectedUsers}) {
    this.nodes = eval('[' + ('[' + '{},'.repeat(currentRoom.size.x) + '],').repeat(currentRoom.size.y) + ']');
    this.room = currentRoom.id;
    currentRoom.blocked.forEach(({x, y}) => this.nodes[y][x] = null);
    var flag = [false];
    for (var y = 0; y < currentRoom.size.y; y++)
      for (var x = 0; x < currentRoom.size.x; x++) {
        var node = this.nodes[y][x], tmp;
        if (!node)
          continue;
        node.edges = new Map();
        if (tmp = this.nodes[y][x - 1])
          node.edges.set(tmp, {direction: 'left', reverse: 'right'});
        else if (tmp === null)
          node.blocked = 'left';
        if (tmp = this.nodes[y][x + 1])
          node.edges.set(tmp, {direction: 'right', reverse: 'left'});
        else if (tmp === null)
          node.blocked = 'right';
        if (tmp = this.nodes[y - 1]?.[x])
          node.edges.set(tmp, {direction: 'down', reverse: 'up'});
        else if (tmp === null)
          node.blocked = 'down';
        if (tmp = this.nodes[y + 1]?.[x])
          node.edges.set(tmp, {direction: 'up', reverse: 'down'});
        else if (tmp === null)
          node.blocked = 'up';
        node.users = new Map();
        node.flag = flag;
      }
    currentRoom.forbiddenMovements.forEach(({xFrom, yFrom, xTo, yTo}) => {
      var from = this.nodes[yFrom]?.[xFrom], to = this.nodes[yTo]?.[xTo];
      if (!from || !to)
        return;
      var edge = from.edges.get(to);
      if (edge?.direction) {
        if (!from.blocked)
          from.blocked = edge.direction;
        if (edge.reverse)
          delete edge.direction;
        else
          from.edges.delete(to);
      }
      var edge = to.edges.get(from);
      if (edge.direction)
        delete edge?.reverse;
      else
        to.edges.delete(from);
    });
    connectedUsers.forEach(({id, position}) => this.nodes[position.y]?.[position.x]?.users.set(id));
    for (var id in currentRoom.doors) {
      var door = currentRoom.doors[id];
      if (this.nodes[door.y]?.[door.x])
        this.nodes[door.y][door.x].door = {id, direction: door.direction};
    }
  };
  Graph.prototype.update = function (userId, xFrom, yFrom, xTo, yTo) {
    this.nodes[yFrom]?.[xFrom]?.users.delete(userId);
    this.nodes[yTo]?.[xTo]?.users.set(userId);
  };
  Graph.prototype.search = function (xFrom, yFrom, xTo, yTo, direction) {
    var target = this.nodes[yTo]?.[xTo];
    if (!target)
      return;
    var from = this.nodes[yFrom]?.[xFrom];
    if (!from || target === from)
      return;
    var queue = [{node: target, path: {length: 0}}], current, door, flag = target.flag = [true];
    while (current = queue.shift()) {
      var iterator = current.node.edges.entries();
      for (var [node, edge] of iterator) {
        if (node.flag[0] || !edge.reverse || (door && node.door && from !== node))
          continue;
        var i = current.path.length, child = {node, path: {length: i}};
        if (i && current.path[i - 1] !== edge.reverse)
          child.path[child.path.length++] = current.path[i - 1];
        child.path[child.path.length++] = edge.reverse;
        child.path.__proto__ = current.path;
        if (from === node) {
          if (direction !== edge.reverse)
            child.path[child.path.length++] = edge.reverse;
          flag[0] = false;
          var path = Array.from(child.path).reverse();
          if (target.blocked && target.blocked !== child.path[0])
            path.push(target.blocked);
          return path;
        }
        node.flag = flag;
        if (node.door) {
          if (node.door.direction !== edge.reverse)
            child.path[child.path.length++] = edge.reverse;
          child.path[child.path.length++] = [this.room, node.door.id];
          door = Array.from(child.path).reverse();
          if (target.blocked && target.blocked !== child.path[0])
            door.push(target.blocked);
          continue;
        }
        queue.push(child);
      }
    }
    flag[0] = false;
    return door || (target.door && [[this.room, target.door.id]]);
  };
  Graph.prototype.escape = function ({x, y, direction}, far) {
    var currentNode = this.nodes[y]?.[x];
    if (!currentNode || currentNode.users.size < 2)
      return;
    var candidate = [], second = [];
    var queue = [{node: currentNode, path: {length: 0}}], current, flag = currentNode.flag = [true];
    while (current = queue.shift()) {
      var iterator = current.node.edges.entries();
      for (var [node, edge] of iterator) {
        if (node.flag[0] || !edge.direction || node.door)
          continue;
        var i = current.path.length, child = {node, path: {length: i}};
        if ((current.path[i - 1] || direction) !== edge.direction)
          child.path[child.path.length++] = edge.direction;
        child.path[child.path.length++] = edge.direction;
        child.path.__proto__ = current.path;
        node.flag = flag;
        queue.push(child);
        (node.users.size || (far && child.path.length < 4) ? second : candidate).push(child.path);
      }
      if (!far)
        break;
    }
    flag[0] = false;
    return Array.from(candidate.length ? candidate[Math.random() * candidate.length | 0] : second[Math.random() * second.length | 0]);
  };
  var physicalToLogical = function (x, y) {
    var room = vueApp.currentRoom, scale = vueApp.getCanvasScale();
    var blockWidth = room.blockWidth || 80, blockHeight = room.blockHeight || 40;
    x = ((x - vueApp.canvasGlobalOffset.x) / scale - room.originCoordinates.x) / blockWidth;
    y = (room.originCoordinates.y - (blockHeight / 2) - (y - vueApp.canvasGlobalOffset.y) / scale) / blockHeight;
    return {x: Math.floor(x - y), y: Math.floor(x + y)};
  };
  document.addEventListener('dblclick', event => {
    var devicePixelRatio = experimentalConfig.disablePixelRatio ? 1 : window.devicePixelRatio;
    if (event.target.id === 'room-canvas' && !experimentalConfig.disableMove) {
      var from = vueApp.users[vueApp.myUserID], to = physicalToLogical(event.offsetX * devicePixelRatio, event.offsetY * devicePixelRatio);
      vueApp.route.add(graph?.search(from.logicalPositionX, from.logicalPositionY, to.x, to.y, from.direction));
    }
  });
  // 経路移動
  vueApp.route = {
    queue: [],
    next: function (prev) {
      if (!this.queue.length || (prev === 'room' ? Array !== this.queue[0].constructor : (prev && prev !== this.queue[0]))) {
        this.clear();
        return;
      }
      this.queue.shift();
      this.move();
    },
    move: async function () {
      if (!this.queue.length)
        return;
      if (typeof this.queue[0] === 'string') {
        vueApp.socket.emit('user-move', this.queue[0]);
      } else {
        vueApp.changeRoom.apply(vueApp, this.queue[0]);
      }
    },
    add: function (q) {
      if (this.queue.length || q?.constructor !== Array)
        return;
      this.queue = q;
      this.move();
    },
    clear: function () {
      this.queue = [];
    }
  };
  // URL短縮
  document.addEventListener('paste', async event => {
    if (event.target.id === 'input-textbox') {
      var url = event.clipboardData.getData('text');
      if (url.length > (event.target.maxLength || 500) - event.target.value.length && /^https?:\/\/[^\/]/.test(url)) {
        event.preventDefault();
        var end, failed = function () {
          if (end)
            return;
          end = true;
          asyncAlert(text('貼り付けようとしたURLが最大文字数をオーバーしています', 'Pasted URL is too long'));
        };
        setTimeout(failed, +experimentalConfig.shortenerTimeout * 1000 || 2000);
        try {
          var shortURL = (await (await fetch('https://is.gd/create.php?format=json&url=' + encodeURIComponent(url))).json()).shorturl;
          var domain = ('' + url.match(/^https?:\/\/([^\/]+)/)[1]).replace(/www\./, 'www\u200b.');
        } catch (err) {
          console.log(err);
        }
        if (end)
          return;
        if (!shortURL || shortURL.indexOf('https://is.gd/'))
          failed();
        else
          event.target.value += shortURL + ` ( ${domain} )`;
        end = true;
      }
    }
  });
  // nimado
  var nimado = function () {
    if (nimado !== this)
      return nimado.call(nimado);
    var users = Object.values(vueApp.users).filter(u => u.id !== vueApp.myUserID);
    this.stopCount = users.length;
    this.dead = [];
    this.users = [];
    users.forEach(u => setTimeout(()=>vueApp.socket.emit('user-block', u.id), 0));
  };
  nimado.count = function (userCount) {
    if (!this.stopCount)
      return;
    if (this.dead.length > 1)
      this.users.push('(' + this.dead.join(' = ') + ')');
    this.dead = [];
    if (!--this.stopCount)
      systemMessage(text(`二窓ユーザーが${this.users.length}人いました。${this.users}`, `${this.users.length} duplicate users.${this.users}`));
  };
  nimado.left = function (name) {
    if (!this.stopCount)
      return;
    this.dead.push(name);
  };
  var quizWindow, sendMessageToServer = vueApp.sendMessageToServer;
  vueApp.sendMessageToServer = function () {
    var t = document.getElementById('input-textbox');
    if (t) {
      if (t.value === '#nimado') {
        nimado();
        t.value = '';
        return;
      } else if (t.value === '#quiz') {
        quizWindow = open('https://iwamizawa-software.github.io/experimental-poipoi/quiz.html' + text('', '?en'), JSON.stringify(Object.values(vueApp.users).map(({id, name, character}) => ({id, name, characterId: character.characterName}))));
        t.value = '';
        return;
      } else if (t.value.startsWith('#block ')) {
        vueApp.socket.emit('user-block', t.value.slice(7));
        t.value = '';
        return;
      } else if (t.value === '#config') {
        document.getElementById('configButton')?.click();
        t.value = '';
        return;
      } else if (t.value === '#ver') {
        t.value = window.experimentalVersion;
      }
    }
    return sendMessageToServer.apply(this, arguments);
  };
  // チェス棋譜
  var fens = [], pgnButton = document.createElement('button'), pgnWindow;
  pgnButton.onclick = function () {
    try {
      if (!pgnWindow || pgnWindow.closed)
        throw 1;
      pgnWindow.location.href;
      pgnWindow.focus();
    } catch (err) {
      pgnWindow = open('about:blank');
    }
    if (!pgnWindow) {
      asyncAlert(text('ポップアップを許可してください', 'Allow to popup'));
      return;
    }
    pgnWindow.document.open();
    pgnWindow.document.write(`<!doctype html>
<title>${pgnButton.textContent}</title>
<script src="https://iwamizawa-software.github.io/fen-to-pgn/fen-to-pgn.js"></script>
<body>
<script>document.body.appendChild(document.createElement('pre')).textContent = fenToPgn(${JSON.stringify(fens)});</script>
<p><a href="https://www.chesscompass.com/analyze" target="_blank">${text('分析', 'Analyze')}</a></body>
`);
    pgnWindow.document.close();
  };
  var getChessMovement = function () {
    if (fens.length < 2)
      return;
    try {
      var before = fens[fens.length - 2].split(' ')[0].replace(/[1-8]/g, n => ' '.repeat(n)).replace(/\//g, '');
      var after = fens[fens.length - 1].split(' ')[0].replace(/[1-8]/g, n => ' '.repeat(n)).replace(/\//g, '');
      for (var i = 0; i < after.length; i++)
        if (after[i] !== ' ' && before[i] !== after[i])
          return 'abcdefgh'[i % 8] + (8 - Math.floor(i / 8));
    } catch (err) {
      console.log(err);
    }
  };
  var chessSquare;
  var updateFEN = function () {
    if (chessSquare)
      chessSquare.style.backgroundColor = '';
    var address = getChessMovement();
    if (address && (chessSquare = document.querySelector('[data-square=' + address + ']')))
      chessSquare.style.backgroundColor = '#faa';
    if (document.contains(pgnButton))
      return;
    document.querySelector('.chessboard-slot-wrapper :last-child')?.before(pgnButton);
    pgnButton.textContent = text('棋譜', 'Notation');
  };
  // クリックで吹き出しを削除
  var bubbleUsers = [], selectedBubbleUser;
  var drawBubbles = vueApp.drawBubbles;
  vueApp.drawBubbles = function () {
    bubbleUsers.length = 0;
    var value = drawBubbles.apply(this, arguments), area;
    if (area = selectedBubbleUser?.bubbleArea) {
      vueApp.canvasContext.beginPath();
      vueApp.canvasContext.rect(area.x0, area.y0, area.width, area.height);
      vueApp.canvasContext.strokeStyle = 'red';
      vueApp.canvasContext.lineWidth = 1;
      vueApp.canvasContext.stroke();
    }
    return value;
  };
  var getBubbleImage = vueApp.getBubbleImage;
  vueApp.getBubbleImage = function (user) {
    var bubbleImage = getBubbleImage.apply(this, arguments);
    if (!bubbleImage)
      return;
    var getImage = bubbleImage.getImage;
    bubbleImage.getImage = function () {
      var image = getImage.apply(this, arguments);
      if (!vueApp.canvasContext)
        return image;
      var area = user.bubbleArea = user.bubbleArea || {};
      area.x0 = user.currentPhysicalPositionX + vueApp.blockWidth/2 + (user.bubblePosition === 'up' || user.bubblePosition === 'right' ? 21 : -21 - user.bubbleImage.width);
      area.y0 = user.currentPhysicalPositionY - (user.bubblePosition === 'down' || user.bubblePosition === 'right'  ? 62 : 70 + user.bubbleImage.height);
      area.x0 = Math.round(vueApp.getCanvasScale() * (area.x0 || 0) + vueApp.canvasGlobalOffset.x);
      area.y0 = Math.round(vueApp.getCanvasScale() * (area.y0 || 0) + vueApp.canvasGlobalOffset.y);
      area.x1 = area.x0 + image.width;
      area.y1 = area.y0 + image.height;
      area.width = image.width;
      area.height = image.height;
      bubbleUsers.unshift(user);
      return image;
    };
    return bubbleImage;
  };
  var currentX, currentY;
  var bubbleAreaCondition = ({bubbleArea}) => bubbleArea.x0 <= currentX && currentX <= bubbleArea.x1 && bubbleArea.y0 <= currentY && currentY <= bubbleArea.y1;
  var selectBubbleEvent = event => {
    var lastSelected = selectedBubbleUser, x, y;
    if (event?.target?.id === 'room-canvas') {
      currentX = event.offsetX * devicePixelRatio;
      currentY = event.offsetY * devicePixelRatio;
      selectedBubbleUser = bubbleUsers.find(bubbleAreaCondition);
    } else {
      selectedBubbleUser = null;
    }
    if (lastSelected !== selectedBubbleUser)
      vueApp.isRedrawRequired = true;
  };
  addEventListener('mousedown', selectBubbleEvent);
  var lastMouseMoveEvent = {};
  addEventListener('mousemove', event => {
    if (lastMouseMoveEvent.x !== event.x || lastMouseMoveEvent.y !== event.y)
      selectBubbleEvent(event.buttons ? null : event);
    lastMouseMoveEvent = event;
  });
  addEventListener('click', event => {
    if (event.target.id === 'room-canvas' && selectedBubbleUser) {
      selectedBubbleUser.message = '';
      selectedBubbleUser = null;
      vueApp.isRedrawRequired = true;
    }
  });
  var COMMENT_TIMES_LENGTH = 4
  var recordInterval = function (user) {
    if (!user.commentTimes)
      user.commentTimes = Array(COMMENT_TIMES_LENGTH).fill(-Infinity);
    user.commentTimes.push(user.lastCommentTime = (new Date()).getTime());
    if (user.commentTimes.length > COMMENT_TIMES_LENGTH)
      user.commentTimes.shift();
  };
  // socket event
  var streamStates = [];
  var moved = false;
  var socketEvent = function (eventName) {
    switch (eventName) {
      case 'server-move':
        var dto = arguments[1], user = vueApp.users[dto.userId];
        // グラフ
        if (dto && user)
          graph?.update(dto.userId, user.logicalPositionX, user.logicalPositionY, dto.x, dto.y);
        // 経路移動
        if (dto?.direction && dto?.userId === vueApp.myUserID) {
          vueApp.route.next(dto.direction);
          moved = true;
        }
        // 重なり回避
        if (experimentalConfig.escape && moved) {
          var myself = vueApp.users[vueApp.myUserID];
          vueApp.route.add(graph.escape(dto?.userId === vueApp.myUserID ? dto : {x: myself?.logicalPositionX, y: myself?.logicalPositionY, direction: myself?.direction}, experimentalConfig.escape === 2));
        }
        break;
      case 'server-reject-movement':
        vueApp.route.next();
        break;
      case 'server-user-joined-room':
        var user = arguments[1];
        // グラフ
        if (user)
          graph?.update(user.id, null, null, user.position.x, user.position.y);
        // 重なり回避
        if (experimentalConfig.escape && moved) {
          var myself = vueApp.users[vueApp.myUserID];
          vueApp.route.add(graph.escape(user.id === vueApp.myUserID
            ? {x: user.position.x, y: user.position.y, direction: user.direction}
            : {x: myself?.logicalPositionX, y: myself?.logicalPositionY, direction: myself?.direction}
          , experimentalConfig.escape === 2));
        }
        // 入室ログ
        setTimeout(() => {
          if (!user || user.id === vueApp.myUserID)
            return;
          if (user.aboned)
            return;
          // 最終発言時間
          if (vueApp.users[user.id])
            recordInterval(vueApp.users[user.id]);
          if (!experimentalConfig.withoutAnon || !isAnon(user.name)) {
            if (experimentalConfig.accessLog)
              systemMessage(addIHash(user.name, user.id) + text('が入室', ' has entered the room.') + (experimentalConfig.accessLog === 2 ? ' (ID:' + user.id +')' : ''));
            accessNotification(user, text('入室', 'join'));
          }
          widget.access(user.id, user.name, true);
        }, 0);
        break;
      case 'server-user-left-room':
        var user = vueApp.users[arguments[1]];
        // グラフ
        if (user)
          graph?.update(arguments[1], user.logicalPositionX, user.logicalPositionY, null, null);
        // 退室ログ
        if (!user || user.id === vueApp.myUserID)
          return;
        if (!vueApp.ignoredUserIds.has(user.id) && !(experimentalConfig.withoutAnon && isAnon(user.name))) {
          if (experimentalConfig.accessLog)
            systemMessage(addIHash(user.name, user.id) + text('が退室', ' has exited the room.') + (experimentalConfig.accessLog === 2 ? ' (ID:' + user.id +')' : ''));
          accessNotification(user, text('退室', 'exit'));
        }
        widget.access(user.id, user.name);
        // 配信通知
        var stream = vueApp.streams.find(s => s.userId === user.id);
        if (stream)
          stream.isActive = false;
        // nimado
        nimado.left(user.name);
        break;
      case 'server-msg':
        var user = vueApp.users[arguments[1]];
        if (!user)
          return;
        widget.comment(user.id, user.name, arguments[2]);
        if (user.id === vueApp.myUserID)
          break;
        // 最終発言時間
        if (arguments[2])
          recordInterval(user);
        // 連投あぼーん
        if (arguments[2] && experimentalConfig.spammer && user.commentTimes.length > 1) {
          user.commentInterval = (user.lastCommentTime - user.commentTimes[user.commentTimes.length - 2]) / 1000;
          user.commentIntervalAverage = (user.lastCommentTime - user.commentTimes[0]) / (user.commentTimes.length - 1) / 1000;
          var causeByAverage = experimentalConfig.minMsgIntervalAverage && +experimentalConfig.minMsgIntervalAverage > user.commentIntervalAverage;
          if ((experimentalConfig.minMsgInterval && +experimentalConfig.minMsgInterval > user.commentInterval) || causeByAverage) {
            var tail = ' (' + (causeByAverage ? 'Avg. ' + user.commentIntervalAverage : user.commentInterval) + ')';
            if (experimentalConfig.spammer === 1 && !vueApp.ignoredUserIds.has(user.id)) {
              vueApp.ignoreUser(user.id);
              if (!experimentalConfig.hideSpamAbonMsg)
                systemMessage(user.name + text('を連投一方あぼーんした', ' has been ignored because of spam') + tail);
            } else if (experimentalConfig.spammer === 2) {
              abon(user.id);
              if (!experimentalConfig.hideSpamAbonMsg)
                systemMessage(user.name + text('を連投相互あぼーんした', ' has been blocked because of spam') + tail);
            }
          }
        }
        // 呼び出し通知
        mentionNotification(user, arguments[2]);
        break;
      case 'server-update-current-room-state':
        // 配信通知
        streamStates = arguments[1].streams.map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        // 経路移動
        vueApp.route.next('room');
        moved = false;
        // チェス棋譜
        fens = [];
        break;
      case 'server-update-current-room-streams':
        // 配信通知
        var currentStates = arguments[1].map(s => s.isActive && s.isReady && s.isAllowed && s.userId !== vueApp.myUserID);
        var index = currentStates.findIndex((s, i) => s && !streamStates[i] && !vueApp.takenStreams[i]);
        streamStates = currentStates;
        if (index !== -1) {
          var user = vueApp.users[arguments[1][index].userId];
          streamNotification(user, index);
          widget.streaming(user.id, user.name);
        }
        break;
      // 全部屋ﾙｰﾗ
      case 'server-room-list':
        var streams = 0;
        arguments[1].forEach(room => streams += room.streams.length);
        arguments[1].push(
          {id: 'admin_old', group: 'gikopoi', userCount: '?', streamers: [], streams: +vueApp.serverStats.streamCount <= streams ? [] : [{userName: '?'}]},
          {id: 'badend', group: 'gikopoipoi', userCount: '?', streamers: [], streams: []}
        );
        break;
      case 'server-update-chessboard':
        var state = arguments[1] || {};
        // チェス通知
        if (state[{w: 'whiteUserID', b: 'blackUserID'}[state.turn]] === vueApp.myUserID)
          chessNotification();
        // チェス棋譜
        if (arguments[1].fenString) {
          if (arguments[1].fenString === 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
            fens = [arguments[1].fenString];
          else if (fens[fens.length - 1] !== arguments[1].fenString)
            fens.push(arguments[1].fenString);
          updateFEN();
        }
        break;
      // nimado
      case 'server-stats':
        nimado.count();
        break;
    }
    if (quizWindow && !quizWindow.closed)
      queueMicrotask(() => quizWindow.postMessage(Array.from(arguments), 'https://iwamizawa-software.github.io'));
  };
  var _io = window.io;
  if (_io) {
    window.io = function () {
      var socket = _io.apply(this, arguments);
      socket.prependAny(socketEvent);
      return socket;
    };
    if (vueApp.socket)
      vueApp.socket.prependAny(socketEvent);
  } else {
    (await getObjectAsync(vueApp, 'socket')).prependAny(socketEvent);
  }

} + ')()')).parentNode);
