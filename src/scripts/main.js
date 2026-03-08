const historyDataToSave = null;
const homePageDiv = document.getElementById("homePage"),
showInfoDiv = document.getElementById("showInfoPage"),
videoPageDiv = document.getElementById("videoPage"),
showInfoImg = document.getElementById("showInfoImg"),
showInfoTitle = document.getElementById("showInfoTitle"),
showInfoEpData = document.getElementById("showInfoEpData"),
showInfoSynopsis = document.getElementById("showInfoSynopsis"),
epListCon = document.getElementById("episodeListCon"),
seasonSelector = document.getElementById("seasonSelector"),
epList = document.getElementById("episodeList"),
closeBtn = document.getElementById("closeShowInfoBtn"),
videoPlayer = document.getElementById("player"),
showTitleInfoPage = document.getElementById("showTitleVidPage"),
epTitleInfoPage = document.getElementById("epTitleVidPage"),
closeVideoBtn = document.getElementById("closeVideoBtn"),
historyDiv = document.getElementById("historyCon"),
continueShowBtn = document.getElementById("continueShowInfoBtn"),
vidSeasonSelector = document.getElementById("vidSeasonSelector"),
vidEpisodeListDiv = document.getElementById("vidEpisodeList");

const finishEpisodeInterval = 90;

const svg = `<svg width="20" height="20" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>`;

let hideTimeout;

const compareObj = (objA, objB) => {
  let res  = true;
  Object.keys(objB).forEach(key => {
    if(!objA.hasOwnProperty(key) || objA[key] !== objB[key]) {
      res = false;
    }
  })
  return res;
}


function showButton(elem) {
  elem.style.opacity = '1';
  clearTimeout(hideTimeout);
  hideTimeout = setTimeout(() => {
    elem.style.opacity = '0';
  }, 2000); // hide after 2 seconds of no interaction
}

var interval = {
    intervals : new Set(),
    
    make(...args) {
        var newInterval = setInterval(...args);
        this.intervals.add(newInterval);
        return newInterval;
    },

    clear(id) {
        this.intervals.delete(id);
        return clearInterval(id);
    },

    clearAll() {
        for (var id of this.intervals) {
            this.clear(id);
        }
    }
};

function formatTime(totalSeconds) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  if (formattedHours !== "00") {
      return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  } else {
    return `${formattedMinutes}:${formattedSeconds}`;
  }
}


function createContinueWatchCard(data) {
    const newColumn = document.createElement("div");
    newColumn.className = "col-md-2 mb-3";
    const newCard = document.createElement("div");
    newCard.className = "card h-100 w-100 text-bg-dark notransform";

    const newCardImg = document.createElement("img");
    newCardImg.className = "card-img-top";
    newCardImg.alt = "...";
    newCardImg.src = data["img"];

    const newCardBody = document.createElement("div");
    newCardBody.className = "card-body";

    const newTitleText = document.createElement("h5");
    newTitleText.className = "card-title";
    newTitleText.textContent = `S${data["seasonNum"]} E${data["episodeNum"]} - ${data["episodeTitle"]}`;

    const newShowNameText = document.createElement("p");
    newShowNameText.className = "card-text";
    newShowNameText.style.opacity = "75%";
    newShowNameText.textContent = data["showTitle"];


    const newShowButton = document.createElement("button");
    newShowButton.style.marginTop = "auto";
    newShowButton.className = "btn btn-primary";
    if (data["timeLeft"] !== "Start" && data["timeLeft"] !== 'Watch Again') {
        newShowButton.innerHTML = `<svg width="15" height="15" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg> Continue (${data["timeLeft"]})`;
    } else {
        newShowButton.innerHTML = `<svg width="15" height="15" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg> Start Watching`;
    }
    newShowButton.onclick = function() {
        closeVideoBtn.onclick = function() {
            interval.clearAll();
            window.scrollTo(0, 0);
            videoPlayer.src = "";
            loadHistoryData().then((data) => {
                pushHistoryData(data);
            })
            homePageDiv.style.display = "block";
            showInfoDiv.style.display = "none";
            videoPageDiv.style.display = "none";
        }
        showTitleInfoPage.onclick = function() {
            interval.clearAll();
            window.scrollTo(0, 0);
            videoPlayer.src = "";
            openShowInfo(data);
            loadHistoryData().then((data) => {
                pushHistoryData(data);
            })
        }
        playEpisode(data["identifier"], [data["seasonNum"], data["episodeNum"]-1], data);
    }

    const newBr = document.createElement("br");

    newCardBody.appendChild(newTitleText);
    newCardBody.appendChild(newShowNameText);
    newCardBody.appendChild(newBr);
    newCardBody.appendChild(newShowButton);

    newCard.appendChild(newCardImg);
    newCard.appendChild(newCardBody);
    newColumn.appendChild(newCard);

    document.getElementById("conWatchContainer").appendChild(newColumn);
}

