const historyDataToSave = null;
let myPlayer = null;
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
showTitleInfoPage = document.getElementById("showTitleVidPage"),
epTitleInfoPage = document.getElementById("epTitleVidPage"),
closeVideoBtn = document.getElementById("closeVideoBtn"),
backVideoBtn = document.getElementById("backVideoBtn"),
nextVideoBtn = document.getElementById("nextVideoBtn"),
historyDiv = document.getElementById("historyCon"),
continueShowBtn = document.getElementById("continueShowInfoBtn"),
vidSeasonSelector = document.getElementById("vidSeasonSelector"),
vidEpisodeListDiv = document.getElementById("vidEpisodeList"),
sortBySelect = document.getElementById("sortBy"),
catSelect = document.getElementById("catSelector"),
searchForm = document.getElementById("searchForm"),
searchText = document.getElementById("searchText"),
searchSubmit = document.getElementById("searchSubmit"),
historySeachForm = document.getElementById("hsearchForm"),
historySearchText = document.getElementById("hsearchText"),
historySearchSubmit = document.getElementById("hsearchSubmit");

function removeMediaSession() {
    if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = null;
        navigator.mediaSession.playbackState = "none";
    }
}

PlayerjsEvents = function(event,id,data){
    if(event=="play"){
        if ('mediaSession' in navigator) {
            navigator.mediaSession.playbackState = "playing";
        }
    }

    if (event=="pause") {
        if ('mediaSession' in navigator) navigator.mediaSession.playbackState = "paused";
    }
}

let closeFunction = function() {
    interval.clearAll();
    window.scrollTo(0, 0);
    document.getElementById("player").innerHTML = ""; 
    myPlayer = null;
    removeMediaSession();
    loadHistoryData().then((data) => {
        pushHistoryData(data);
    })
    homePageDiv.style.display = "block";
    showInfoDiv.style.display = "none";
    videoPageDiv.style.display = "none";
}

const closeTo = 0;

const dataName = "historyData-v2-previewpage";

const finishEpisodeInterval = 90;

const svg = `<svg width="20" height="20" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg>`;

var timeoutObj = {showHideTimeout: null,  videoHideTimeout: null, backHideTimeout: null, nextHideTimeout: null};

const compareObj = (objA, objB) => {
  let res  = true;
  Object.keys(objB).forEach(key => {
    if(!objA.hasOwnProperty(key) || objA[key] !== objB[key]) {
      res = false;
    }
  })
  return res;
}


