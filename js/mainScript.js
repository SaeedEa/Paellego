var input = document.getElementById('inputFile');
var progressBarValue = document.getElementById('progressBar');
var mainButton = document.getElementById('continueButton');
var pauseButton = document.getElementById('pauseButton');
var restartButton = document.getElementById('restartButton');
var restartCheckpoint = document.getElementById('restartCheckpoint');
var readPos = document.getElementById("readPos");
var speedInc = document.getElementById("speedInc");
var speedDec = document.getElementById("speedDec");
speedInc.innerHTML = ">";
speedDec.innerHTML = "<";


var wordsTemp;
var $box = document.getElementById('box');
var sec = 300;
var checkpoints = document.getElementById('checkPointsList');
var flag = false;
var flagOneTime = 0;
var i = 1;
var file;
var words;
var read;
var stopFlag = false;

mainButton.innerHTML = "Start";
pauseButton.innerHTML = "Pause";
restartCheckpoint.style.display = "none";
mainButton.style.display = "none";
pauseButton.style.display = "none";
restartButton.style.display = "none";
readPos.style.display = "none";
speedInc.style.display = "none";
speedDec.style.display = "none";

function onLoadfun() {
    // localStorage.removeItem("PaellegoHelp");
    if (!localStorage.getItem("PaellegoHelp")) {
        localStorage.setItem("PaellegoHelp", "V");
        $("#openningModal").modal();
        $('[data-toggle="tooltipDec"]').tooltip({ title: "Decrease speed" });
        $('[data-toggle="tooltipInc"]').tooltip({ title: "Increase speed" });
        $('[data-toggle="tooltipDec"]').tooltip();
        $('[data-toggle="tooltipInc"]').tooltip();
    }
}

document.getElementById("openningModalLink").addEventListener('click', () => {
    $("#openningModal").modal('hide');
});

restartButton.addEventListener('click', () => {
    location.reload();
});

restartCheckpoint.addEventListener('click', () => {
    pause();
    restoreCheckpoing();
});

input.addEventListener('change', () => {
    flag = true;
    mainButton.style.display = "inline-block";
    restartButton.style.display = "inline-block";
    readPos.style.display = "inline-block";
    speedInc.style.display = "inline-block";
    speedDec.style.display = "inline-block";

    input.style.display = "none";
    main();
});

document.getElementById("stopCheckpoint").addEventListener('change', () => {
    stopFlag = document.getElementById("stopCheckpoint").checked;
});

mainButton.addEventListener('click', () => {
    mainButton.style.display = "none";
    pauseButton.style.display = "inline-block";
    document.getElementById("read").scrollIntoView();
    if (!flag) {
        flag = true;
        document.getElementById("mainText").innerText = newWord(0);
        document.getElementById("nextText").innerText = newWord(1);
        document.getElementById("nextText2").innerText = newWord(2);
        document.getElementById("nextText3").innerText = newWord(3);
    }
    start();
});

function main() {
    i = 0;
    let files = input.files;

    if (files.length == 0) return;

    file = files[0];

    let reader = new FileReader();

    reader.onload = (e) => {
        file = e.target.result;
        words = file.split(" ");
        wordsTemp = file.split(" ");
        readPos.max = words.length;
        $box.innerHTML = file;
        showWords();
    };
    reader.onerror = (e) => alert(e.target.error.name);

    reader.readAsText(file);
}

document.getElementById('modal1ButtonRead').addEventListener('click', () => {
    // $box.innerHTML = "";
    // document.getElementById("mainText").innerText = "";
    // document.getElementById("nextText").innerText = "";
    // document.getElementById("nextText2").innerText = "";
    // document.getElementById("nextText3").innerText = "";
    // document.getElementById("prevText").innerText = "";
    // document.getElementById("prevText2").innerText = "";
    // document.getElementById("prevText3").innerText = "";
    flag = flag;
    i = 0;
    words = $box.innerHTML.split(" ");
    wordsTemp = $box.innerHTML.split(" ");
    readPos.max = words.length;
    document.getElementById("mainText").innerText = newWord(0);
    document.getElementById("nextText").innerText = newWord(1);
    document.getElementById("nextText2").innerText = newWord(2);
    document.getElementById("nextText3").innerText = newWord(3);

});

pauseButton.addEventListener('click', pause);

speedInc.addEventListener('click', () => {
    pause();
    sec -= 10;
});
speedDec.addEventListener('click', () => {
    pause();
    sec += 10;
});

readPos.addEventListener('input', () => {
    pause();
    i = Number(readPos.value);

    //Problem with show next words
    showWords();

});

function start() {
    read = setInterval(() => {
        readPos.value = i;
        showWords();
        let word = newWord(i);
        if (word.length > 9) {
            delay();
        }

        if (newWord(i).indexOf(".") != -1) {
            if (stopFlag)
                pause();
            addCheckpoint(i);
        }

        i++;
        if (i > words.length) return;

    }, sec);
}

function newWord(index) {
    let newWordTemp = "";
    for (let z = 0; z < words[index].length; z++)
        if (words[index][z] != "\n") newWordTemp += words[index][z];
    return newWordTemp;
}