async function playEpisode(identifier, epToPlay, itsData) {
    vidSeasonSelector.innerHTML = "";
    vidEpisodeListDiv.innerHTML = "";
    vidSeasonSelector.removeEventListener("change", seasonChangeVid);
    let passData = itsData;
    window.scrollTo(0, 0);
    homePageDiv.style.display = "none";
    showInfoDiv.style.display = "none";
    videoPageDiv.style.display = "block";
    var season = parseInt(epToPlay[0]);
    var episode = parseInt(epToPlay[1]);
    var showData = showsToExportNew[identifier];
    var showTitle = showData["title"];
    var seasonData = showData[`S${season}`];
    var episodeSrc = seasonData["files"][episode];
    var episodeTitle = seasonData["epNames"][episode];


    showTitleInfoPage.innerHTML = showTitle;
    epTitleInfoPage.innerHTML = `S${season}E${episode+1} - ${episodeTitle}`;
    videoPlayer.src = episodeSrc;

    var historyDataObject = await get('historyData-v2');

    videoPlayer.onloadedmetadata = function() {
        if ((historyDataObject["historyData"][identifier][`S${season}`][`EP${episode+1}`]["currentTime"]+finishEpisodeInterval) <= videoPlayer.duration) {
            videoPlayer.currentTime = historyDataObject["historyData"][identifier][`S${season}`][`EP${episode+1}`]["currentTime"];
        }
        videoPlayer.play();
        interval.clearAll();
        interval.make(updateHistory, 5000);
    }

    var newHistoryOption = {
        "showIdentifier": identifier,
        "currentSeason": season,
        "currentEpisode": episode+1
    }

    var historyDataObj = await get("historyData-v2");
    var toAdd = true
    historyDataObj["history"].forEach((obj) =>  {
        if (compareObj(newHistoryOption, obj)) {
            toAdd = false
        }
    })
    if (toAdd) {
        historyDataObj["history"].unshift(newHistoryOption);
    } else {
        var index = historyDataObj["history"].findIndex(obj => {
            return (obj["showIdentifier"] == newHistoryOption["showIdentifier"] && obj["currentSeason"] == newHistoryOption["currentSeason"] && obj["currentEpisode"] == newHistoryOption["currentEpisode"]);
        });
        historyDataObj["history"].splice(index, 1)[0];
        historyDataObj["history"].unshift(newHistoryOption);
    }

    toAdd = true;
    historyDataObj["conWatchData"].forEach((obj) => {
        if (newHistoryOption["showIdentifier"] == obj["showIdentifier"]) {
            toAdd = false
        }
    })

    if (toAdd) {
        if (historyDataObj["conWatchData"].length < 12) {
            historyDataObj["conWatchData"].unshift(newHistoryOption);
        } else {
            historyDataObj["conWatchData"].unshift(newHistoryOption);
            historyDataObj["conWatchData"].pop();
        }
    } else {
        var index = historyDataObj["conWatchData"].findIndex(obj => {
            return obj["showIdentifier"] === newHistoryOption["showIdentifier"]
        });
        historyDataObj["conWatchData"].splice(index, 1)[0];
        historyDataObj["conWatchData"].unshift(newHistoryOption);
    }

    historyDataObj["historyData"][identifier]["mostRecent"] = [season, episode+1];

    await set("historyData-v2", historyDataObj);


    async function updateHistory() {
        var historyDataObj = await get('historyData-v2');
        var showHistoryData = historyDataObj["historyData"][identifier];
        showHistoryData[`S${season}`][`EP${episode+1}`]["currentTime"] = videoPlayer.currentTime;
        if ((videoPlayer.duration !== NaN && videoPlayer.currentTime !== NaN) && (videoPlayer.duration !== null && videoPlayer.currentTime !== null) && (videoPlayer.duration !== undefined && videoPlayer.currentTime !== undefined)) {
            if (videoPlayer.currentTime > 10 && videoPlayer.currentTime+finishEpisodeInterval < videoPlayer.duration) {
                showHistoryData[`S${season}`][`EP${episode+1}`]["timeLeft"] = `${formatTime((videoPlayer.duration-videoPlayer.currentTime))} left`;
            } else if (videoPlayer.currentTime+finishEpisodeInterval >= videoPlayer.duration) {
                var seasonForData, episodeForData;
                var toAdd = true;
                var toRemove = false;
                if (showData[`S${season}`]['EpCount'] >= episode+2) {
                    seasonForData = season;
                    episodeForData = episode+2;
                } else {
                    if (season+1 <= showData["seasonCount"]) {
                        if (showData[`S${season+1}`]['EpCount'] >= 1) {
                            seasonForData = season+1;
                            episodeForData = 1
                        } else {
                            toRemove = true;
                            toAdd = false;
                        }
                    } else {
                        toRemove = true;
                        toAdd = false;
                    }
                }
                
                var newHistoryOption = {
                    "showIdentifier": identifier,
                    "currentSeason": seasonForData,
                    "currentEpisode": episodeForData
                }
                historyDataObj["conWatchData"].forEach((obj) => {
                    if (newHistoryOption["showIdentifier"] == obj["showIdentifier"]) {
                        toAdd = false
                    }
                })

                if (toAdd) {
                    if (historyDataObj["conWatchData"].length < 12) {
                        historyDataObj["conWatchData"].unshift(newHistoryOption);
                    } else {
                        historyDataObj["conWatchData"].unshift(newHistoryOption);
                        historyDataObj["conWatchData"].pop();
                    }
                    historyDataObj["historyData"][identifier]["mostRecent"] = [seasonForData, episodeForData];
                } else if (!toRemove) {
                    var index = historyDataObj["conWatchData"].findIndex(obj => {
                        return obj["showIdentifier"] === newHistoryOption["showIdentifier"]
                    });
                    historyDataObj["conWatchData"].splice(index, 1)[0];
                    historyDataObj["conWatchData"].unshift(newHistoryOption);
                    historyDataObj["historyData"][identifier]["mostRecent"] = [seasonForData, episodeForData];
                } else {
                    var index = historyDataObj["conWatchData"].findIndex(obj => {
                        return obj["showIdentifier"] === newHistoryOption["showIdentifier"]
                    });
                    historyDataObj["historyData"][identifier]["mostRecent"] = [];
                    historyDataObj["conWatchData"].splice(index, 1)[0];
                }
                showHistoryData[`S${season}`][`EP${episode+1}`]["timeLeft"] = "Watch Again";
            }
            await set('historyData-v2', historyDataObj);
        }
    }

    var upNext = [];
    var dontUpNext = false;

    if ((episode+1) < seasonData["EpCount"]) {
        upNext[0] = season;
        upNext[1] = (episode+1);
    } else {
        if ((season+1) <= showData["seasonCount"]) {
            if (showData[`S${season+1}`]["EpCount"] > 0) {
                upNext[0] = (season+1);
                upNext[1] = 0;
            } else {
                dontUpNext = true;
            }
        } else {
            dontUpNext = true;
        }
    }

    var previous = [];
    var dontPrevious=false;

    if ((episode-1) >= 0) {
        previous[0] = season;
        previous[1] = (episode-1);
    } else {
        if ((season-1) > 0) {
            if (showData[`S${season-1}`]["EpCount"] > 0) {
                previous[0] = (season-1);
                previous[1] = showData[`S${season-1}`]["EpCount"]-1;
            } else {
                dontPrevious = true;
            }
        } else {
            dontPrevious = true;
        }
    }
    

    interval.make(checkVideoTime, 1000);

    function nextEp() {
        vidSeasonSelector.removeEventListener("change", seasonChangeVid);
        playEpisode(identifier, upNext, passData);
    }

    function previousEp () {
        vidSeasonSelector.removeEventListener("change", seasonChangeVid);
        playEpisode(identifier, previous, passData);
    }

    if (!dontUpNext) {
        navigator.mediaSession.setActionHandler("nexttrack", nextEp);
    } else {
        navigator.mediaSession.setActionHandler("nexttrack", null);
    }

    if (!dontPrevious) {
        navigator.mediaSession.setActionHandler("previoustrack", previousEp);
    } else {
        navigator.mediaSession.setActionHandler("previoustrack", null);
    }

    function checkVideoTime() {
        if (videoPlayer.currentTime >= videoPlayer.duration) {
            playEpisode(identifier, upNext, passData);
        }
    }

        navigator.mediaSession.metadata = new MediaMetadata({
        title: (`S${season} E${episode+1} - ${episodeTitle}`),
        artist: showTitle,
        artwork: [{src: showData[`S${season}`]["cover"], sizes: "396x594"}]
    })

    navigator.mediaSession.setActionHandler("play", function() {
        videoPlayer.play();
    })

    navigator.mediaSession.setActionHandler("pause", function() {
        videoPlayer.pause();
    })

    videoPlayer.addEventListener("pause", () => {
        navigator.mediaSession.playbackState = "paused";
    })

    for (let i = 1; i <= showData["seasonCount"]; i++) {
        var newOptionElem = document.createElement("option");
        newOptionElem.value = i;
        newOptionElem.innerHTML = showData[`S${i}`]["title"];
        vidSeasonSelector.appendChild(newOptionElem);
    }

    vidSeasonSelector.value = season;

    async function seasonChangeVid() {
        vidEpisodeListDiv.innerHTML = "";
        var seasonDataSelected = showData[`S${vidSeasonSelector.value}`];
        for (let i = 0; i < seasonDataSelected["EpCount"]; i++) {
            var historyDatav2 = await get("historyData-v2");
            var historyData = historyDatav2["historyData"];
            var showHistoryData = historyData[identifier];
            let newEp = document.createElement("button");
            newEp.className = "epBtnVidPage";
            newEp.innerHTML = `${i+1}.&ensp;${seasonDataSelected["epNames"][i]} <span style="opacity: 0.75;">(${showHistoryData[`S${vidSeasonSelector.value}`][`EP${i+1}`]["timeLeft"]})</span>`;
            newEp.onclick = function() {
                vidSeasonSelector.removeEventListener("change", seasonChangeVid);
                playEpisode(identifier, [vidSeasonSelector.value, i], passData);
            }
            

            vidEpisodeListDiv.appendChild(newEp);
        }
    }

    seasonChangeVid();

    vidSeasonSelector.addEventListener("change", seasonChangeVid);

    closeVideoBtn.addEventListener('click', function() {
        vidSeasonSelector.removeEventListener("change", seasonChangeVid);
    })

    videoPlayer.addEventListener("play", () => {
        interval.clearAll();
        if (!dontUpNext) { 
            interval.make(checkVideoTime, 1000);
        }
        interval.make(updateHistory, 5000);
        navigator.mediaSession.playbackState = "playing";
    })
}

