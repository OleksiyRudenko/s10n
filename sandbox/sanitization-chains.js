import { escapeString } from "./user-input-examples.js";

const sanitizationChains = {
  elementary: [
    ["trim"],
    ["preserveLineBreaks", "trim"],
    ["normalizeWhitespaces"],
    ["normalizeWhitespaces", "trim"],
    ["preserveLineBreaks", "normalizeWhitespaces", "trim"],
    ["mergeWhitespaces"],
    ["mergeWhitespaces", "trim"],
    ["preserveLineBreaks", "mergeWhitespaces", "trim"],
    ["stripWhitespaces"],
    ["preserveLineBreaks", "stripWhitespaces"],

    ["trimLineBreaks"],
    ["preserveLineBreaks", "trimLineBreaks"],
    ["mergeLineBreaks"],
    ["normalizeLineBreaks"],
    [["setLineBreakCharacter", "\r"], "normalizeLineBreaks"],
    ["normalizeMultiline"],
    ["normalizeLineBreaks", "normalizeMultiline"],

    ["preserveLineBreaks", "normalizeWhitespaces", "mergeWhitespaces", "trimLineBreaks", "trim"]
  ],

  "whitespaces big cleanup": [["minimizeWhitespaces"], ["preserveLineBreaks", "minimizeWhitespaces"]],

  compound: [
    [["keepOnlyCharset", "}{][)("]],
    [["keepOnlyRegexp", /\{.*?\}|\[.*?\]|\(.*?\)/gu]],

    [["remove", "ABCD"]],
    [["remove", "ABCD", "giu"]],
    [["remove", /ABCD/]],
    [["remove", /ABCD/giu]],
    [["remove", /ABCD/, "giu"]],

    ["toLowerCase"],
    ["toUpperCase"],

    ["keepBase10Digits"],
    ["keepBase16Digits"],
    ["keepBase16Digits", "toLowerCase"],
    ["keepHexDigits"]
  ],

  semantic: [
    ["keepOnlyEmailPopularCharset"],
    ["keepOnlyEmailExtendedCharset"],
    ["keepOnlyEmailRfcCharset"],
    ["keepOnlyEmailPopularCharset", "toLowerCase"],

    ["keepUsername"],
    ["keepUsernameLC"],
    [["keepUsername", "_"]],
    [["keepUsernameLC", "_"]]
  ],
  "type casting": [["toNumber"]]
};

const buildChainRepresentationString = chain =>
  chain.map(chainItem => (Array.isArray(chainItem) ? buildFunctionCallText(chainItem) : chainItem + "()")).join(".");

const applyChain = (s10nInstance, chain) =>
  chain.reduce((result, chainItem) => {
    return Array.isArray(chainItem) ? callFunctionWithParams(result, ...chainItem) : result[chainItem]();
  }, s10nInstance);

const buildFunctionCallText = ([functionName, ...args]) =>
  functionName + "(" + args.map(arg => (arg instanceof RegExp ? arg + "" : `"${escapeString(arg)}"`)).join(", ") + ")";

const callFunctionWithParams = (s10nInstance, methodName, ...params) => s10nInstance[methodName](...params);

export { sanitizationChains, buildChainRepresentationString, applyChain };
