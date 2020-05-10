// Init SpeechSynth API
const synth = window.speechSynthesis;

// DOM Elements
const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const voiceSelect = document.querySelector('#voice-select');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const speakit = document.querySelector('#speakit');
const body = document.querySelector('body');

//storing rate and pitch for selection 
if (rate !== null || pitch !== null) {
  chrome.storage.sync.set({ 'rate': rate.value })
  chrome.storage.sync.set({ 'pitch': pitch.value })
}

// Init voices array
let voices = [];

const getVoices =() => {
  voices = synth.getVoices();
  
  // Loop through voices and create an option for each one
  voices.forEach(voice => {
    // Create option element
    const option = document.createElement('option');
    // Fill option with voice and language
    option.textContent = voice.name + '(' + voice.lang + ')';
    
    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

//synth getVoices is async method data will avaiable when onvoiceschanged event is emitted
if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  // Check if speaking
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    
    // Get speak text
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    
    // Speak end
    speakText.onend = e => {
      //body.style.background = '#141414';
    };
    
    // Speak error
    speakText.onerror = e => {
      console.error('Something went wrong');
    };
    
    // Selected voice
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
      );
      
      // Loop through voices
      voices.forEach(voice => {
        if (voice.name === selectedVoice) {
          speakText.voice = voice;
          chrome.storage.sync.set({ 'voice': voice })
        }
      });
      
      // // set default value 
      // speakText.default = true;
      
      // Set pitch and rate
      speakText.rate = rate.value;
      speakText.pitch = pitch.value;
      
      // Speak
      synth.speak(speakText);
    }
  };
  
  // EVENT LISTENERS
  
  // Text form submit
  textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
  });
  
// Rate value change
rate.addEventListener('change', e => {
  rateValue.textContent = rate.value;
  chrome.storage.sync.set({ 'rate': rate.value })
});

// Pitch value change
pitch.addEventListener('change', e => {
  pitchValue.textContent = pitch.value;
  chrome.storage.sync.set({ 'pitch': pitch.value })
});

// Voice select change
voiceSelect.addEventListener('change', e => speak());
