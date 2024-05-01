chrome.contextMenus.create({
    id: "wordSelected",
    title: "Lookup: %s",
    contexts: ["selection"]
});

function onWordSelected(info, tab) {
    console.log("Word selected:", info.selectionText);
    fetchDictionary(info.selectionText);
}

function fetchDictionary(word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => response.json())
        .then(data => {
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
                chrome.tabs.sendMessage(tabs[0].id, {action: "openPopup", data: data}, function(response) {});  
            });
        })
        .catch(error => {
            console.error("Error fetching dictionary:", error);
        });
}

chrome.contextMenus.onClicked.addListener(onWordSelected);