function showButton(elem, timeoutToUse) {
  elem.style.opacity = '1';
  clearTimeout(timeoutObj[timeoutToUse]);
  timeoutObj[timeoutToUse] = setTimeout(() => {
    elem.style.opacity = '0.2';
  }, 2750); // hide after 3 seconds of no interaction
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
    newShowNameText.style.opacity = "50%";
    newShowNameText.style.textDecoration = "underline";
    newShowNameText.style.cursor = "pointer";
    newShowNameText.onclick = function() {
        openShowInfo(data);
    }
    newShowNameText.textContent = data["showTitle"];


    const newShowButton = document.createElement("button");
    newShowButton.style.marginTop = "auto";
    newShowButton.style.borderRadius = "0.75rem"
    newShowButton.className = "btn btn-primary";
    if (data["timeLeft"] !== "Start" && data["timeLeft"] !== 'Watch Again') {
        newShowButton.innerHTML = `<svg width="15" height="15" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg> Continue (${data["timeLeft"]})`;
    } else {
        newShowButton.innerHTML = `<svg width="15" height="15" fill="currentColor" class="bi bi-play-fill" viewBox="0 0 16 16"><path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393"/></svg> Start Watching`;
    }
    newShowButton.onclick = function() {
        document.getElementById("player").removeEventListener("closePlayer", closeFunction);
        closeFunction = function() {
            interval.clearAll();
            window.scrollTo(0, 0);
            document.getElementById("player").innerHTML = "";
            myPlayer = null;
            removeMediaSession();
            loadHistoryData().then((data) => {
                pushHistoryData(data);
            })
            homePageDiv.style.display = "block";
            showInfoDiv.style.display = "none";
            videoPageDiv.style.display = "none";
        }
        document.getElementById("player").addEventListener("closePlayer", closeFunction);
        showTitleInfoPage.onclick = function() {
            interval.clearAll();
            window.scrollTo(0, 0);
            document.getElementById("player").innerHTML = ""; 
            myPlayer = null;
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
    let passData = itsData;
    window.scrollTo(0, 0);
    homePageDiv.style.display = "none";
    showInfoDiv.style.display = "none";
    videoPageDiv.style.display = "block";
    
    // Mutable so updateHistory can track native playlist changes
    let season = parseInt(epToPlay[0]);
    let episode = parseInt(epToPlay[1]);
    
    var showData = showsToExportNew[identifier];
    var showTitle = showData["title"];
    var seasonData = showData[`S${season}`];

    showTitleInfoPage.innerHTML = showTitle;
    epTitleInfoPage.innerHTML = `S${season}E${episode+1} - ${seasonData["epNames"][episode]}`;

    // --- 1. Safely Render UI First ---

    // --- 2. Build PlayerJS Folder Playlist & Calculate Flat Index ---
// --- 2. Build PlayerJS Folder Playlist ---
    let playlist = [];

    for (let s = 1; s <= showData["seasonCount"]; s++) {
        let sData = showData[`S${s}`];
        let seasonFolder = [];
        
        for (let e = 0; e < sData["EpCount"]; e++) {
            seasonFolder.push({
                title: `E${e+1} - ${sData["epNames"][e]}`, 
                file: sData["files"][e],
                id: `S${s}E${e}` // This is all PlayerJS needs now
            });
        }
        
        playlist.push({
            title: sData["title"],
            folder: seasonFolder
        });
    }

// --- 3. Initialize PlayerJS & Force Pixel-Perfect Height ---
    const playerDiv = document.getElementById("player");
    playerDiv.innerHTML = ""; 

    // THE FIX: Break PlayerJS's internal aspect-ratio wrapper

    myPlayer = new Playerjs({
        id: "player",
        file: playlist,
        autonext: 1,
        width: "100%",
        height: "100%"
    });

    // --- 4. OS Media Session Sync Helper ---
    function updateMediaSession(mSeason, mEpisode) {
        if ('mediaSession' in navigator) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: `S${mSeason}E${mEpisode+1} - ${showData[`S${mSeason}`]["epNames"][mEpisode]}`,
                artist: showData["title"], 
                artwork: [{src: showData[`S${mSeason}`]["cover"], sizes: "396x594"}] 
            });
        }

        if ('mediaSession' in navigator) {
            navigator.mediaSession.setActionHandler("play", function() { myPlayer.api("play"); });
            navigator.mediaSession.setActionHandler("pause", function() { myPlayer.api("pause"); });
            navigator.mediaSession.setActionHandler("nexttrack", function() { myPlayer.api("next"); });
            navigator.mediaSession.setActionHandler("previoustrack", function() { myPlayer.api("prev"); });
        }
    }