async function openShowInfo(dataToPass) {


    interval.clearAll();
    let data = dataToPass;
    window.scrollTo(0, 0);
    homePageDiv.style.display = "none";
    videoPageDiv.style.display = "none";
    videoPlayer.src = "";
    let showData = showsToExportNew[data["identifier"]];
    let seasonCount = showData["seasonCount"];
    showInfoTitle.textContent = showData["title"];
    if (seasonCount > 1) {
        showInfoEpData.textContent = `${seasonCount} seasons ${showData["totalEpisodes"]} episodes`;
    } else {
        showInfoEpData.textContent = `${seasonCount} season ${showData["totalEpisodes"]} episodes`;
    }
    showInfoSynopsis.textContent = showData["synopsis"];
    seasonSelector.innerHTML = "";
    for (let i = 1; i <= seasonCount; i++) {
        var seasonData = showData[`S${i}`];
        var newOptionElem = document.createElement("option");
        newOptionElem.innerHTML = seasonData["title"];
        newOptionElem.value = i;
        seasonSelector.appendChild(newOptionElem);
    }
    showInfoImg.src = showData[`S${seasonSelector.value}`]["cover"];
    async function seasonChange() {
        epList.innerHTML = " ";
        showInfoImg.src = showData[`S${seasonSelector.value}`]["cover"];
        var seasonDataSelected = showData[`S${seasonSelector.value}`];
        for (let i = 0; i < seasonDataSelected["EpCount"]; i++) {
            var historyDatav2 = await get("historyData-v2");
            var historyData = historyDatav2["historyData"];
            var showHistoryData = historyData[data["identifier"]];
            let newEp = document.createElement("button");
            newEp.className = "epBtn";
            newEp.innerHTML = `${i+1}.&ensp;${seasonDataSelected["epNames"][i]} <span style="opacity: 0.75;">(${showHistoryData[`S${seasonSelector.value}`][`EP${i+1}`]["timeLeft"]})</span>`;
            newEp.onclick = function() {
                playEpisode(data["identifier"], [seasonSelector.value, i], dataToPass);
            }
            

            epList.appendChild(newEp);
        }
    }
    seasonSelector.addEventListener("change", seasonChange);

    closeBtn.onclick = function() {
        seasonSelector.removeEventListener("change", seasonChange);
        window.scrollTo(0, 0);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
        homePageDiv.style.display = "block";
        showInfoDiv.style.display = "none";
        videoPageDiv.style.display = "none";
    }

    closeVideoBtn.onclick = function() {
        seasonSelector.removeEventListener("change", seasonChange);
        interval.clearAll();
        window.scrollTo(0, 0);
        videoPlayer.src = "";
        openShowInfo(data);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
        // homePageDiv.style.display = "none";
        // showInfoDiv.style.display = "block";
        // videoPageDiv.style.display = "none";
    }

    showTitleInfoPage.onclick = function() {
        seasonSelector.removeEventListener("change", seasonChange);
        interval.clearAll();
        window.scrollTo(0, 0);
        videoPlayer.src = "";
        openShowInfo(data);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
    }

    var historyDatav2 = await get("historyData-v2");
    var historyData = historyDatav2["historyData"];
    var showHistoryData = historyData[data["identifier"]];
    var mostRecent = showHistoryData["mostRecent"];

    if (mostRecent.length == 2) {
        continueShowBtn.innerHTML = `${svg} S${mostRecent[0]} E${mostRecent[1]} - ${showData[`S${mostRecent[0]}`]["epNames"][mostRecent[1]-1]} (${showHistoryData[`S${mostRecent[0]}`][`EP${mostRecent[1]}`]["timeLeft"]})`;
        seasonSelector.value = mostRecent[0];
        seasonChange();
    } else {
        continueShowBtn.innerHTML = `${svg} Start Watching`;
        seasonChange();
    }

    continueShowBtn.onclick = function() {
        playEpisode(data["identifier"], [mostRecent[0], mostRecent[1]-1], dataToPass);
    }

    

    showInfoDiv.style.display = "block";
}

