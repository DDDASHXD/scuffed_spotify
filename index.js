var MPlayer = require('mplayer')
var player = new MPlayer();
var term = require('terminal-kit').terminal

term.grabInput({mouse: 'button'})

class song {
    constructor(id, artist, name, file, played) {
        this.id = id;
        this.artist = artist;
        this.name = name;
        this.file = file;
        this.played = played;
    }
}

let songLibrary = [
    new song (0, 'lmao', "Dance till you're dead", "audio/dance_till_youre_dead.mp3", false),
    new song (1, 'Leonz', "Among us drip", "audio/among_us_drip.mp3", false),
    new song (2, 'NightshiftTV', "Drive forever", "audio/drive_forever.mp3", false),
    new song (3, 'Pind', "Plastic", "audio/plastic.mp3", false),
    new song (4, 'NOMA', 'Brain Power', 'audio/brain_power.mp3', false),
    new song (5, 'Unknown', 'Le Fishe', 'audio/le_fishe.mp3', false),
    new song (6, 'SwagBlunt420', 'Pølsemix', 'audio/poelsemix.mp3', false),
    new song (7, 'Eminem', "Mom's spaghetti", 'audio/moms_spaghetti.mp3', false),
    new song (8, 'Harold Faltermeyer', 'Axel F', 'audio/axel_f.mp3', false)
]

var mainItems = [
    'Now playing',
    'Library',
    'Help!',
    'exit',
]

var libraryItems = [
    'Search',
    'Back',
    'Add custom song',
    'Shuffle',
]

for (i = 0; i < songLibrary.length; i++){
    libraryItems[i+4] = songLibrary[i].artist + ' - ' + songLibrary[i].name;
}

var nowPlayingItems = [
    'Back',
    'Queue',
    'Play/Resume',
    'Pause',
    'Stop',
    'Skip',
    'Skip backwards',
]

var searchResultItems = [
    'Search again',
    'Go back'
]

var volumeItems = [
    'Back',
    'Volume Up',
    'Volume Down',
    'Toggle mute',
]

var queueItems = [
    'back',
]

var songQueue = [
];

var currentQueuePos;

var shuffle = false;
var manualStop = false;
var manualStart = false;
var skipped = false;

var nowPlayingTitle = 'Nothing';

function getRandomId(max) {
    return Math.floor(Math.random() * max);
}

function filterByValue(array, value) {
    return array.filter((data) =>  JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1);
}

