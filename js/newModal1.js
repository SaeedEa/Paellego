var modal1Textarea = document.getElementById('modal1Textarea');

const downloadToFile = (content, filename, contentType) => {
    const a = document.createElement('a');
    const file = new Blob([content], { type: contentType });

    a.href = URL.createObjectURL(file);
    a.download = filename;
    a.click();

    URL.revokeObjectURL(a.href);
};

document.querySelector('#modal1ButtonDownload').addEventListener('click', () => {
    const textArea = modal1Textarea.value;
    console.log(textArea);
    if (textArea.length != 0)
        downloadToFile(textArea, 'my-new-file.txt', 'text/plain');
    else alert("Please enter a text");
});
document.querySelector('#modal1ButtonRead').addEventListener('click', () => {
    textArea = document.getElementById('modal1Textarea').value;
    // textArea = checktext(textArea);
    $('#newModal1').modal('hide');
    document.getElementById("read").scrollIntoView();
    document.getElementById('continueButton').style.display = "inline-block";
    document.getElementById('restartButton').style.display = "inline-block";
    document.getElementById("readPos").style.display = "inline-block";
    document.getElementById("speedInc").style.display = "inline-block";
    document.getElementById("speedDec").style.display = "inline-block";

    document.getElementById('inputFile').style.display = "none";
    document.getElementById('box').innerHTML = textArea;
});

// function checktext(text) {
//     for (let j = 0; j < text.length; j++) {
//         text = text.replace("  ", " ");
//         text = text.replace(/([|\/])/gim, '');
//         text = text.replace(/(<mark class="highlight">|<\/mark>)/gim, '');
//     }
// }