function createShowCard(data, parentElem) {
    const newColumn = document.createElement("div");
    newColumn.className = "col-md-2 mb-3";
    const newCard = document.createElement("div");
    newCard.id = data["identifier"];
    newCard.className = "card h-100 w-100 text-bg-dark";
    newCard.style.userSelect = "none";
    newCard.style.cursor = "pointer";
    
    const newBGIMG = document.createElement("img");
    newBGIMG.className = "card-img-top";
    newBGIMG.alt = "...";
    newBGIMG.src = data["img"];

    const newOverlayContainer = document.createElement("div");
    newOverlayContainer.className = "card-body";

    const newShowTitle = document.createElement("h5");
    newShowTitle.className = "card-title";
    newShowTitle.textContent = data["showTitle"];

    const newCountText = document.createElement("p");
    newCountText.className = "card-text";
    var plurality = null;
    if (data["seasonCount"] > 1) {
        plurality = "seasons";
    } else {
        plurality = "season";
    }

    newCountText.style.transition = "ease 0.5s";
    newCountText.textContent = `${data["seasonCount"]} ${plurality} ${data["episodeCount"]} episodes`;

    newCard.onmouseover = function() {
        newCountText.textContent = "Open Show Details >>";
    }

    newCard.onmouseleave = function() {
        newCountText.textContent = `${data["seasonCount"]} ${plurality} ${data["episodeCount"]} episodes`;
    }

    newCard.onclick = function() {
        openShowInfo(data);
    }

    newOverlayContainer.appendChild(newShowTitle);
    newOverlayContainer.appendChild(newCountText);

    newCard.appendChild(newBGIMG);
    newCard.appendChild(newOverlayContainer);

    newColumn.appendChild(newCard);
    parentElem.appendChild(newColumn);
}