// --- 5. Start Playback & Setup State Variables ---
    let hasSeekedCurrentTrack = false;
    let targetId = `S${season}E${episode}`;

    // Create a temporary, rapid loop to check when the player API is actually alive
    let playerInitCheck = setInterval(() => {
        try {
            let checkReady = myPlayer.api("id");
            
            if (checkReady !== undefined && checkReady !== null) {
                clearInterval(playerInitCheck); 
                
                // 1. THE FIX: PlayerJS explicitly requires the "id:" prefix for playlist jumps!
                myPlayer.api("play", `id:${targetId}`); 
                myPlayer.api("pause");
                
                // 2. Start your main database history loop
                interval.clearAll();
                interval.make(updateHistory, 2000); 
            }
        } catch (e) {
            // Player API not mounted yet, check again in 100ms.
        }
    }, 100);

    // --- 6. Unified Database Updating & Autoplay logic ---
    async function updateHistory() {
        try {
            // THE FIX: "id" returns the div container name. "playlist_id" returns our "S1E0" string!
            let currentId = myPlayer.api("playlist_id");

            // Safety check: wait until the playlist is fully locked in
            if (currentId === undefined || currentId === null) return; 

            let trackChanged = false;
            
            // Check if user clicked a new track or player auto-advanced
            if (currentId !== `S${season}E${episode}`) {
                let parts = currentId.match(/^S(\d+)E(\d+)$/);
                if (parts) {
                    season = parseInt(parts[1]);
                    episode = parseInt(parts[2]);
                    
                    epTitleInfoPage.innerHTML = `S${season}E${episode+1} - ${showData[`S${season}`]["epNames"][episode]}`; 
                    updateMediaSession(season, episode);
                    
                    hasSeekedCurrentTrack = false; 
                    trackChanged = true;
                }
            }

            var dbData = await get(dataName) || { history: [], conWatchData: [], historyData: {} };

            if (!dbData.history) dbData.history = [];
            if (!dbData.conWatchData) dbData.conWatchData = [];
            if (!dbData.historyData) dbData.historyData = {};
            if (!dbData.historyData[identifier]) dbData.historyData[identifier] = {};
            if (!dbData.historyData[identifier][`S${season}`]) dbData.historyData[identifier][`S${season}`] = {};
            if (!dbData.historyData[identifier][`S${season}`][`EP${episode+1}`]) dbData.historyData[identifier][`S${season}`][`EP${episode+1}`] = {};

            if (trackChanged) {
                var newLog = { "showIdentifier": identifier, "currentSeason": season, "currentEpisode": episode + 1 };

                dbData.history = dbData.history.filter(o => !(o.showIdentifier === newLog.showIdentifier && o.currentSeason === newLog.currentSeason && o.currentEpisode === newLog.currentEpisode));
                dbData.history.unshift(newLog);

                dbData.conWatchData = dbData.conWatchData.filter(o => o.showIdentifier !== newLog.showIdentifier);
                dbData.conWatchData.unshift(newLog);
                if (dbData.conWatchData.length > 12) dbData.conWatchData.pop();

                dbData.historyData[identifier]["mostRecent"] = [season, episode + 1];

                await set(dataName, dbData);
            }

            var showHistoryData = dbData.historyData[identifier];
            let currentTime = myPlayer.api("time");
            let duration = myPlayer.api("duration");

            // NEW: Safe Seeking Block
            if (!hasSeekedCurrentTrack && duration > 0 && !isNaN(duration)) {
                let savedTime = showHistoryData?.[`S${season}`]?.[`EP${episode+1}`]?.currentTime;
                
                if (savedTime > 0 && (savedTime + finishEpisodeInterval) <= duration) {
                    myPlayer.api("seek", savedTime);
                }

                if ('mediaSession' in navigator) {
                    updateMediaSession(season, episode);
                }
                
                hasSeekedCurrentTrack = true; 
                return; // Do not save history right now! Exit and wait for the seek to finish.
            }
            
            // NEW: Complete hard stop. Prevents history updating with 0 before the video is fully loaded.
            if (!hasSeekedCurrentTrack) return;
            myPlayer.api("play");
            
            if (currentTime !== undefined && currentTime !== null && !isNaN(currentTime)) {
                showHistoryData[`S${season}`][`EP${episode+1}`]["currentTime"] = currentTime;
            }
            
            if (duration && currentTime !== undefined && currentTime !== null && !isNaN(currentTime)) {
                if (currentTime > 10 && currentTime + finishEpisodeInterval < duration) {
                    showHistoryData[`S${season}`][`EP${episode+1}`]["timeLeft"] = `${formatTime((duration-currentTime))} left`;
                } else if (currentTime > 10 && currentTime + finishEpisodeInterval >= duration) {
                    
                    var seasonForData = season;
                    var episodeForData = episode + 2;
                    
                    if (episodeForData > showData[`S${season}`]['EpCount']) {
                        if (season + 1 <= showData["seasonCount"] && showData[`S${season+1}`]['EpCount'] >= 1) {
                            seasonForData = season + 1;
                            episodeForData = 1;
                        } else {
                            seasonForData = null; 
                        }
                    }
                    
                    if (seasonForData !== null) {
                        var nextLog = { "showIdentifier": identifier, "currentSeason": seasonForData, "currentEpisode": episodeForData };
                        
                        dbData.conWatchData = dbData.conWatchData.filter(o => o.showIdentifier !== nextLog.showIdentifier);
                        dbData.conWatchData.unshift(nextLog);
                        if (dbData.conWatchData.length > 12) dbData.conWatchData.pop();

                        dbData.historyData[identifier]["mostRecent"] = [seasonForData, episodeForData];
                    } else {
                        dbData.conWatchData = dbData.conWatchData.filter(o => o.showIdentifier !== identifier);
                        dbData.historyData[identifier]["mostRecent"] = [];
                    }
                    showHistoryData[`S${season}`][`EP${episode+1}`]["timeLeft"] = "Watch Again";
                }
            }
            
            await set(dataName, dbData); 
            
        } catch (err) {
            console.error("Update history failed:", err);
        }
    }

    // Capture first log manually to guarantee jump buttons work immediately 
    let initLog = { "showIdentifier": identifier, "currentSeason": season, "currentEpisode": episode + 1 };
    let dbInit = await get(dataName) || { history: [], conWatchData: [], historyData: {} };
    if (!dbInit.history) dbInit.history = [];
    if (!dbInit.conWatchData) dbInit.conWatchData = [];
    if (!dbInit.historyData) dbInit.historyData = {};
    if (!dbInit.historyData[identifier]) dbInit.historyData[identifier] = {};
    
    dbInit.history = dbInit.history.filter(o => !(o.showIdentifier === initLog.showIdentifier && o.currentSeason === initLog.currentSeason && o.currentEpisode === initLog.currentEpisode));
    dbInit.history.unshift(initLog);

    dbInit.conWatchData = dbInit.conWatchData.filter(o => o.showIdentifier !== initLog.showIdentifier);
    dbInit.conWatchData.unshift(initLog);
    if (dbInit.conWatchData.length > 12) dbInit.conWatchData.pop();

    dbInit.historyData[identifier]["mostRecent"] = [season, episode + 1];
    await set(dataName, dbInit);
}