function s(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle...
    while (currentIndex != 0) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

function clear() {
    console.log('\033[2J');
}

player.on('stop', function() {
    nowPlayingTitle = 'Nothing'
    if (shuffle == false) {
        if (manualStop == false) {
            currentQueuePos++
            player.openFile(songQueue[currentQueuePos].file)
        } else if (skipped == true) {
            skipped = false;
        } else {
            songQueue = []
        }
    }
})

player.on('start', function() {
    manualStop = false;
    if (shuffle == false) {
        songQueue = []
        if (manualStart == true && shuffle == false) {
            for (i = 0; i < songLibrary.length; i++) {
                songQueue.push(songLibrary[i])
            }
            manualStart = false;
        } else {
    
        }
    } else {

    }

    //nowPlayingTitle = songQueue[currentQueuePos].artist + ' - ' + songQueue[currentQueuePos].name;
})

function main() {
    clear();
    term.singleColumnMenu(mainItems, function(error, r) {
        if (r.selectedIndex == 0) {
            nowPlaying();
        } else if (r.selectedIndex == 1) {
            library();
        } else if (r.selectedIndex == 2 ) {
            help();
        } else if (r.selectedIndex == 3 ) {
            process.exit();
        }
    })
}

function library() {
    clear();
    term.singleColumnMenu(libraryItems, function(error, r) {
        if (r.selectedIndex == 0) {
            search();
        } else if (r.selectedIndex == 1) {
            main();
        } else if (r.selectedIndex == 2) {
            addCustom();
        } else if (r.selectedIndex == 3) {
            beginShuffle();
        } else {
            manualStart = true;
            manualStop = true;
            shuffle = false;
            currentQueuePos = songLibrary.findIndex(x => x.name === r.selectedText.substring(r.selectedText.indexOf("-") +2))
            player.openFile(songLibrary[currentQueuePos].file)
            library();
        }
    })
}

function beginShuffle() {
    shuffle = true;
    currentQueuePos = 0;
    for (i = 0; i < songLibrary.length; i++) {
        songQueue.push(songLibrary[i])
    }
    s(songQueue);
    player.openFile(songQueue[currentQueuePos].file)
    library();
}

function nowPlaying() {
    clear();
    term('Now playing: ' + nowPlayingTitle);
    term.singleColumnMenu(nowPlayingItems, function(error, r) {
        if (r.selectedIndex == 0) {
            main();
        } else if (r.selectedIndex == 1) {
            viewQueue();
        } else if (r.selectedIndex == 2) {
            player.play();
            nowPlaying();
        } else if (r.selectedIndex == 3) {
            player.pause();
            nowPlaying();
        } else if (r.selectedIndex == 4) {
            manualStop = true;
            player.stop();
            nowPlaying();
        } else if (r.selectedIndex == 5) {
            skip();
        } else if (r.selectedIndex == 6) {
            skipBack();
        }
    })
}

function viewQueue() {
    queueItems = [
        'Back'
    ]
    if (shuffle == false) {
        for (i = currentQueuePos; i < songQueue.length; i++) {
            queueItems.push(songQueue[i].artist + ' - ' + songQueue[i].name)
        }
    } else {
        for (i = 0; i < songQueue.length; i++) {
            queueItems.push(songQueue[i].artist + ' - ' + songQueue[i].name)
        }
    }

    term.singleColumnMenu(queueItems, function(error, r) {
        if (r.selectedIndex == 0) {
            nowPlaying();
        }
    })
}

function skip() {
    manualStop = true;
    skipped = true;
    currentQueuePos++
    player.openFile(songQueue[currentQueuePos].file)
    nowPlaying();
}

function skipBack() {
    manualStop = true;
    skipped = true;
    currentQueuePos--
    player.openFile(songQueue[currentQueuePos].file)
    nowPlaying();
}

function search() {
    term('\nWhat do you want to search for?: ')
    term.inputField(
        {autoCompleteMenu: false},
        function( error, input ) {
            var result = filterByValue(songLibrary, input);
            searchResult(result, input);
            //term(result);
        }
    )
}

function searchResult(result, input) {
    clear();
    for (i = 0; i < result.length; i++) {
        searchResultItems[i+2] = result[i].artist + ' - ' + result[i].name
    }
    term.green('Search query: ' + input)
    term.singleColumnMenu(searchResultItems, function(error, response) {
        term('\n');
        if (response.selectedIndex == 0) {
            search();
        } else if (response.selectedIndex == 1) {
            library();
        } else {
            nowPlayingTitle = response.selectedText;
            var playItem = filterByValue(songLibrary, response.selectedText.substring(response.selectedText.indexOf("-") +2));
            manualStop = true;
            player.openFile(playItem[0].file);
            library();
        }
    })
}

function help() {
    clear();

    console.log('....... ▄▄ ▄▄')
    console.log('......▄▌▒▒▀▒▒▐▄')
    console.log('.... ▐▒▒▒▒▒▒▒▒▒▌')
    console.log('... ▐▒▒▒▒▒▒▒▒▒▒▒▌')
    console.log('....▐▒▒▒▒▒▒▒▒▒▒▒▌')
    console.log('....▐▀▄▄▄▄▄▄▄▄▄▀▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')
    console.log('....▐░░░░░░░░░░░▌')    
    console.log('...▄█▓░░░░░░░░░▓█▄')
    console.log('..▄▀░░░░░░░░░░░░░ ▀▄')
    console.log('.▐░░░░░░░▀▄▒▄▀░░░░░░▌')
    console.log('▐░░░░░░░░▒▒▐▒▒░░░░░░░▌')
    console.log('▐▒░░░░░░▒▒▒▐▒▒▒░░░░░▒▌')
    console.log('.▀▄▒▒▒▒▒▒▄▀▒▀▄▒▒▒▒▒▄▀')
    console.log('..... ▀▀▀▀▀ ▀▀▀▀▀')
    process.exit()
}

main();