async function loadHistoryData() {
    const inCaseOfOldData = await get("historyData");
    const newData = await get("historyData-v2");
    if (inCaseOfOldData !== null && inCaseOfOldData !== undefined && (newData == undefined || newData == null)) {
        var newHistoryData = {};

        Object.keys(showsToExportNew).forEach(identifier => {
            newHistoryData[identifier] = {};
            newHistoryData[identifier]["mostRecent"] = [];
            for (let i = 1; i <= showsToExportNew[identifier]["seasonCount"]; i++) {
                newHistoryData[identifier][`S${i}`] = {};
                for (let i2 = 1; i2 <= showsToExportNew[identifier][`S${i}`]["EpCount"]; i2++) {
                    var path = showsToExportNew[identifier][`S${i}`]["files"][i2-1];
                    if (inCaseOfOldData[path] !== null && inCaseOfOldData[path] !== undefined) {
                        newHistoryData[identifier][`S${i}`][`EP${i2}`] = {
                            "currentTime": inCaseOfOldData[path]["currentTime"],
                            "timeLeft": `${inCaseOfOldData[path]["timeLeft"]} left`
                        }
                    } else {
                        newHistoryData[identifier][`S${i}`][`EP${i2}`] = {
                            "currentTime": 0,
                            "timeLeft": "Start"
                        }
                    }
                }
            }
        })

        const newHistoryDataToSet = {
            "historyData": newHistoryData,
            "conWatchData": [],
            "history": []
        }

        await set("historyData-v2", newHistoryDataToSet);
        return newHistoryDataToSet;
    } else if (newData !== null && newData !== undefined) {
        var newHistoryData = newData["historyData"];

        Object.keys(showsToExportNew).forEach((identifier) => {
            if (!newHistoryData[identifier]) {
                newHistoryData[identifier] = {};
                newHistoryData[identifier]["mostRecent"] = [];
            }
            for (let i = 1; i <= showsToExportNew[identifier]["seasonCount"]; i++) {
                if (!newHistoryData[identifier][`S${i}`]) {
                    newHistoryData[identifier][`S${i}`] = {};
                }
                for (let i2 = 1; i2 <= showsToExportNew[identifier][`S${i}`]["EpCount"]; i2++) {
                    if (!newHistoryData[identifier][`S${i}`][`EP${i2}`]) {
                        newHistoryData[identifier][`S${i}`][`EP${i2}`] = {
                            "currentTime": 0,
                            "timeLeft": "Start"
                        }
                    }
                }
            }
        })
        await set('historyData-v2', newData);
        return newData;
    } else {
        var newHistoryData = {};

        Object.keys(showsToExportNew).forEach(identifier => {
            newHistoryData[identifier] = {};
            newHistoryData[identifier]["mostRecent"] = [];
            for (let i = 1; i <= showsToExportNew[identifier]["seasonCount"]; i++) {
                newHistoryData[identifier][`S${i}`] = {};
                for (let i2 = 1; i2 <= showsToExportNew[identifier][`S${i}`]["EpCount"]; i2++) {
                    newHistoryData[identifier][`S${i}`][`EP${i2}`] = {
                        "currentTime": 0,
                        "timeLeft": "Start"
                    }
                }
            }
        })
        const newHistoryDataToSet = {
            "historyData": newHistoryData,
            "conWatchData": [],
            "history": []
        }

        await set("historyData-v2", newHistoryDataToSet);
        return newHistoryDataToSet;
    }
}

