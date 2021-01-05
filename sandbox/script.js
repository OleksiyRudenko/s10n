import { userInputExamples, escapeString } from "./user-input-examples.js";
import { sanitizationChains, buildChainRepresentationString, applyChain } from "./sanitization-chains.js";

const pageElements = getElementsById({
  beEmulationCheckbox: "be-emulation",
  userInputPresetsActivator: "user-input-presets-activator",
  userInputPresets: "user-input-presets",
  userInputPresetsContainer: "user-input-presets-container",
  userInputPresetEscaped: "user-input-preset-escaped",
  chainSelector: "sanitization-chains",
  textInput: "user-input-text",
  textAreaInput: "user-input-textarea",
  textOutputContainer: "text-output-container",
  textOutput: "text-output",
  textOutputEscaped: "text-output-escaped",
  textAreaOutput: "textarea-output",
  textAreaOutputEscaped: "textarea-output-escaped"
});

const state = loadState() || {
  beEmulation: true,
  userInputPresetString: userInputExamples[6],
  sanitizationChainPreset: {
    groupName: "whitespaces big cleanup",
    index: 1
  }
};

populateLists();
processState();
sanitize();
bindEvents();

function getElementsById(map) {
  Object.keys(map).forEach(key => {
    map[key] = document.getElementById(map[key]);
  });
  return map;
}

function populateLists() {
  pageElements.userInputPresets.innerHTML = makeUserInputPresetsSelectorOptions(userInputExamples);
  pageElements.chainSelector.innerHTML = makeSanitizerSelectorOptions(
    sanitizationChains,
    state.sanitizationChainPreset.groupName,
    state.sanitizationChainPreset.index
  );
}

// pick 1st ui example and apply it to ui inputs and a default sanitizer

// Sanitized values: on hover show escaped strings

function makeUserInputPresetsSelectorOptions(userInputExamples) {
  return userInputExamples.map((string, index) => `<div data-index="${index}">${escapeString(string)}</div>`).join("");
}

function makeSanitizerSelectorOptions(sanitizationChains, selectedGroup = "elementary", selectedItem = 0) {
  return Object.keys(sanitizationChains)
    .map(
      groupName =>
        `<OPTGROUP label="${groupName}">` +
        sanitizationChains[groupName]
          .map(
            (chain, index) =>
              `<OPTION VALUE="${groupName + ":" + index}" ${
                groupName === selectedGroup && index === selectedItem ? "SELECTED" : ""
              }>` + `${buildChainRepresentationString(chain)}</OPTION>`
          )
          .join("") +
        "</OPTGROUP>"
    )
    .join("");
}

function processState() {
  pageElements.beEmulationCheckbox.checked = state.beEmulation;
  pageElements.textInput.style.display = state.beEmulation ? "none" : "inline-block";
  pageElements.textAreaInput.disabled = state.beEmulation;
  pageElements.textOutputContainer.style.display = state.beEmulation ? "none" : "inline-block";
  pageElements.textInput.value = state.userInputPresetString;
  pageElements.textAreaInput.value = state.userInputPresetString;
  pageElements.userInputPresetEscaped.innerHTML = escapeString(state.userInputPresetString);
}

function bindEvents() {
  pageElements.beEmulationCheckbox.addEventListener("change", changeBackendEmulationState);
  pageElements.userInputPresetsActivator.addEventListener("click", activateUserInputPresetsSelector);
  pageElements.userInputPresetsContainer.addEventListener("click", pickUserInputPreset);
  pageElements.textInput.addEventListener("keyup", useTextInput);
  pageElements.textAreaInput.addEventListener("keyup", useTextAreaInput);
  pageElements.chainSelector.addEventListener("change", pickSanitizationChain);
}

function activateUserInputPresetsSelector() {
  pageElements.userInputPresetsContainer.style.display = "block";
  // window.addEventListener("click", closeModal);
}

function pickUserInputPreset({ target }) {
  const exampleIndex = target.dataset.index;
  pageElements.userInputPresetsContainer.style.display = "none";
  if (userInputExamples[exampleIndex]) {
    const exampleText = userInputExamples[exampleIndex];
    state.userInputPresetString = exampleText;
    pageElements.textInput.value = exampleText;
    pageElements.textAreaInput.value = exampleText;
    pageElements.userInputPresetEscaped.innerHTML = escapeString(exampleText);
    sanitize();
  }
}

const ignoredKeys = [
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Home",
  "End",
  "PageUp",
  "PageDown",
  "ControlLeft",
  "AltLeft",
  "ControlRight",
  "AltRight",
  "ShiftLeft",
  "ShiftRight",
  "CapsLock",
  "NumLock",
  "Escape",
  "PrintScreen",
  "ScrollLock",
  "MetaLeft",
  "ContextMenu"
];

function useTextInput({ target, code }) {
  if (!ignoredKeys.includes(code)) {
    pageElements.textAreaInput.value = target.value;
    state.userInputPresetString = target.value;
    sanitize();
  }
}

function useTextAreaInput({ target, code }) {
  if (!ignoredKeys.includes(code)) {
    pageElements.textInput.value = target.value;
    state.userInputPresetString = target.value;
    sanitize();
  }
}

function closeModal({ target }) {
  console.log("CLOSE MODAL?");
  if (target === pageElements.userInputPresets) {
    // need full screen supermodal
    console.log("CLOSE MODAL");
    pageElements.userInputPresetsContainer.style.display = "none";
    window.removeEventListener("click", closeModal);
  }
}

function changeBackendEmulationState({ target }) {
  state.beEmulation = target.checked;
  pageElements.textInput.style.display = state.beEmulation ? "none" : "inline-block";
  pageElements.textAreaInput.disabled = state.beEmulation;
  pageElements.textOutputContainer.style.display = state.beEmulation ? "none" : "inline-block";
  sanitize();
}

function pickSanitizationChain({ target }) {
  const [groupName, index] = target.value.split(":");
  state.sanitizationChainPreset = {
    groupName,
    index: +index
  };
  sanitize();
}

function sanitize() {
  pageElements.textOutput.innerHTML = "";
  pageElements.textAreaOutput.innerHTML = "";

  const results = (state.beEmulation
    ? [s10n(state.userInputPresetString)]
    : [pageElements.textAreaInput.value, pageElements.textInput.value].map(input => s10n(input))
  )
    .map(item =>
      applyChain(item, sanitizationChains[state.sanitizationChainPreset.groupName][state.sanitizationChainPreset.index])
    )
    .map(item => item + "");

  if (results[1] !== undefined) {
    pageElements.textOutput.innerHTML = results[1] || "&lt;empty string&gt;";
    pageElements.textOutputEscaped.innerHTML = escapeString(results[1]);
  }
  pageElements.textAreaOutput.innerHTML = results[0] || "&lt;empty string&gt;";
  pageElements.textAreaOutputEscaped.innerHTML = escapeString(results[0]);

  saveState();
}

function saveState() {
  localStorage.setItem("state", JSON.stringify(state));
}

function loadState() {
  return JSON.parse(localStorage.getItem("state"));
}
