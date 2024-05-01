window.addEventListener("message", function (event) {
  if (event.data.action === "dictionaryData") {
    const data = event.data.message.data;
    updateAllWordInfo(data);
  }
});

function updateAllWordInfo(data) {
  const iframeContainer = document.getElementById("word-info-container");
  console.log(iframeContainer);
  // Clear existing content
  iframeContainer.innerHTML = "";
  // Loop through each word object in the data array
  data.forEach((wordObject) => {
    // Create a div element for each word
    const wordDiv = document.createElement("div");
    wordDiv.classList.add("word");

    const wordAndAudio = document.createElement("div");
    // Add word
    const wordHeader = document.createElement("span");
    wordHeader.textContent = `${wordObject.word}`;
    wordHeader.classList.add("wordHeader");
    wordAndAudio.appendChild(wordHeader);

    const speakerButton = document.createElement("button");
    speakerButton.classList.add("speakerButton");
    const img = document.createElement("img");
    img.src = "images/megaphone_124.png"; // Set the path to your image
    img.alt = "Speaker Icon";
    speakerButton.appendChild(img);
    speakerButton.addEventListener("click", () => {
      // Play audio when speaker button is clicked
      playAudio(wordObject.phonetics[0].audio); // Assuming the first phonetic entry has audio
    });
    wordAndAudio.appendChild(speakerButton);

    wordDiv.appendChild(wordAndAudio);

    // Add  phonetic pronunciation
    const phoneticHeader = document.createElement("span");
    phoneticHeader.textContent = `/${wordObject.phonetic}/`;
    phoneticHeader.classList.add("phoneticHeader");
    wordDiv.appendChild(phoneticHeader);

    wordObject.meanings.forEach((meaning) => {
      const meaningDiv = document.createElement("div");
      meaningDiv.classList.add("meaning");

      // Add part of speech
      const partOfSpeech = document.createElement("span");
      partOfSpeech.textContent = `${meaning.partOfSpeech}`;
      partOfSpeech.classList.add("partOfSpeech");
      meaningDiv.appendChild(partOfSpeech);

      // Add definitions
      const maxDefinitions = Math.min(meaning.definitions.length, 4);
      for (let i = 0; i < maxDefinitions; i++) {
        const definition = meaning.definitions[i];
        const definitionDiv = document.createElement("div");
        definitionDiv.classList.add("definition");

        // Add definition text
        const definitionText = document.createElement("span");
        definitionText.textContent = `${i + 1}. ${definition.definition}`;
        definitionText.classList.add("definationElement");
        definitionDiv.appendChild(definitionText);

        // Add example if available
        if (definition.example) {
          const exampleText = document.createElement("p");
          exampleText.textContent = `Example: ${definition.example}`;
          exampleText.classList.add("definationExample");
          definitionDiv.appendChild(exampleText);
        }

        // Add synonyms if available
        if (definition.synonyms.length > 0) {
          const synonymsText = document.createElement("p");
          synonymsText.textContent = `Synonyms: ${definition.synonyms.join(
            ", "
          )}`;
          definitionDiv.appendChild(synonymsText);
        }

        meaningDiv.appendChild(definitionDiv);
      }

      wordDiv.appendChild(meaningDiv);
    });

    // Add the word div to the container
    iframeContainer.appendChild(wordDiv);
  });
}

function playAudio(audioUrl) {
  const audio = new Audio(audioUrl);
  audio.play();
}