function pushHistoryData(data) {
    document.getElementById("conWatchContainer").innerHTML = "";
    historyDiv.innerHTML = "";
    if (data["conWatchData"].length > 0) {
        data["conWatchData"].forEach((watchData) => {
            const showData = showsToExportNew[watchData["showIdentifier"]];
            const dataForCard = {
                img: showData[`S${watchData["currentSeason"]}`]["cover"],
                seasonNum: watchData["currentSeason"],
                episodeNum: watchData["currentEpisode"],
                episodeTitle: showData[`S${watchData["currentSeason"]}`]["epNames"][watchData["currentEpisode"]-1],
                showTitle: showData["title"],
                timeLeft: data["historyData"][watchData["showIdentifier"]][`S${watchData["currentSeason"]}`][`EP${watchData["currentEpisode"]}`]["timeLeft"],
                identifier: watchData["showIdentifier"]
            }
            createContinueWatchCard(dataForCard);
        })
        document.getElementById("conWatch").style.display = "block";
    } else {
        document.getElementById("conWatch").style.display = "none";
    }
    if (data["history"].length > 0) {
        data["history"].forEach((item) => {
            var showData = showsToExportNew[item["showIdentifier"]];
            var newHistoryElem = document.createElement("button");
            newHistoryElem.className = "epHistoryBtn";
            newHistoryElem.innerHTML = `${showData["title"]} | S${item["currentSeason"]} E${item["currentEpisode"]} - ${showData[`S${item["currentSeason"]}`]["epNames"][item["currentEpisode"]-1]} <span style="opacity: 0.75;">(${data["historyData"][item["showIdentifier"]][`S${item["currentSeason"]}`][`EP${item["currentEpisode"]}`]["timeLeft"]})</span>`;
            const dataForCard = {
                img: showData[`S${item["currentSeason"]}`]["cover"],
                seasonNum: item["currentSeason"],
                episodeNum: item["currentEpisode"],
                episodeTitle: showData[`S${item["currentSeason"]}`]["epNames"][item["currentEpisode"]-1],
                showTitle: showData["title"],
                timeLeft: data["historyData"][item["showIdentifier"]][`S${item["currentSeason"]}`][`EP${item["currentEpisode"]}`]["timeLeft"],
                identifier: item["showIdentifier"]
            }
            newHistoryElem.onclick = function() {
                closeVideoBtn.onclick = function() {
                    interval.clearAll();
                    window.scrollTo(0, 0);
                    videoPlayer.src = "";
                    loadHistoryData().then((data) => {
                        pushHistoryData(data);
                    })
                    homePageDiv.style.display = "block";
                    showInfoDiv.style.display = "none";
                    videoPageDiv.style.display = "none";
                }
                showTitleInfoPage.onclick = function() {
                    interval.clearAll();
                    window.scrollTo(0, 0);
                    videoPlayer.src = "";
                    loadHistoryData().then((data) => {
                        pushHistoryData(data);
                    })
                    openShowInfo(dataForCard);
                }
                playEpisode(item["showIdentifier"], [item["currentSeason"], item["currentEpisode"]-1], dataForCard);
            }
            historyDiv.appendChild(newHistoryElem);
        })
    }
}