async function openShowInfo(dataToPass) {
    interval.clearAll();
    let data = dataToPass;
    window.scrollTo(0, 0);
    homePageDiv.style.display = "none";
    videoPageDiv.style.display = "none";

    // --- PlayerJS Cleanup (Replaces old videoPlayer.pause() logic) ---
    document.getElementById("player").innerHTML = ""; 
    myPlayer = null;
    // -----------------------------------------------------------------
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
        var historyDatav2 = await get(dataName);
        var historyData = historyDatav2["historyData"];
        var showHistoryData = historyData[data["identifier"]];
        
        for (let i = 0; i < seasonDataSelected["EpCount"]; i++) {
            let newEp = document.createElement("button");
            newEp.className = "epBtn";
            newEp.innerHTML = `${i+1}.&ensp;${seasonDataSelected["epNames"][i]} <span style="opacity: 0.75;">(${showHistoryData[`S${seasonSelector.value}`][`EP${i+1}`]["timeLeft"]})</span>`;
            newEp.onclick = function() {
                playEpisode(data["identifier"], [seasonSelector.value, i], dataToPass);
            }
            epList.appendChild(newEp);
        }
    }
    seasonSelector.onchange = seasonChange;

    closeBtn.onclick = function() {
        window.scrollTo(0, 0);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
        homePageDiv.style.display = "block";
        showInfoDiv.style.display = "none";
        videoPageDiv.style.display = "none";
    }
    document.getElementById("player").removeEventListener("closePlayer", closeFunction);
    closeFunction = function() {
        interval.clearAll();
        window.scrollTo(0, 0);
        document.getElementById("player").innerHTML = ""; 
        myPlayer = null;
        removeMediaSession();
        openShowInfo(data);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
        homePageDiv.style.display = "none";
        showInfoDiv.style.display = "block";
        videoPageDiv.style.display = "none";
    }
    document.getElementById("player").addEventListener("closePlayer", closeFunction);
    showTitleInfoPage.onclick = function() {
        interval.clearAll();
        window.scrollTo(0, 0);
        
        // Ensure video background audio stops playing
        document.getElementById("player").innerHTML = ""; 
        myPlayer = null;
        
        openShowInfo(data);
        loadHistoryData().then((data) => {
            pushHistoryData(data);
        })
    }
    

    var historyDatav2 = await get(dataName);
    var historyData = historyDatav2["historyData"];
    var showHistoryData = historyData[data["identifier"]];
    var mostRecent = showHistoryData["mostRecent"];

    if (mostRecent.length == 2) {
        continueShowBtn.innerHTML = `${svg} S${mostRecent[0]} E${mostRecent[1]} - ${showData[`S${mostRecent[0]}`]["epNames"][mostRecent[1]-1]} (${showHistoryData[`S${mostRecent[0]}`][`EP${mostRecent[1]}`]["timeLeft"]})`;
        seasonSelector.value = mostRecent[0];
        seasonChange();
        continueShowBtn.onclick = function() {
            playEpisode(data["identifier"], [mostRecent[0], mostRecent[1]-1], dataToPass);
        }
    } else {
        continueShowBtn.innerHTML = `${svg} Start Watching`;
        seasonChange();
        continueShowBtn.onclick = function() {
            playEpisode(data["identifier"], [1,0], dataToPass);
        }
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
    const newData = await get(dataName);
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

        await set(dataName, newHistoryDataToSet);
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
        await set(dataName, newData);
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

        await set(dataName, newHistoryDataToSet);
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
                document.getElementById("player").removeEventListener("closePlayer", closeFunction);
                closeFunction = function() {
                    interval.clearAll();
                    window.scrollTo(0, 0);
                    document.getElementById("player").innerHTML = ""; 
                    myPlayer = null;
                    removeMediaSession();
                    loadHistoryData().then((data) => {
                        pushHistoryData(data);
                    })
                    homePageDiv.style.display = "block";
                    showInfoDiv.style.display = "none";
                    videoPageDiv.style.display = "none";
                }
                document.getElementById("player").addEventListener("closePlayer", closeFunction);
                showTitleInfoPage.onclick = function() {
                    interval.clearAll();
                    window.scrollTo(0, 0);
                    document.getElementById("player").innerHTML = ""; 
                    myPlayer = null;
                    loadHistoryData().then((data) => {
                        pushHistoryData(data);
                    })
                    openShowInfo(dataForCard);
                }
                playEpisode(item["showIdentifier"], [item["currentSeason"], item["currentEpisode"]-1], dataForCard);
            }
            historyDiv.appendChild(newHistoryElem);
        })
        if (historySearchText.value.length > 0) {
            historySeachForm.requestSubmit();
        }
    }
}