// Highlight Fun
function highlighText() {
    let wordsTemp2 = [];
    for (let j = 0; j < wordsTemp.length; j++)
        wordsTemp2[j] = wordsTemp[j];
    const regex = new RegExp(wordsTemp2[i], 'gi');
    wordsTemp2[i] = wordsTemp2[i].replace(regex, '<mark class="highlight">$&</mark>');
    $box.innerHTML = wordsTemp2.join(" ");
    var elmnt = document.getElementsByClassName("highlight");

    var show = document.getElementById("box");
    show.scrollTop = elmnt[0].offsetTop;
}

//Old
// function highlighText(prev, cur, next) {
//     const searchText = prev + " " + cur + " " + next;
//     const regex = new RegExp(searchText, 'gi');

//     let text = $box.innerHTML;
//     text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');

//     const newText = text.replace(regex, '<mark class="highlight">$&</mark>');
//     $box.innerHTML = newText;
//     var elmnt = document.getElementsByClassName("highlight");
//     var show = document.getElementById("box");
//     show.scrollTop = elmnt[0].offsetTop;
// }

//Pause function
function pause() {
    mainButton.style.display = "inline-block";
    pauseButton.style.display = "none";
    mainButton.innerHTML = "Continue";
    clearInterval(read);
}

function addCheckpoint(pos) {
    let flag = true;
    const checkTitle = newWord(pos + 1) + " " + newWord(pos + 2) + " " + newWord(pos + 3) + " " + newWord(pos + 4) + "...";
    var opt = document.createElement('option');
    opt.value = pos;
    opt.innerHTML = checkTitle;
    for (let k = 0; k < checkpoints.length; k++)
        if (checkpoints[k].value == pos)
            flag = false;
    if (flag)
        checkpoints.appendChild(opt);
    restartCheckpoint.style.display = "inline-block";

}

function restoreCheckpoing() {
    var selectedIndex = checkpoints.selectedIndex;
    i = Number(checkpoints[selectedIndex].value) + 1;
    showWords();
}

function showWords() {
    if (i > words.length) return;
    let word, prevWord, prevWord2, prevWord3, nextWord1, nextWord2, nextWord3;
    if (i > 0) {
        prevWord = newWord(i - 1);
        document.getElementById("prevText").innerText = prevWord;
        showStyle(prevWord, document.getElementById("prevText"), "left", 12, 15, 20);
        if (i > 1) {
            prevWord2 = newWord(i - 2);
            document.getElementById("prevText2").innerText = prevWord2;
            showStyle(prevWord2, document.getElementById("prevText2"), "left", 3, 7, 12);

            if (i > 2) {
                prevWord3 = newWord(i - 3);
                document.getElementById("prevText3").innerText = prevWord3;
                showStyle(prevWord3, document.getElementById("prevText3"), "left", 0, 4, 7);
            }
        }
    }
    word = newWord(i);
    nextWord = newWord(i + 1);
    nextWord2 = newWord(i + 2);
    nextWord3 = newWord(i + 3);
    highlighText();

    document.getElementById("mainText").innerText = word;
    document.getElementById("nextText").innerText = nextWord;
    document.getElementById("nextText2").innerText = nextWord2;
    document.getElementById("nextText3").innerText = nextWord3;
    showStyle(word, document.getElementById("mainText"), "left", 20, 35, 40);
    showStyle(nextWord, document.getElementById("nextText"), "right", 10, 20, 25);
    showStyle(nextWord2, document.getElementById("nextText2"), "right", 5, 10, 15);
    showStyle(nextWord3, document.getElementById("nextText3"), "right", 0, 5, 10);



    if (i == words.length - 1) progressBarValue.style.width = "100%";
    else progressBarValue.style.width = (i / words.length) * 100 + "%";

}

function clearHighlight() {
    if ($box.innerHTML.indexOf("<mark") != -1) {
        $box.innerHTML = $box.innerHTML.replace('<mark class="highlight">', "");
        $box.innerHTML = $box.innerHTML.replace('</mark>', "");
    }
}

function showStyle(w, element, dir, perc1, perc2, perc3) {
    if (w == undefined) return;
    if (w.length > 9)
        element.style = dir + ": " + perc1 + "%";
    else if (w.length > 3)
        element.style = dir + ": " + perc2 + "%";
    else
        element.style = dir + ": " + perc3 + "%";
}

function getHighlightedText() {
    pause();
    let selectedText = '';
    selectedText = document.getSelection();
    let k = selectedText["anchorOffset"];
    let count = 0;
    console.log(k);
    for (let j = 0; j < k; j++) {
        if (file[j] == " ") count++;
        // if (file[j] == "\n" && file[j - 1] == ".") console.log("new line " + k);
    }
    i = count;
    // if (Math.abs(k - i) < 500) {
    //     for (let j = 0; j < k; j++) {
    //         if (file[j] == " ") count++;
    //     }
    //     i = count;
    // } else console.log("Too Long k=" + k + " i=" + i);
    showWords();
}
//stop at long words
function delay() {
    // clearInterval(read);
    // setTimeout(start, 400);
}


//select highlights
// function selectText(sampleWord) {
//     for (let j = 0; j < words.length; j++)
//         if (words[j] == sampleWord) return j;
// }

// $box.addEventListener('select', () => {
//     const blockquote = document.querySelector('blockquote');
//     blockquote.onselect = logSelection;

// });
// function logSelection(event) {
//     const selection = event.target.value.substring(event.target.selectionStart, event.target.selectionEnd);
//     console.log(`You selected: ${selection}`);
// }

//Check if checkpoint is already existed