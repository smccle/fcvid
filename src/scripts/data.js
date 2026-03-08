const ES = {
    "title": "Example Show",
    "showIdentifier": "ES",
    "seasonCount": 2,
    "totalEpisodes": 5,
    "synopsis": "Example Synopsis",
    "S1": {
        "title": "Season 1",
        "cover": imageBase64["ES"],
        "EpCount": 3,
        "files": ["./sample/sample-5s.mp4", "./sample/sample-5s.mp4", "./sample/sample-5s.mp4"],
        "epNames": ["Example Name 1", "Example Name 2", "Example Name 3"]
    },
    "S2": {
        "title": "Season 2",
        "cover": imageBase64["ES"],
        "EpCount": 2,
        "files": ["./sample/sample-5s.mp4", "./sample/sample-5s.mp4"],
        "epNames": ["Name 1", "Example Name 2"]
    }
}

const ES2 = {
    "title": "Example Show 2",
    "showIdentifier": "ES2",
    "seasonCount": 2,
    "totalEpisodes": 7,
    "synopsis": "Example Synopsis",
    "S1": {
        "title": "Example Arc",
        "cover": imageBase64["ES"],
        "EpCount": 4,
        "files": ["./sample/sample-5s.mp4", "./sample/sample-5s.mp4", "./sample/sample-5s.mp4", "./sample/sample-5s.mp4"],
        "epNames": ["Powerful", "Cool", "Useful", "Need"]
    },
    "S2": {
        "title": "Example Training Arc",
        "cover": imageBase64["ES"],
        "EpCount": 3,
        "files": ["./sample/sample-5s.mp4", "./sample/sample-5s.mp4", "./sample/sample-5s.mp4"],
        "epNames": ["Utility", "Want", "Ending"]
    }
}

const showsToExportNew = {
    "ES": ES,
    "ES2": ES2
}

const recentlyUpdated = [ES2];

const EXPlaylist = {
    "title": "Example Playlist",
    "cover": "",
    "totalSongs": 6,
    "files": []
}

const EXAlbum = {
    "title": "Example Album",
    "artist": "A person",
    "cover": "",
    "totalSongs": 3,
    "files": [],
    "customMetadata": true,
    "metadata": [{"title": "Hello"}]
}

const EXSingle = {
    "title": "Example",
    "cover": "",
    "versions": 1,
    "files": []
}

const playlists = {
    "EXPlaylist": EXPlaylist
}

const albums = {
    "EXAlbum": EXAlbum
}

const singles = {
    "EXSingle": EXSingle
}

const newestMusic = [EXPlaylist, EXAlbum, EXSingle]