function categoryCreate() {
    Object.keys(categories).forEach((key) => {
        var newOption = document.createElement("option");
        newOption.value = key;
        newOption.innerHTML = key;
        catSelect.appendChild(newOption);
    });
    loadShows();
    sortBySelect.onchange = function() {
        if (searchText.value.length < 1) {
            loadShows();
        } else {
            searchForm.requestSubmit();
        }
    }
    catSelect.onchange = function() {
        if (searchText.value.length < 1) {
            loadShows();
        } else {
            searchForm.requestSubmit();
        }
    }
    
    searchForm.onsubmit = function(e) {
        e.preventDefault();

        var searchQuery = searchText.value;
        var titleList = [];
        categories[catSelect.value]["updateOrder"].forEach((show) => {
            titleList.push(show["title"]);
        })
        var filteredResults = titleList.filter(title =>  title.toLowerCase().includes(searchQuery.toLowerCase()));
        const showContainer = document.getElementById("showListPage");
        showContainer.innerHTML = "";
        var orderValue = sortBySelect.value;
        if (orderValue == 1) {
            filteredResults.forEach(showTitle => {
                categories[catSelect.value]["updateOrder"].forEach((show) => {
                    if (show["title"] == showTitle) {
                        var dataForCard = {
                            "seasonCount": show["seasonCount"],
                            "episodeCount": show["totalEpisodes"],
                            "showTitle": show["title"],
                            "img": show[`S${show["seasonCount"]}`]["cover"],
                            "identifier": show["showIdentifier"]
                        }
                        createShowCard(dataForCard, showContainer);
                    }
                })
            })
        } else if (orderValue == 2) {
            filteredResults.reverse();
            filteredResults.forEach(showTitle => {
                categories[catSelect.value]["updateOrder"].forEach((show) => {
                    if (show["title"] == showTitle) {
                        var dataForCard = {
                            "seasonCount": show["seasonCount"],
                            "episodeCount": show["totalEpisodes"],
                            "showTitle": show["title"],
                            "img": show[`S${show["seasonCount"]}`]["cover"],
                            "identifier": show["showIdentifier"]
                        }
                        createShowCard(dataForCard, showContainer);
                    }
                })
            })
        } else if (orderValue == 3) {
            filteredResults.sort();
            filteredResults.forEach(showTitle => {
                categories[catSelect.value]["updateOrder"].forEach((show) => {
                    if (show["title"] == showTitle) {
                        var dataForCard = {
                            "seasonCount": show["seasonCount"],
                            "episodeCount": show["totalEpisodes"],
                            "showTitle": show["title"],
                            "img": show[`S${show["seasonCount"]}`]["cover"],
                            "identifier": show["showIdentifier"]
                        }
                        createShowCard(dataForCard, showContainer);
                    }
                })
            })
        } else {
            alert("an unknown error has occured");
        }
    }
}

