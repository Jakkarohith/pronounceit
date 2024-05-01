"use strict";

function initButton() {
  let rootElement = createRootElement();
  let btn = createButton(rootElement);
  let img = createImage(btn);
  document.body.appendChild(rootElement);
  btn.addEventListener("click", () => clickListener(rootElement, btn));
  // Load the popup when the website is loaded
  loadPopup(rootElement);
}

function createRootElement() {
  let rootElement = document.createElement("div");
  rootElement.id = "insext";
  return rootElement;
}

function createButton(rootElement) {
  let btn = document.createElement("div");
  btn.className = "insext-btn";
  btn.tabIndex = 0;
  btn.title = "Word Realm";
  rootElement.appendChild(btn);
  return btn;
}

function createImage(btn) {
  let img = document.createElement("img");
  img.src = chrome.runtime.getURL("icons/icon_128.png");
  btn.appendChild(img);
  return img;
}

function clickListener(rootElement, btn) {
  btn.removeEventListener("click", clickListener);
  loadPopup(rootElement);
}

function loadPopup(rootElement) {
  let btn = rootElement.querySelector(".insext-btn");
  btn.addEventListener("click", () => {
    if (!rootElement.classList.contains("insext-active")) {
      openPopup(rootElement);
    } else {
      closePopup(rootElement);
    }
  });
  let popupEl = createPopup();
  addMessageListener(popupEl, rootElement);
  rootElement.appendChild(popupEl);
}

function createPopup() {
  let popupSrc = chrome.runtime.getURL("popup.html");
  let popupEl = document.createElement("iframe");
  popupEl.className = "insext-popup";
  popupEl.src = popupSrc;
  return popupEl;
}

function addMessageListener(popupEl, rootElement) {
  addEventListener("message", (e) => {
    if (e.source != popupEl.contentWindow) {
      return;
    }
    if (e.data.insextLoaded) {
      openPopup(rootElement);
    }
    if (e.data.insextClosePopup) {
      closePopup(rootElement);
    }
    if (e.data.insextShowStdPageDetails) {
      showStdPageDetails(e.data.insextData, e.data.insextAllFieldSetupLinks);
    }
  });
}

function openPopup(rootElement) {
  let popupEl = rootElement.querySelector(".insext-popup");
  rootElement.classList.add("insext-active");
  addEventListener("click", outsidePopupClick);
  popupEl.focus();
}

function closePopup(rootElement) {
  let popupEl = rootElement.querySelector(".insext-popup");
  rootElement.classList.remove("insext-active");
  removeEventListener("click", outsidePopupClick);
  popupEl.blur();
}

function outsidePopupClick(e) {
  let rootElement = document.getElementById("insext");
  let popupEl = rootElement.querySelector(".insext-popup");
  // Close the popup when clicking outside it
  if (!rootElement.contains(e.target)) {
    closePopup(rootElement);
  }
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  const iframe = document.querySelector(".insext-popup");
  if (message.action === "openPopup") {
    console.log(message);
    let rootElement = document.getElementById("insext");
    let popupEl = rootElement.querySelector(".insext-popup");
    if (!popupEl) {
      // If popup is not already loaded, load it
      loadPopup(rootElement);
    }
    // If popup is already loaded, just add active class
    rootElement.classList.add("insext-active");
    addEventListener("click", outsidePopupClick);
    iframe.contentWindow.postMessage(
      { action: "dictionaryData", message },
      "*"
    );
  }
});

initButton();