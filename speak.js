const synth = window.speechSynthesis;

const textForm = document.querySelector('form');
const textInput = document.querySelector('#text-input');
const rate = document.querySelector('#rate');
const rateValue = document.querySelector('#rate-value');
const voiceSelect = document.querySelector('#voice-select');
const pitch = document.querySelector('#pitch');
const pitchValue = document.querySelector('#pitch-value');
const speakit = document.querySelector('#speakit');
const body = document.querySelector('body');

if (rate !== null || pitch !== null) {
  chrome.storage.sync.set({ 'rate': rate.value })
  chrome.storage.sync.set({ 'pitch': pitch.value })
}

let voices = [];

const getVoices =() => {
  voices = synth.getVoices();
  
  voices.forEach(voice => {
    const option = document.createElement('option');
    option.textContent = voice.name + '(' + voice.lang + ')';
    
    // Set needed option attributes
    option.setAttribute('data-lang', voice.lang);
    option.setAttribute('data-name', voice.name);
    voiceSelect.appendChild(option);
  });
};

if (synth.onvoiceschanged !== undefined) {
  synth.onvoiceschanged = getVoices;
}

// Speak
const speak = () => {
  if (synth.speaking) {
    console.error('Already speaking...');
    return;
  }
  if (textInput.value !== '') {
    const speakText = new SpeechSynthesisUtterance(textInput.value);
    speakText.onend = e => {
      //body.style.background = '#141414';
    };
    
    speakText.onerror = e => {
      console.error('Something went wrong');
    };
    
    const selectedVoice = voiceSelect.selectedOptions[0].getAttribute(
      'data-name'
      );
      voices.forEach(voice => {
        if (voice.name === selectedVoice) {
          speakText.voice = voice;
          chrome.storage.sync.set({ 'voice': voice })
        }
      });
      speakText.rate = rate.value;
      speakText.pitch = pitch.value;
      synth.speak(speakText);
    }
  };
  
textForm.addEventListener('submit', e => {
    e.preventDefault();
    speak();
    textInput.blur();
});
  

rate.addEventListener('change', e => {
  rateValue.textContent = rate.value;
  chrome.storage.sync.set({ 'rate': rate.value })
});


pitch.addEventListener('change', e => {
  pitchValue.textContent = pitch.value;
  chrome.storage.sync.set({ 'pitch': pitch.value })
});

voiceSelect.addEventListener('change', e => speak());