function loadShows() {
    document.getElementById("newestContainer").innerHTML = "";
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
    showContainer.innerHTML = "";
    var orderValue = sortBySelect.value;
    var updateOrder = categories[catSelect.value]["updateOrder"];
    if (orderValue == "1") {
        for (let i = 0; i < updateOrder.length; i++) {
            var show = updateOrder[i];
            var dataForCard = {
                "seasonCount": show["seasonCount"],
                "episodeCount": show["totalEpisodes"],
                "showTitle": show["title"],
                "img": show[`S${show["seasonCount"]}`]["cover"],
                "identifier": show["showIdentifier"]
            }
            createShowCard(dataForCard, showContainer);
        }
    } else if (orderValue == "2") {
        for (let i = updateOrder.length-1; i >= 0; i--) {
            var show = updateOrder[i];
            var dataForCard = {
                "seasonCount": show["seasonCount"],
                "episodeCount": show["totalEpisodes"],
                "showTitle": show["title"],
                "img": show[`S${show["seasonCount"]}`]["cover"],
                "identifier": show["showIdentifier"]
            }
            createShowCard(dataForCard, showContainer);
        }
    } else if (orderValue == "3") {
        var showNameAlphabetical = [];
        var showOrder = [];
        updateOrder.forEach((show) => {
            showNameAlphabetical.push(show["title"]);
        })
        showNameAlphabetical.sort();
        showNameAlphabetical.forEach((showName) => {
            updateOrder.forEach((show) => {
                if (show["title"] == showName) {
                    showOrder.push(show);
                }
            })
        })
        showOrder.forEach((show) => {
            var dataForCard = {
                "seasonCount": show["seasonCount"],
                "episodeCount": show["totalEpisodes"],
                "showTitle": show["title"],
                "img": show[`S${show["seasonCount"]}`]["cover"],
                "identifier": show["showIdentifier"]
            }
            createShowCard(dataForCard, showContainer);
        })
        
    } else {
        alert("An unknown error has occured.");
    }
    // Object.keys(showsToExportNew).forEach((key) => {
    //     var show = showsToExportNew[key];
    //     var dataForCard = {
    //         "seasonCount": show["seasonCount"],
    //         "episodeCount": show["totalEpisodes"],
    //         "showTitle": show["title"],
    //         "img": show[`S${show["seasonCount"]}`]["cover"],
    //         "identifier": show["showIdentifier"]
    //     }
    //     createShowCard(dataForCard, showContainer);
    // })
}