function loadShows() {
    if (recentlyUpdated.length > 0) {
        recentlyUpdated.forEach((show) => {
            var dataForCard = {
                "seasonCount": show["seasonCount"],
                "episodeCount": show["totalEpisodes"],
                "showTitle": show["title"],
                "img": show[`S${show["seasonCount"]}`]["cover"],
                "identifier": show["showIdentifier"]
            }
            createShowCard(dataForCard, document.getElementById("newestContainer"));
        })
    }
    const showContainer = document.getElementById("showListPage");
    Object.keys(showsToExportNew).forEach((key) => {
        var show = showsToExportNew[key];
        var dataForCard = {
            "seasonCount": show["seasonCount"],
            "episodeCount": show["totalEpisodes"],
            "showTitle": show["title"],
            "img": show[`S${show["seasonCount"]}`]["cover"],
            "identifier": show["showIdentifier"]
        }
        createShowCard(dataForCard, showContainer);
    })
}

loadHistoryData().then((data) => {
    pushHistoryData(data);
})

loadShows();
videoPlayer.addEventListener('mousemove', function() {
    showButton(closeVideoBtn);
});
videoPlayer.addEventListener('focus', function() {
    showButton(closeVideoBtn);
});
videoPlayer.addEventListener('play', function() {
    showButton(closeVideoBtn);
});
videoPlayer.addEventListener('pause', function() {
    showButton(closeVideoBtn);
});

showInfoDiv.addEventListener("mousemove", function() {
    showButton(closeBtn);
});
showInfoDiv.addEventListener("focus", function() {
    showButton(closeBtn);
})
showInfoDiv.addEventListener("click", function() {
    showButton(closeBtn);
})

async function downloadHistory() {
    var historyData = await get("historyData-v2");
    var jsonData = JSON.stringify(historyData, null, 2);
    var newBlob = new Blob([jsonData], {type: "application/json"});

    var newUrl = URL.createObjectURL(newBlob);

    var newA = document.createElement("a");
    newA.href = newUrl;
    newA.download = "historyData_v2.json";
    newA.style.display = "none";
    document.body.appendChild(newA);
    newA.click();
    document.body.removeChild(newA);
    URL.revokeObjectURL(newUrl);
}

