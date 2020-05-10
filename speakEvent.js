
// Init SpeechSynth API
const synth = window.speechSynthesis;

var contextMenuOptions = {
    id: 'prounceit',
    title: "Prounce it",
    contexts: ["selection"]
}
chrome.contextMenus.create(contextMenuOptions);
chrome.contextMenus.onClicked.addListener(function (selectedData) {
    if (selectedData.selectionText !== null) {
        // Check if speaking
        if (synth.speaking) {
            console.error('Already speaking...');
            return;
        }

        // Get speak text
        const speakText = new SpeechSynthesisUtterance(selectedData.selectionText);

        // Speak end
        speakText.onend = e => {
            //body.style.background = '#141414';
        };

        // Speak error
        speakText.onerror = e => {
            console.error('Something went wrong');
        };
        
        //set default value 
        speakText.default = true;
        
        // Speak
        synth.speak(speakText);
    }
})