loadHistoryData().then((data) => {
    pushHistoryData(data);
})

categoryCreate();

// showInfoDiv.addEventListener("mousemove", function() {
//     showButton(closeBtn, "showHideTimeout");
// });
// showInfoDiv.addEventListener("focus", function() {
//     showButton(closeBtn, "showHideTimeout");
// })
// closeBtn.addEventListener("mousemove", function() {
//     showButton(closeBtn, "showHideTimeout");
// });
// closeBtn.addEventListener("focus", function() {
//     showButton(closeBtn, "showHideTimeout");
// })
// showInfoDiv.addEventListener("click", function() {
//     showButton(closeBtn, "showHideTimeout");
// })

async function downloadHistory() {
    var historyData = await get(dataName);
    var jsonData = JSON.stringify(historyData, null, 2);
    var newBlob = new Blob([jsonData], {type: "application/json"});

    var newUrl = URL.createObjectURL(newBlob);

    var newA = document.createElement("a");
    newA.href = newUrl;
    newA.download = `historyData_v2(${new Date().toLocaleDateString("en-CA")}_${new Date().toLocaleTimeString("en-GB", {hour12: false}).replace(/:/g, '-')}).json`;
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

                    Object.keys(showsToExportNew).forEach((identifier) => {
                        if (!historyData[identifier]) {
                            historyData[identifier] = {};
                            historyData[identifier]["mostRecent"] = [];
                        }
                        for (let i = 1; i <= showsToExportNew[identifier]["seasonCount"]; i++) {
                            if (!historyData[identifier][`S${i}`]) {
                                historyData[identifier][`S${i}`] = {};
                            }
                            for (let i2 = 1; i2 <= showsToExportNew[identifier][`S${i}`]["EpCount"]; i2++) {
                                if (!historyData[identifier][`S${i}`][`EP${i2}`]) {
                                    historyData[identifier][`S${i}`][`EP${i2}`] = {
                                        "currentTime": 0,
                                        "timeLeft": "Start"
                                    }
                                }
                            }
                        }
                    })

                    
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
                            await set(dataName, newObj);
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
    await set(dataName, null);
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

historySeachForm.onsubmit = function(e) {
    e.preventDefault();

    var historyList = [];
    var query = historySearchText.value;

    for (const child of historyDiv.children) {
        historyList.push(child.textContent);
    }

    var filteredList = historyList.filter(item => item.split("(")[0].toLowerCase().includes(query.toLowerCase()));

    for (const child of historyDiv.children) {
        if (filteredList.includes(child.textContent)) {
            child.style.display = "block";
        } else {
            child.style.display = "none";
        }
    }
}
