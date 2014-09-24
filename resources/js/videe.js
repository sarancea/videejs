//Dummy localization
var _ = function (msg) {
    return msg;
};

/**
 * Check if input param is real element
 * @param  a
 * @returns {boolean}
 */
var isElement = function (a) {
    try {
        return a.nodeName ? !0 : !1
    } catch (b) {
        return !1
    }
};


//Load template
function ajaxLoad(src, async, callback) {

    if (!async) {
        async = false;
    }


    var xmlHttp;
    try {

        if (window.XMLHttpRequest) {
            // code for IE7+, Firefox, Chrome, Opera, Safari
            xmlHttp = new XMLHttpRequest();
        } else {
            // code for IE6, IE5
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
        }

        if (async) {
            xmlHttp.onreadystatechange = function () {
                if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
                    callback(xmlHttp.responseText);
                }
            }
        }

        xmlHttp.open("GET", src + '?' + Date.now(), async);
        xmlHttp.send();
    } catch (e) {
        if (console) console.log(e);
        return null;
    }
    if (!async)
        return xmlHttp.responseText;
    return true;
}

/**
 * Template parser
 */
var Template = function () {
    /**
     * @type {{templateContents: {}}}
     */
    var that = {
        templateContents: {},
        templatesList: {}
    };

    that.initActions = function () {
        radioElements();
        dropDownElements();
    };


    var dropDownElements = function () {
        var elList = document.getElementsByClassName('drop-down');
        for (var i = 0; i <= elList.length; i++) {
            if (elList.hasOwnProperty(i.toString())) {
                var dropDownEl = elList[i];
                if (isElement(dropDownEl)) {
                    var ddListEl = (dropDownEl.firstElementChild || dropDownEl.firstChild).nextElementSibling;
                    ddListEl.style.display = 'none';
                    ddListEl.style.position = 'absolute';
                    ddListEl.style.zIndex = 10;

                    if (dropDownEl.addEventListener) {
                        document.addEventListener("click", closeDDElements, false);
                        dropDownEl.addEventListener("click", openDropDownElement, false);
                    } else if (dropDownEl.attachEvent) {
                        document.attachEvent('onclick', closeDDElements);
                        dropDownEl.attachEvent('onclick', openDropDownElement);
                    }
                }
            }
        }
    };

    var closeDDElements = function (event) {
        var hide = false;

        if (event.target.getAttribute('class')
            && event.target.getAttribute('class').match(/drop-down/)) {
            hide = false;
        } else if (event.target.getAttribute('class')
            && event.target.getAttribute('class').match(/drop-down-arrow/)) {

            if (!event.target.getAttribute('opened')) {
                hide = true;
            }

        } else if (event.target.parentNode
            && event.target.parentNode.parentNode
            && (!event.target.parentNode.parentNode.getAttribute('class')
            || !event.target.parentNode.parentNode.getAttribute('class').match(/drop-down/))) {
            hide = true;
        }

        if (hide === true) hideDD();
        event.stopPropagation && event.stopPropagation();
    };

    var hideDD = function () {
        var elList = document.getElementsByClassName('drop-down');
        for (var i = 0; i <= elList.length; i++) {
            if (!elList.hasOwnProperty(i.toString())) {
                return;
            }
            var dropDownEl = elList[i];
            if (!isElement(dropDownEl)) {
                return;
            }
            var ddListEl = (dropDownEl.firstElementChild || dropDownEl.firstChild).nextElementSibling;
            var ddHandler = ddListEl.nextElementSibling;
            if (isElement(ddHandler) && ddHandler.getAttribute('opened') == 'true') {
                ddListEl.style.display = 'none';
                ddHandler.removeAttribute('opened');
            }


        }
    };

    var openDropDownElement = function (event) {
        hideDD();
        var ddListEl = (this.firstElementChild || this.firstChild).nextElementSibling;
        if (!isElement(ddListEl)) {
            return;
        }


        //li elements action add
        for (var j in ddListEl.children) {
            if (!ddListEl.children.hasOwnProperty(j)) {
                continue;
            }
            var liEl = ddListEl.children[j];
            if (!isElement(liEl)) {
                continue;
            }

            if (liEl.addEventListener) {
                liEl.addEventListener("click", selectDDElement, false);
            } else if (liEl.attachEvent) {
                liEl.attachEvent('onclick', selectDDElement);
            }
        }

        var ddHandler = ddListEl.nextElementSibling;

        if (isElement(ddHandler))
            ddHandler.setAttribute('opened', 'true');
        ddListEl.style.display = 'block';
        event.stopPropagation && event.stopPropagation();
    };

    that.selectProcessSelection = function (ul) {
        var container = ul.previousElementSibling;

        var selectedNumber = 0;
        var totalNumber = 0;

        for (var i in ul.children) {
            if (!ul.children.hasOwnProperty(i)) {
                continue;
            }
            var liEl = ul.children[i];

            if (!isElement(liEl)) {
                continue;
            }

            if (typeof liEl.getAttribute('selected') == 'string') {
                selectedNumber++;
            }

            totalNumber++;
        }

        if (selectedNumber == totalNumber) {
            if (container.getAttribute('init-value'))
                container.innerHTML = _(container.getAttribute('init-value'));
            else
                container.innerHTML = _(selectedNumber + ' of ' + totalNumber + ' selected');
        } else if (selectedNumber == 0) {
            container.innerHTML = _('Please select');
        }
        else {
            if (selectedNumber == 1) {
                container.innerHTML = _(selectedNumber + ' of ' + totalNumber + ' selected');
            } else {
                container.innerHTML = _(selectedNumber + ' of ' + totalNumber + ' selected');
            }
        }
    };

    var selectDDElement = function (event) {

        if (typeof this.getAttribute('selected') == 'string')
            this.removeAttribute('selected');
        else
            this.setAttribute('selected', 'selected');

        var fireEvent; // The custom event that will be created

        if (document.createEvent) {
            fireEvent = document.createEvent("HTMLEvents");
            fireEvent.initEvent("change", true, true);
        } else {
            fireEvent = document.createEventObject();
            fireEvent.eventType = "change";
        }

        fireEvent.eventName = "change";

        if (document.createEvent) {
            this.parentNode.dispatchEvent(fireEvent);
        } else {
            this.parentNode.fireEvent("on" + fireEvent.eventType, fireEvent);
        }

        Template.selectProcessSelection(this.parentNode);

        event.stopPropagation && event.stopPropagation();
    };

    var radioElements = function () {
        var elList = document.getElementsByClassName('radio');
        for (var i = 0; i <= elList.length; i++) {
            if (!elList.hasOwnProperty(i.toString())) {
                return;
            }
            var radioEl = elList[i];
            if (!isElement(radioEl)) {
                return;
            }
            if (radioEl.addEventListener) {
                radioEl.addEventListener("click", toggleRadioElement, false);
            } else if (radioEl.attachEvent) {
                radioEl.attachEvent('onclick', toggleRadioElement);
            }
        }
    };

    var toggleRadioElement = function () {
        if (isElement(this))
            if (!(this.getAttribute('checked') == 'checked')) { // do nothing with already checked elements
                var sameNameElements = document.getElementsByName(this.getAttribute('name'));
                for (var i = 0; i <= sameNameElements.length; i++) {
                    if (sameNameElements.hasOwnProperty(i.toString())) {

                        if (isElement(sameNameElements[i]) && sameNameElements[i].getAttribute('checked'))
                            sameNameElements[i].removeAttribute('checked');
                    }
                }

                this.setAttribute('checked', 'checked');
                var event; // The custom event that will be created

                if (document.createEvent) {
                    event = document.createEvent("HTMLEvents");
                    event.initEvent("checked", true, true);
                } else {
                    event = document.createEventObject();
                    event.eventType = "checked";
                }

                event.eventName = "checked";

                if (document.createEvent) {
                    this.dispatchEvent(event);
                } else {
                    this.fireEvent("on" + event.eventType, event);
                }
            }
    };

    that.get = (function (name) {

        if (!Template.templatesList[name]) return false;

        var obj = {};

        obj.parse = function (params) {

            if (typeof Template.templateContents[name] == 'undefined') {
                Template.templateContents[name] = ajaxLoad(Template.templatesList[name]);
            }

            var tmpData = Template.templateContents[name];
            for (var i in params) {
                if (!params.hasOwnProperty(i)) {
                    continue;
                }

                if (typeof params[i] == "string") //replace string values
                    tmpData = tmpData.replace('{{' + i + '}}', params[i]);

                if (typeof params[i] == "object") {
                    var rg = new RegExp("\\[" + i + "\\[(.*)\\]\\]", "ig");
                    var searchRes = tmpData.match(rg);
                    if (searchRes) {
                        var replaceName = searchRes[0];
                        //get name value pair
                        var keyValuePair = replaceName.match(/\[[^\[]*\]/ig)[0].replace(/[\],\[]/g, '');

                        if (keyValuePair.length > 0) {
                            keyValuePair = keyValuePair.toLowerCase().split(':');
                        }

                        var replaceStr = '';

                        for (var j in params[i]) {
                            if (!params[i].hasOwnProperty(j)) {
                                continue;
                            }

                            var paramValue = params[i][j];
                            if (typeof paramValue == "string") {
                                replaceStr += '<li value="' + params[i][j] + '" >' + params[i][j] + '</li>'
                            } else {
                                if (keyValuePair.length == 0) {
                                    //do nothing here
                                    throw 'Object received. No instructions to parse it as select box.';
                                } else {
                                    replaceStr += '<li value="' + params[i][j][keyValuePair[0]] + '" >' + params[i][j][keyValuePair[1]] + '</li>'
                                }
                            }
                        }

                        tmpData = tmpData.replace(replaceName, replaceStr);
                    }
                }

            }
            return tmpData;
        };

        return obj;
    });

    return that;
}();

/**
 * JsonP call
 */
var JsonP = (function () {
    var that = {};

    that.send = function (src, options) {
        var callback_name = options.callbackName || 'jsonP' + Date.now(),
            on_success = options.onSuccess || function () {
                },
            on_timeout = options.onTimeout || function () {
                },
            timeout = options.timeout || 60; // sec

        var timeout_trigger = window.setTimeout(function () {
            window[callback_name] = function () {
            };
            on_timeout();
        }, timeout * 1000);

        window[callback_name] = function (data) {
            window.clearTimeout(timeout_trigger);
            on_success(data);
        };

        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = src + '&callback=' + callback_name;

        document.getElementsByTagName('head')[0].appendChild(script);
    };

    return that;
})();

/**
 * Vertamedia Videe class
 */
var Videe = function (element, tokenKey, domain) {

        //Check OS is MacLike
        var isMacLike = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i);
        var isIOS = navigator.platform.match(/(iPhone|iPod|iPad)/i);

        /**
         * Last search query string
         */
        var lastSearchQuery;

        /**
         * CDN ROOT URL
         */
        var cdnUrl = 'http://209343044.r.cdnsun.net/';
        var videoStaticUrl = 'rtmp://video.cdnsun.net/593428229/_definst_/mp4:593428229/';

        try {
            //temporary solution to get actual links to CDN
            var cdnLinks = JSON.parse(ajaxLoad('http://sit.vertamedia.com/api/domain/cdn'));
            cdnUrl = 'http://' + cdnLinks.items.static + '/';
            //videoStaticUrl = 'rtmp://' + cdnLinks.items.video + '/';
        } catch (e) {
            cdnUrl = 'http://209343044.r.cdnsun.net/';
        }


        /**
         * @type {number}
         */

        var videoListPage = 0;

        /**
         * Search active flag
         */
        var searchActive = false;

        /**
         * Video Item Object
         * @type {Util}
         */
        var videoItemAbstract = Object.create(Util);
        videoItemAbstract.extend({
            id: null,
            imagePrefix: cdnUrl + 'pcovers/',
            categories: null,
            description: null,
            image: null,
            length: null,
            title: null,
            element: null,
            selectedElement: null,
            render: function (listEl) {
                if (!isElement(listEl)) {
                    return false;
                }
                var videoEl = document.createElement('li');
                videoEl.className = 'video';
                videoEl.setAttribute('video-id', this.id);

                var videoImageEl = document.createElement('div');
                videoImageEl.className = 'image-bg';

                var videoImageSubEl = document.createElement('img');
                videoImageSubEl.className = 'image';
                videoImageSubEl.setAttribute('src', this.imagePrefix + this.image);


                var videoTitleEl = document.createElement('div');
                videoTitleEl.className = 'title';
                videoTitleEl.innerHTML = this.title;

                var videoCategoryEl = document.createElement('div');
                videoCategoryEl.className = 'category';
                if (this.categories)
                    videoCategoryEl.innerHTML = this.categories.name;

                videoTitleEl.appendChild(videoCategoryEl);

                var addToExportButton = document.createElement('div');
                addToExportButton.className = 'add_video';


                if (document.getElementById('custom_export').getAttribute('checked')) {
                    addToExportButton.style.display = 'block';
                }

                if (addToExportButton.addEventListener) {
                    addToExportButton.addEventListener("click", this.moveToExport.bind(this), false);
                } else if (addToExportButton.attachEvent) {
                    addToExportButton.attachEvent('onclick', this.moveToExport.bind(this));
                }

                var removeFromExportButton = document.createElement('div');
                removeFromExportButton.className = 'remove_video';

                videoEl.appendChild(videoImageSubEl);
                videoEl.appendChild(videoImageEl);
                videoEl.appendChild(videoTitleEl);
                videoEl.appendChild(addToExportButton);
                videoEl.appendChild(removeFromExportButton);
                listEl.appendChild(videoEl);
                this.element = videoEl;
                return true;
            },

            moveToExport: function () {
                var el = this.element.cloneNode(true);
                //this.element.style.display = 'none';

                document.getElementById('selected-video-list').appendChild(el);
                this.selectedElement = el;


                var removeFromExportButton = this.selectedElement.getElementsByClassName('remove_video')[0];
                removeFromExportButton.style.display = 'block';
                this.selectedElement.getElementsByClassName('add_video')[0].style.display = 'none';

                if (removeFromExportButton.addEventListener) {
                    removeFromExportButton.addEventListener("click", this.removeFromExport.bind(removeFromExportButton, this.length, this.convertSecondsToString), false);
                } else if (removeFromExportButton.attachEvent) {
                    removeFromExportButton.attachEvent('onclick', this.removeFromExport.bind(removeFromExportButton, this.length, this.convertSecondsToString));
                }

                var videoCountEl = document.getElementById('videos_count');
                var videoCount = parseInt(videoCountEl.innerHTML, 10);
                videoCountEl.innerHTML = ++videoCount;


                var videoDurationEl = document.getElementById('video_duration');
                var currentDuration = parseInt(videoDurationEl.getAttribute('seconds'), 10);
                currentDuration += this.length;
                videoDurationEl.setAttribute('seconds', currentDuration.toString());
                videoDurationEl.innerHTML = this.convertSecondsToString(currentDuration);

            },
            convertSecondsToString: function (s) {
                var sec_num = parseInt(s, 10); // don't forget the second param
                var hours = Math.floor(sec_num / 3600);
                var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
                var seconds = sec_num - (hours * 3600) - (minutes * 60);

                if (hours < 10) {
                    hours = "0" + hours;
                }
                if (minutes < 10) {
                    minutes = "0" + minutes;
                }
                if (seconds < 10) {
                    seconds = "0" + seconds;
                }
                return hours + ':' + minutes + ':' + seconds;
            },

            removeFromExport: function (length, convertSecondsToString) {
                this.parentNode.remove();

                var videoCountEl = document.getElementById('videos_count');
                var videoCount = parseInt(videoCountEl.innerHTML, 10);
                videoCountEl.innerHTML = --videoCount;

                var videoDurationEl = document.getElementById('video_duration');
                var currentDuration = parseInt(videoDurationEl.getAttribute('seconds'), 10);
                currentDuration -= length;
                videoDurationEl.setAttribute('seconds', currentDuration.toString());
                videoDurationEl.innerHTML = convertSecondsToString(currentDuration);

            }
        });

        /**
         * Settings for plugin
         */
        var pluginSettings = Object.create(Util);
        pluginSettings.extend({
            categories: {},
            languages: 0,
            playlist: false,
            exportType: 'dynamic',
            showLogo: 0,
            enabled: 0,
            size: 0,
            autoplay: 0,
            serialise: function () {

                var str = 'params[size]=' + this.size + '&params[showLogo]=' + this.showLogo + '&params[autoPlay]=' + this.autoplay;
                if (this.exportType == 'dynamic') {
                    for (var i in this.categories) {
                        if (typeof this.categories[i].id != 'undefined')
                            str += '&categories[]=' + this.categories[i].id;
                    }

                    for (var j in this.languages) {
                        if (typeof this.languages[j].id != 'undefined')
                            str += '&languages[]=' + this.languages[j].id;
                    }
                } else {
                    for (var k in this.playlist) {
                        str += '&playlist[]=' + this.playlist[k];
                    }
                }

                return str;
            },
            pushToService: function () {
                this.fillUsingFormData();

                document.getElementById('videe-player-preview-loader').setAttribute('class', 'loading');

                JsonP.send(service.saveSettingsUrl + '?auth_token=' + getToken() + '&domain=' + domain + '&' + this.serialise(), {
                    onSuccess: function (data) {
                        var previewEl = document.getElementById('videe-player-preview');
                        if (previewEl && isElement(previewEl)) {
                            var videeClass = new Videe(previewEl, getToken(), domain);
                            videeClass.initWidget();
                        }
                        document.getElementById('videe-player-preview-loader').removeAttribute('class');
                        document.getElementById('generate_code').removeAttribute('disabled');

                        var size = pluginSettings.size.toLowerCase().split('x');
                        if (size.length != 2) {
                            size = ['100%', '100%'];
                        }
                        document.getElementById('embed-code').value = '<iframe scrolling="no" height="' + size[0] +
                        '" width="' + size[1] + '"  src="' + presets.iframeUrl + '?token=' + getToken() + '"></iframe>';
                    },
                    onTimeout: function () {
                        document.getElementById('videe-player-preview-loader').removeAttribute('class');
                        document.getElementById('generate_code').removeAttribute('disabled');
                        showError('Request timeout while saving settings.');
                    }
                });
            },
            save: function () {
                //Call settings save callback function
                if (typeof settings.onSettingsSave == 'function')
                    settings.onSettingsSave(pluginSettings);
            },
            fillUsingFormData: function () {
                //getExportType
                var dExportTypeEl = document.getElementById('dynamic_export');
                if (dExportTypeEl && isElement(dExportTypeEl)) {
                    this.exportType = 'custom';
                    if (dExportTypeEl.hasAttribute('checked')) {
                        this.exportType = 'dynamic';
                    }
                }

                //getPlaylistVideoIds
                var selectedVideoListEl = document.getElementById('selected-video-list');
                if (selectedVideoListEl && isElement(selectedVideoListEl)) {
                    this.playlist = [];
                    var liElList = selectedVideoListEl.getElementsByTagName('li');
                    for (var k = 0; k <= liElList.length; k++) {
                        if (!liElList.hasOwnProperty(k)) {
                            continue;
                        }
                        if (!liElList[k].hasAttribute('video-id')) {
                            continue;
                        }

                        this.playlist.push(liElList[k].getAttribute('video-id'));

                    }
                }

                //get categories
                var optionCEl = document.getElementById('videe-setting-category');
                if (optionCEl && isElement(optionCEl)) {
                    var optionsC = getMultipleSelect(optionCEl);
                    this.categories = [];
                    for (var ic in optionsC) {
                        this.categories.push({id: optionsC[ic].value, name: optionsC[ic].innerHTML});
                    }
                }

                //get languages
                var optionsLEl = document.getElementById('videe-setting-language');
                if (optionsLEl && isElement(optionsLEl)) {
                    var optionsL = getMultipleSelect(optionsLEl);
                    this.languages = [];
                    for (var il in optionsL) {
                        this.languages.push({id: optionsL[il].value, name: optionsL[il].innerHTML});
                    }
                }


                //get size
                var widthEl = document.getElementById('p_width');
                var heightEl = document.getElementById('p_height');

                if (widthEl && heightEl) {
                    this.size = '';
                    this.size = heightEl.value + 'x' + widthEl.value;
                }

                //get autoplay
                var autoplayOn = document.getElementById('autoplay');
                if (autoplayOn && isElement(autoplayOn)) {
                    this.autoplay = 0;
                    if (autoplayOn.checked) {
                        this.autoplay = 1;
                    }
                }

                var showLogoEl = document.getElementById('show_logo');
                if (showLogoEl && isElement(showLogoEl)) {
                    this.showLogo = 0;
                    if (showLogoEl.checked) {
                        this.showLogo = 1;
                    }
                }

            }
        });

        /**
         *  Global settings
         */
        var settings = {
            keyReceivedCallback: defaultKeyProcessor
        };


        var videoListStorage = {};

        /**
         * Settings URL
         */
        var cdnPlaylistPath = cdnUrl + 'playlists/';

        /**
         * Settings URL
         */
        var cdnSettingsPath = cdnUrl + 'publishers/';

        //Path to the templates folder
        var templatesDir = './templates/';

        // VideoJS urls
        var videoJS = './resources/libs/video.js';
        var videoJsAds = './resources/libs/videojs.ads.js';
        var videoJsVastClient = './resources/libs/vast-client.js';
        var videoJsVast = './resources/libs/videojs.vast.js';
        var videoJsPlaylist = './resources/libs/videojs-playlist.js';

        var videoJsCss = './resources/css/video-js.css';
        var videoJsCssVast = './resources/css/videojs.vast.css';

        // Search indicator
        var searching = false;

        /**
         * Templates list
         */
        var templates = {
            start: templatesDir + 'start.html',
            player_config: templatesDir + 'player_config.html',
            playlist_config: templatesDir + 'playlist_config.html'

        };

        var service = {
            activationUrl: 'http://sit.vertamedia.com/api/domain/sAuth',
            saveSettingsUrl: 'http://sit.vertamedia.com/api/domain/playlist',
            languagesListUrl: 'http://sit.vertamedia.com/api/domain/sGetLanguages',
            categoriesListUrl: 'http://sit.vertamedia.com/api/domain/sGetCategories',
            searchVideosUrl: 'http://sit.vertamedia.com/api/domain/search'
        };

        var presets = {
            registrationUrl: 'http://vertamedia.com/signup.html#publisher',
            passBackUrl: document.URL,
            iframeUrl: document.location.protocol + '//' + document.location.host + document.location.pathname.split('/').slice(0, -1).join('/') + '/iframe.html',
            skinsList: ['six', 'beelden', 'bekle', 'five', 'glow', 'roundster', 'stormtrooper', 'vapor'],
            languagesList: [],
            categoriesList: [],
            pageLimit: 25
        };


        /**
         * Initiate widget
         */
        this.initWidget = function () {
            //We should load settings
            if (loadSettingsUsingToken(false)) {
                if (pluginSettings.enabled == 0) {
                    element.innerHTML = '<span>[Videe] Plugin is not enabled.</span>';
                    return;
                }

                loadStylesheet(videoJsCss);
                loadStylesheet(videoJsCssVast);

                loadScript(videoJS, function () {
                    loadScript(videoJsAds, function () {
                        loadScript(videoJsVastClient, function () {
                            loadScript(videoJsVast, function () {

                                loadScript(videoJsPlaylist, loadWidget);
                            });
                        });
                    });

                }); //todo lode ViveoJS


            }
        };

        /**
         * Initiate configuration screen for Videe
         */
        this.initConfigurationScreen = function (configuration) {

            if (configuration) {
                settings.onActivation = configuration.onActivation || function () {
                };
                settings.onDeactivation = configuration.onDeactivation || function () {
                };
                settings.onSettingsSave = configuration.onSettingsSave || function () {
                };
                settings.onErrorKey = configuration.onErrorKey || function () {
                };
            }


            //If we have not token, show authorization form
            if (!getToken()) {
                displayStartForm(); //Build start form
            } else {
                //We should load settings
                if (loadSettingsUsingToken(true))
                    loadConfigurationForm();
            }
        };


        //Embed configured jwPlayer into
        function loadWidget() {

            var videos = [];
            //Get size
            var size = pluginSettings['size'].toLowerCase().split('x');
            var height = 360;
            var width = 640;

            if (typeof size != 'undefined' && size.length) {
                if (typeof size[0] != 'undefined')
                    height = size[0];
                if (typeof size[1] != 'undefined')
                    width = size[1];
            }

            if (parseInt(height) == height) {
                height += 'px';
            }

            if (parseInt(width) == width) {
                width += 'px';
            }

            //generate a playlist
            var playlistData = ajaxLoad(cdnSettingsPath + getToken() + '/playlist' + base64_encode(domain) + '.json');

            var videosList = JSON.parse(playlistData);

            if (videosList.success == true && videosList.items) {
                for (var i in videosList.items) {
                    if (!videosList.items.hasOwnProperty(i)) {
                        continue;
                    }
                    var videoItem = videosList.items[i]; //todo VIDEOLIST GETS HERE
                    var videoContainer = [cdnUrl + 'pvideo/' + videoItem['mp4']];

                    if (!isMacLike && !isIOS) {
                        videoContainer.push(cdnUrl + 'pvideo/' + videoItem['webm']);
                    }

                    videos.push({
                        src: videoContainer,
                        poster: videoItemAbstract.imagePrefix + videoItem['image'],
                        title: videoItem['title']
                    });
                }
            }


            var _element = element.parentNode;

            _element.style.width = width;
            _element.style.height = height;

            videojs.options.flash.swf = "./resources/libs/video-js.swf";
            var video = videojs(element.getAttribute("id"), {});
            video.autoplay(pluginSettings.autoplay);
            video.controls(true);
            video.playList(videos);
            video.ads();
            video.vast({
                url: pluginSettings.vastTag
            });
        }

        function base64_encode(data) {

            var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
                ac = 0,
                enc = '',
                tmp_arr = [];

            if (!data) {
                return data;
            }

            do { // pack three octets into four hexets
                o1 = data.charCodeAt(i++);
                o2 = data.charCodeAt(i++);
                o3 = data.charCodeAt(i++);

                bits = o1 << 16 | o2 << 8 | o3;

                h1 = bits >> 18 & 0x3f;
                h2 = bits >> 12 & 0x3f;
                h3 = bits >> 6 & 0x3f;
                h4 = bits & 0x3f;

                // use hexets to index into b64, and append result to encoded string
                tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
            } while (i < data.length);

            enc = tmp_arr.join('');

            var r = data.length % 3;

            return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);
        }


        /**
         * Function to retrieve settings using access token
         */
        function loadSettingsUsingToken(loadSettingsScreen) {

            try {
                var configurationData = ajaxLoad(cdnSettingsPath + getToken() + '/settings' + base64_encode(domain) + '.json');
                var decodedConfigurationData = JSON.parse(configurationData);
            } catch (e) {
                reset();
                showError('Can not retrieve your Videe configuration.');
                return false;
            }

            if (!decodedConfigurationData) {
                reset();
                showError('Can not retrieve your Videe configuration.');
                return false;
            }

            if (decodedConfigurationData.success && decodedConfigurationData.success == true) {

                //store configuration
                decodedConfigurationData.items.cdnTag = cdnSettingsPath + getToken() + '/playlist' + base64_encode(domain) + '.json';

                pluginSettings.extend(decodedConfigurationData.items);
                pluginSettings.autoplay = decodedConfigurationData.items['autoPlay'];

                //var playlistData = ajaxLoad(pluginSettings.cdnTag);


                if (loadSettingsScreen && configurationDataIsLoaded()) {
                    pluginSettings.save();
                    showSelectedSettings();
                }
            } else {
                reset();
                showError('Provided token is not valid.');
                return false;
            }
            return true;
        }


        /**
         * Returns token or false
         * @returns {boolean}|{string}
         */
        function getToken() {
            return typeof tokenKey == 'undefined' ? false : tokenKey;
        }


        /**
         * Default success callback
         * @param data
         */
        function defaultKeyProcessor(data) {
            if (!data || typeof data.success == 'undefined') {
                document.getElementById('videe-activation-form-submit').removeAttribute('disabled');
                showError('Unknown response');
                return;
            }
            if (!data.success) {
                document.getElementById('videe-activation-form-submit').removeAttribute('disabled');
                showError('Provided token is not valid.');
                if (typeof  settings.onErrorKey == 'function') {
                    settings.onErrorKey(data);
                }
                return;
            }
            //set domain
            domain = data.items.url;
            //set token
            tokenKey = settings.sentToken;
            settings.sentToken = null;
            //store configuration
            pluginSettings.extend(data.items);
            pluginSettings.autoplay = data.items['autoPlay'];
            pluginSettings.save();

            if (typeof settings.onActivation == 'function') {
                settings.onActivation(tokenKey, data);
            }

            if (loadSettingsUsingToken(true))
            //Show configuration form
                loadConfigurationForm();

        }

        function loadStylesheet(uri) {
            var style = document.createElement('link');
            style.setAttribute('rel', 'stylesheet');
            style.setAttribute('href', uri);

            document.getElementsByTagName("head")[0].appendChild(style);
        }

        /**
         * Load a script and run callback function
         * @param url
         * @param callback
         */
        function loadScript(url, callback) {
            callback = callback || function () {
            };
            var script = document.createElement("script");
            script.type = "text/javascript";

            if (script.readyState) {  //IE
                script.onreadystatechange = function () {
                    if (script.readyState == "loaded" ||
                        script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {  //Others
                script.onload = function () {
                    callback();
                };
            }

            script.src = url;
            document.getElementsByTagName("head")[0].appendChild(script);
        }

        /**
         * Show error message
         * @param message
         */
        function showError(message) {
            var errorElement = document.getElementById('videe-error-message');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.innerHTML = '<p>' + message + '</p>';

                setTimeout(function () {
                    document.getElementById('videe-error-message').style.display = 'none'
                }, 3000);

            } else {
                alert(message);
            }
        }

        /**
         * Key activation form handler
         * @param event
         */
        function keyActivationFormHandler(event) {

            var valid = true;
            var token = document.getElementById('key').value;
            var domainName = document.getElementById('domain').value;

            if (token.length == 0) {
                showError('Key field should not be empty.');
                valid = false;
            }

            if (domainName.length == 0) {
                showError('Domain field should not be empty.');
                valid = false;
            }

            settings.sentToken = token;

            if (valid) {
                document.getElementById('videe-activation-form-submit').setAttribute('disabled', 'disabled');
                //Send jsonP request
                JsonP.send(service.activationUrl + '?auth_token=' + token + '&domain=' + domainName,
                    {
                        onSuccess: settings.keyReceivedCallback,
                        onTimeout: function () {
                            showError('Request timeout')
                        }
                    }
                );
            }
            event.preventDefault && event.preventDefault();
            event.returnValue = false;
        }

        /**
         * Reset plugin
         */
        function reset() {
            //Token reset
            tokenKey = null;

            //Presets reset
            presets.languagesList = [];
            presets.categoriesList = [];
        }


        /**
         * Display configuration form.
         */
        function loadConfigurationForm() {

            //Check categories
            if (presets.languagesList.length <= 0) {
                receiveLanguagesList();
            }

            //Check languages
            if (presets.categoriesList.length <= 0) {
                receiveCategoriesList();
            }

            if (configurationDataIsLoaded())
                showPlaylistConfigurationForm();

        }

        /**
         * Pagination Event Handler
         * @param event
         */
        function videoListPagination(event) {
            if (searchActive == true) {
                var pxLeft = (event.target.scrollHeight - (event.target.clientHeight + event.target.scrollTop));
                if (pxLeft < 1000 && !searching) {
                    loadVideosFromSearch(++videoListPage, lastSearchQuery);
                }
            }
        }

        /**
         * Remove videos selected for custom export
         */
        function deleteAllSelectedVideos() {
            var clickEvent;

            if (document.createEvent) {
                clickEvent = document.createEvent("HTMLEvents");
                clickEvent.initEvent("click", true, true);
            } else {
                clickEvent = document.createEventObject();
                clickEvent.eventType = "click";
            }

            clickEvent.eventName = "click";

            var selectedVideosElList = document.getElementsByClassName('selected-video-list')[0].getElementsByClassName('remove_video');

            for (var i = (selectedVideosElList.length - 1); i >= 0; i--) {
                if (selectedVideosElList.hasOwnProperty(i)) {
                    if (document.createEvent) {
                        selectedVideosElList[i].dispatchEvent(clickEvent);
                    } else {
                        selectedVideosElList[i].fireEvent("on" + clickEvent.eventType, clickEvent);
                    }
                }
            }

        }

        /**
         * Show form
         */
        function showPlayerConfigurationForm() {
            element.innerHTML = Template.get('player_config').parse(presets);
            Template.initActions();

            var generateCodeButton = document.getElementById('generate_code');

            if (generateCodeButton && isElement(generateCodeButton)) {
                if (generateCodeButton.addEventListener) {
                    generateCodeButton.addEventListener("click", generateCode, false);
                } else if (generateCodeButton.attachEvent) {
                    generateCodeButton.attachEvent('onclick', generateCode);
                }
            }

            var textareaEl = document.getElementById('embed-code');
            if (textareaEl) {
                if (textareaEl.addEventListener) {
                    textareaEl.addEventListener("click", function () {
                        this.select();
                    }, false);
                } else if (textareaEl.attachEvent) {
                    textareaEl.attachEvent('onclick', function () {
                        this.select();
                    });
                }
            }

            showPlayerSettings();
        }

        /**
         * Plugin configuration save method
         */
        function generateCode() {
            document.getElementById('generate_code').setAttribute('disabled', 'disabled');
            pluginSettings.pushToService();
        }


        function playlistFormHandler() {
            //Save selected data
            pluginSettings.fillUsingFormData();
            showPlayerConfigurationForm();
        }

        /**
         * Show form
         */
        function showPlaylistConfigurationForm() {

            element.innerHTML = Template.get('playlist_config').parse(presets);
            Template.initActions();

            //Video list scroll event
            var videoListEl = document.getElementById('video-list');
            videoListEl.scrollTop = 0;
            if (videoListEl) {
                if (videoListEl.addEventListener) {
                    videoListEl.addEventListener("scroll", videoListPagination, false);
                } else if (videoListEl.attachEvent) {
                    videoListEl.attachEvent('onscroll', videoListPagination);
                }
            }


            //Delete all selected videos
            var deleteAllVideosEl = document.getElementById('delete_all');

            if (deleteAllVideosEl) {
                if (deleteAllVideosEl.addEventListener) {
                    deleteAllVideosEl.addEventListener("click", deleteAllSelectedVideos, false);
                } else if (videoListEl.attachEvent) {
                    deleteAllVideosEl.attachEvent('onclick', deleteAllSelectedVideos);
                }
            }


            //Search button handler
            var searchButton = document.getElementById('search-action');


            if (searchButton) {
                if (searchButton.addEventListener) {
                    searchButton.addEventListener("click", searchVideosAction, false);
                } else if (searchButton.attachEvent) {
                    searchButton.attachEvent('onclick', searchVideosAction);
                }
            }

            var searchField = document.getElementById('search-field');
            if (searchField) {
                if (searchField.addEventListener) {
                    searchField.addEventListener("keydown", searchVideosAction, false);
                } else if (searchField.attachEvent) {
                    searchField.attachEvent('onkeydown', searchVideosAction);
                }
            }

            var radioElList = document.getElementsByClassName('radio-export');

            for (var i = 0; i <= radioElList.length; i++) {
                if (!radioElList.hasOwnProperty(i)) {
                    continue;
                }

                var radioExportEl = radioElList[i];

                if (isElement(radioExportEl)) {
                    if (radioExportEl.addEventListener) {
                        radioExportEl.addEventListener("checked", exportModeSelection, false);
                    } else if (radioExportEl.attachEvent) {
                        radioExportEl.attachEvent('onchecked', exportModeSelection);
                    }
                }

            }

            disableSearch();

            if (searchField) {
                if (searchField.addEventListener) {
                    searchField.addEventListener("keydown", searchVideosAction, false);
                } else if (searchField.attachEvent) {
                    searchField.attachEvent('onkeydown', searchVideosAction);
                }
            }


            var actionButtons = document.getElementsByClassName('player_config');
            for (var k = 0; k <= actionButtons.length; k++) {
                if (actionButtons.hasOwnProperty(k)) {
                    if (actionButtons[k].addEventListener) {
                        actionButtons[k].addEventListener("click", playlistFormHandler, false);
                    } else if (actionButtons[k].attachEvent) {
                        actionButtons[k].attachEvent('onclick', playlistFormHandler);
                    }
                }
            }

            showPlaylistSettings();

        }

        /**
         * Export mode event listener
         * @param event
         */
        function exportModeSelection(event) {
            var show = 'none';

            var tabsList = document.getElementsByClassName('export');

            for (var i = 0; i <= tabsList.length; i++) {
                if (!tabsList.hasOwnProperty(i.toString())) {
                    continue;
                }
                tabsList[i].style.display = 'none';
            }

            document.getElementById(event.target.getAttribute('value')).style.display = 'block';

            if (event.target.getAttribute('value') == 'custom') {
                show = 'block';
                enableSearch();
            } else {
                disableSearch();
                deleteAllSelectedVideos();
            }

            var elList = document.getElementsByClassName('add_video');
            for (var j = 0; j <= elList.length; j++) {
                if (!elList.hasOwnProperty(j.toString())) {
                    continue;
                }
                elList[j].style.display = show;
            }
        }

        /**
         * Remove search possibility
         */
        function disableSearch() {
            document.getElementById('search-field').setAttribute('disabled', 'disabled');
            searchActive = -1;
        }

        /**
         * Add search functionality
         */
        function enableSearch() {
            document.getElementById('search-field').removeAttribute('disabled');
            searchActive = false;
        }

        /**
         * Search videos
         * @param event
         */
        function searchVideosAction(event) {

            if (typeof searchActive == 'boolean') {
                searchActive = true;
                if (event.keyCode) {
                    if (event.keyCode != 13) { //Enter Key pressed
                        return false;
                    }
                }
                var searchField = document.getElementById('search-field');

                if (!isElement(searchField)) {
                    if (console) console.log('Search field is missing');
                    return false;
                }

                if (!searchField.value || searchField.value.length <= 0) {
                    if (console) console.log('Empty value received: ' + searchField.getAttribute('value'));
                    return false;
                }

                //clear video list areas
                document.getElementById('video-list').innerHTML = '';

                loadVideosFromSearch(0, searchField.getAttribute('value'));

            }
            event.preventDefault && event.preventDefault();
            event.returnValue = false;
            return false;
        }

        /**
         * Show video files received from search query
         *
         * @param page
         * @param query
         */
        function loadVideosFromSearch(page, query) {

            if (searching) {
                return;
            }

            if (typeof page == 'undefined') {
                page = 0;
            }

            videoListPage = page;
            lastSearchQuery = query;


            var videosListEl = document.getElementById('video-list');
            var loaderEl = document.createElement('li');
            loaderEl.className = 'loader';
            loaderEl.innerHTML = '<p id="loading">Loading<span>.</span><span>.</span><span>.</span></p>';
            videosListEl.appendChild(loaderEl);

            searching = true;
            JsonP.send(service.searchVideosUrl + '?auth_token=' + getToken() + '&domain=' + domain
                + '&query=' + encodeURI(query)
                + '&limit=' + presets.pageLimit + '&start=' + (videoListPage * presets.pageLimit),
                {
                    onSuccess: showVideos,
                    onTimeout: function () {
                        searching = false;
                        document.getElementsByClassName('loader').remove();
                        showError('Search request timed out.')
                    }
                });
        }

        /**
         * Show videos received from search query
         * @param data
         * @returns {boolean}
         */
        function showVideos(data) {
            searching = false;
            document.getElementsByClassName('loader').remove();

            if (typeof data != "object") {
                return false;
            }

            if (!data.success || data.success !== true) {
                return false;
            }

            if (!data.items) {
                return false;
            }

            var videosListEl = document.getElementById('video-list');

            if (!videosListEl || !isElement(videosListEl)) {
                return false;
            }

            if (videoListPage == 0 && data.total) {
                initPagination(data.total);
            }

            for (var i in data.items) {
                if (!data.items.hasOwnProperty(i)) {
                    continue;
                }

                var videoObject = Object.create(videoItemAbstract);
                videoObject.extend(data.items[i]);
                videoObject.render(videosListEl);
            }

            return true;
        }

        /**
         * Pagination function
         * @param total
         */
        function initPagination(total) {
            //@todo In case we will need pagination
            //var pagesTotal = Math.ceil(total / presets.pageLimit);
        }

        /**
         * Push settings to form elements
         */
        function showPlayerSettings() {
            //show enabled info
            if (pluginSettings.enabled)
                document.getElementById('videe-enable-message').remove();

            var autoplayEl = document.getElementById('autoplay');
            if (pluginSettings.autoplay == 1) {
                autoplayEl.setAttribute('checked', 'checked');
            }

            var showLogoEl = document.getElementById('show_logo');
            if (pluginSettings.showLogo == 1) {
                showLogoEl.setAttribute('checked', 'checked');
            }

            if (pluginSettings.size && pluginSettings.size.match(/x/i)) {
                var playerSize = pluginSettings.size.toLowerCase().split('x');

                var heightEl = document.getElementById('p_height');
                heightEl.value = playerSize[0];

                var widthEl = document.getElementById('p_width');
                widthEl.value = playerSize[1];
            }
        }

        /**
         * Show playlist settings
         */
        function showPlaylistSettings() {

            //show enabled info
            if (pluginSettings.enabled)
                document.getElementById('videe-enable-message').remove();

            //show categories
            var categoryEl = document.getElementById('videe-setting-category');

//        if (typeof pluginSettings.categories != 'undefined') {
            setMultipleSelect(categoryEl, []);
//        }


            if (categoryEl.addEventListener) {
                categoryEl.addEventListener("change", loadVideosHandler, false);
            } else if (categoryEl.attachEvent) {
                categoryEl.attachEvent('onchange', loadVideosHandler);
            }

//        //show languages
            var languageEl = document.getElementById('videe-setting-language');
//        if (typeof pluginSettings.languages != 'undefined') {
            setMultipleSelect(languageEl, []);
//        }

            if (languageEl.addEventListener) {
                languageEl.addEventListener("change", loadVideosHandler, false);
            } else if (languageEl.attachEvent) {
                languageEl.attachEvent('onchange', loadVideosHandler);
            }

            loadVideosHandler();
        }

        var ajaxCallsCounter = 0;

        /**
         * Load/Show videos for selected language/category
         */
        function loadVideosHandler() {
            ajaxCallsCounter = 0;
            var videosListEl = document.getElementById('video-list');

            if (!videosListEl || !isElement(videosListEl)) {
                return false;
            }

            //clear video list areas
            videosListEl.innerHTML = '';
            if (typeof searchActive == 'boolean')
                searchActive = false;
            document.getElementById('search-field').value = '';

            var categoryEl = document.getElementById('videe-setting-category');

            if (!categoryEl || !isElement(categoryEl)) {
                return false;
            }

            var languageEl = document.getElementById('videe-setting-language');

            if (!languageEl || !isElement(languageEl)) {
                return false;
            }

            var loaderEl = document.createElement('li');
            loaderEl.className = 'loader';
            loaderEl.innerHTML = '<p id="loading">Loading<span>.</span><span>.</span><span>.</span></p>';
            videosListEl.appendChild(loaderEl);


            for (var i = 0; i <= languageEl.children.length; i++) {

                if (!languageEl.children.hasOwnProperty(i)) {
                    continue;
                }

                var lang = languageEl.children[i];


                if (!lang.getAttribute('selected')) {
                    continue;
                }


                if (!videoListStorage[lang.getAttribute('value')]) {
                    videoListStorage[lang.getAttribute('value')] = {};
                }

                for (var j = 0; j <= categoryEl.children.length; j++) {
                    if (!categoryEl.children.hasOwnProperty(j)) {
                        continue;
                    }

                    var cat = categoryEl.children[j];
                    if (!cat.getAttribute('selected')) {
                        continue;
                    }

                    ajaxCallsCounter++;
                    if (!videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')]) {

                        try {

                            var data = ajaxLoad(cdnPlaylistPath + 'l' + lang.getAttribute('value') + '/' + cat.getAttribute('value') + '.json', true, function (lang, cat, data) {
                                getVideos(data, lang, cat);
                            }.bind(null, lang, cat));
                        } catch (e) {
                            videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')] = [];
                        }

                    } else {

                        ajaxCallsCounter--;

                        for (var z in videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')]) {
                            if (!videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')].hasOwnProperty(z)) {
                                continue;
                            }

                            videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')][z].render(videosListEl);
                        }
                    }

                }
            }
            if (ajaxCallsCounter <= 0) {
                document.getElementsByClassName('loader').remove();
            }
            return true;
        }

        /**
         * Retrieve video objects from data storage
         * @param data
         * @param lang
         * @param cat
         */
        function getVideos(data, lang, cat) {
            ajaxCallsCounter--;
            if (ajaxCallsCounter <= 0) {
                document.getElementsByClassName('loader').remove();
            }
            var videosListEl = document.getElementById('video-list');

            if (!videosListEl || !isElement(videosListEl)) {
                return;
            }

            videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')] = JSON.parse(data);

            for (var k in videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')]) {
                if (!videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')].hasOwnProperty(k)) {
                    continue;
                }

                var videoObject = Object.create(videoItemAbstract);
                videoObject.extend(videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')][k]);
                videoListStorage[lang.getAttribute('value')][cat.getAttribute('value')][k] = videoObject;
                videoObject.render(videosListEl);
            }
        }


        /**
         * Show settings
         */
        function showSelectedSettings() {

            ///show autoplay
            var autoplayElements = document.getElementsByName('videe-setting-autoplay');
            for (var i = 0; i <= autoplayElements.length; i++) {
                if (isElement(autoplayElements[i])) {
                    autoplayElements[i].removeAttribute('checked');
                }
            }

            if (pluginSettings.autoplay)
                document.getElementById('videe-setting-autoplay-on').setAttribute('checked', 'checked');
            else
                document.getElementById('videe-setting-autoplay-off').setAttribute('checked', 'checked');

            //show size
            var sizeArr = pluginSettings['size'].toLowerCase().split('x');
            if (sizeArr && sizeArr.length) {
                if (typeof sizeArr[0] != 'undefined')
                    document.getElementById('videe-setting-size-width').value = sizeArr[0];
                if (typeof sizeArr[1] != 'undefined')
                    document.getElementById('videe-setting-size-height').value = sizeArr[1];
            }
        }

        /**
         * Set MultiSelect
         * @param el
         * @param values
         */
        function setMultipleSelect(el, values) {
            if (!isElement(el)) {
                throw 'Provided element is not valid.';
            }

            var opts = el.children;
            for (var i in opts) {
                if (!opts.hasOwnProperty(i))
                    continue;

                if (!isElement(opts[i]))
                    continue;

                if (typeof opts[i].getAttribute('selected') == 'string')
                    opts[i].removeAttribute('selected');

                for (var j = 0; j < values.length; j++) {
                    if (opts[i].value == values[j].id) {
                        opts[i].setAttribute('selected', 'selected');
                    }
                }

            }

            Template.selectProcessSelection(el);
        }

        /**
         * Returns selected values for multiple select
         * @param el
         * @returns {Array}
         */
        function getMultipleSelect(el) {
            if (!isElement(el)) {
                throw 'Provided element is not valid.';
            }

            var returnData = [];

            var opts = el.children;
            for (var i = 0; i < opts.length; i++) {
                if (opts[i].hasAttribute('selected')) {
                    returnData.push(opts[i]);
                }
            }
            return returnData;
        }


        /**
         * Display start form.
         */
        function displayStartForm() {
            element.innerHTML = Template.get('start').parse(presets);
            Template.initActions();

            //Form handler
            var formElement = document.getElementById('videe-activation-form');

            if (formElement)
                if (formElement.addEventListener) {
                    formElement.addEventListener("submit", keyActivationFormHandler, false);
                } else if (formElement.attachEvent) {
                    formElement.attachEvent('onsubmit', keyActivationFormHandler);
                }

        }

        /**
         * Get categories list for specified customer
         */
        function receiveCategoriesList() {
            JsonP.send(service.categoriesListUrl + '?auth_token=' + getToken() + '&domain=' + domain, {
                onSuccess: function (data) {
                    presets.categoriesList = data.items;
                    if (configurationDataIsLoaded()) showPlaylistConfigurationForm();
                },
                onTimeout: function () {
                    showError('Request timeout while retrieving categories.');
                }
            });
        }


        /**
         * Get languages list for specified customer
         */
        function receiveLanguagesList() {
            JsonP.send(service.languagesListUrl + '?auth_token=' + getToken() + '&domain=' + domain, {
                onSuccess: function (data) {
                    presets.languagesList = data.items;
                    if (configurationDataIsLoaded()) showPlaylistConfigurationForm();
                },
                onTimeout: function () {
                    showError('Request timeout while retrieving languages.');
                }
            });
        }


        /**
         * Checks if configuration for the form is loaded
         *
         * @returns {boolean}
         */
        function configurationDataIsLoaded() {
            var limit = 2;
            var count = 0;

            if (presets.languagesList.length > 0) count++;
            if (presets.categoriesList.length > 0) count++;

            return (limit == count);
        }

        /**
         * Basic Videe initiation
         */
        function initBase() {

            //Check if we received list of elments
            if (!isElement(element)) {
                if (!isElement(element[0])) {
                    throw "Element required";
                } else {
                    element = element[0];
                }
            }

            //Initiate templates object
            Template.templatesList = templates;
        }


//Basic plugin initiation
        initBase();

    }
    ;

Element.prototype.remove = function () {
    this.parentElement.removeChild(this);
};

NodeList.prototype.remove = HTMLCollection.prototype.remove = function () {
    for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
};

/**
 * Object with util functions
 */
var Util = Object.create({
    extend: function (obj) {
        for (var i in obj) {
            if (obj.hasOwnProperty(i)) {
                this[i] = obj[i];
            }
        }
    }
});