async function uploadHistory() {
    var newInput = document.createElement("input");
    newInput.type = "file";
    newInput.accept = "application/json";
    newInput.multiple = false;
    newInput.style.display = "none";
    document.body.appendChild(newInput);
    newInput.click();
    newInput.addEventListener('change', async function(e) {
        var selectedFile = e.target.files[0];
        if (selectedFile) {
            var historyData = null;
            var newReader = new FileReader();
            newReader.onload = async function(event) {
                var jsonString = event.target.result;
                var readObj = JSON.parse(jsonString);
                if ((Object.keys(readObj)[0] === "historyData") && (Object.keys(readObj)[1] === "conWatchData") && (Object.keys(readObj)[2] === "history")) {
                    var isError = false;
                    var errorMsg = "";
                    var historyData = readObj["historyData"];
                    var history = readObj["history"];
                    var conWatchData = readObj["conWatchData"]
                    try {
                        Object.keys(historyData).forEach((identifier) => {
                            if (Object.keys(showsToExportNew).includes(identifier)) {
                                if (historyData[identifier]["mostRecent"]) {
                                    if ((historyData[identifier]["mostRecent"].length == 0) || (historyData[identifier]["mostRecent"].length == 2)) {
                                        // do nothing
                                    } else {
                                        isError = true;
                                        errorMsg = "Uploaded JSON file is not formatted correctly. (11)";
                                    }
                                } else {
                                    isError = true;
                                    errorMsg = "Uploaded JSON file is not formatted correctly. (11)";
                                }
                                if (Object.keys(historyData[identifier]).length <= showsToExportNew[identifier]["seasonCount"]+1) {
                                    for (let i = 1; i <= showsToExportNew[identifier]["seasonCount"]; i++) {
                                        if (Object.keys(historyData[identifier][`S${i}`]).length <= showsToExportNew[identifier][`S${i}`]["EpCount"]) {
                                            Object.keys(historyData[identifier][`S${i}`]).forEach((ep) => {
                                                if (Object.keys(historyData[identifier][`S${i}`][ep]).length == 2) {
                                                    if (!Object.keys(historyData[identifier][`S${i}`][ep]["currentTime"]) && !Object.keys(historyData[identifier][`S${i}`][ep]["timeLeft"])) {
                                                        isError = true;
                                                        errorMsg = "Uploaded JSON file is not formatted correctly. (2)";
                                                    }
                                                } else {
                                                    isError = true;
                                                    errorMsg = "Uploaded JSON file is not formatted correctly. (3)";
                                                }
                                            })
                                        } else {
                                            isError = true;
                                            errorMsg = "Uploaded JSON file is not formatted correctly. (4)";
                                        }
                                    }
                                } else {
                                    isError = true;
                                    errorMsg = "Uploaded JSON file is not formatted correctly. (5)";
                                }
                            } else {
                                isError = true;
                                errorMsg = "Uploaded JSON file is not formatted correctly. (6)";
                            }
                        })

                        history.forEach((historyElem) => {
                            if (Object.keys(historyElem).length == 3) {
                                if (!historyElem["showIdentifier"] && !historyElem["currentSeason"] && !historyElem["currentEpisode"]) {
                                    isError = true;
                                    errorMsg = "Uploaded JSON file is not formatted correctly. (7)";
                                }
                            } else {
                                isError = true;
                                errorMsg = "Uploaded JSON file is not formatted correctly. (8)";
                            }
                        })

                        conWatchData.forEach((conElem) => {
                            if (Object.keys(conElem).length == 3) {
                                if (!conElem["showIdentifier"] && !conElem["currentSeason"] && !conElem["currentEpisode"]) {
                                    isError = true;
                                    errorMsg = "Uploaded JSON file is not formatted correctly. (9)";
                                }
                            } else {
                                isError = true;
                                errorMsg = "Uploaded JSON file is not formatted correctly. (10)";
                            }
                        })

                        if (!isError) {
                            var newObj = {
                                'historyData': historyData,
                                'conWatchData': conWatchData,
                                'history': history
                            }
                            await set('historyData-v2', newObj);
                            alert('History data uploaded successfully.');
                            window.location.reload();
                        } else {
                            alert(errorMsg);
                            document.body.removeChild(newInput);
                        }
                    } catch {
                        alert("Something went wrong.");
                        document.body.removeChild(newInput);
                    }
                } else {
                    alert("Uploaded JSON file is not formatted correctly. (1)")
                }
            }
            newReader.readAsText(selectedFile);
        }
    })
}

async function clearData() {
    await set("historyData-v2", null);
    alert('data cleared');
    window.location.reload();
}

document.getElementById("clearHistory").onclick = function() {
    var confirmed = window.confirm("Are you sure you want to clear all history data?");
    if (confirmed) {
        clearData();
    }
}

document.getElementById("downloadHistory").onclick = function() {
    var confirmed = window.confirm("Do you want to download your history data?");
    if (confirmed) {
        downloadHistory();
    }
}

document.getElementById("uploadHistory").onclick = function() {
    var confirmed = window.confirm("Do you want to upload a historyData JSON file?");
    if (confirmed) {
        uploadHistory();
    }
}
