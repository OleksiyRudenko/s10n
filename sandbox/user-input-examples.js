const userInputExamples = [
  "  My User Name  ",
  "  UsEr #$%' NaMe  5_6-9  ",
  "  UsEr   #$%\"' NaMe +  5_6-9 @ .Co.Uk  ",
  "\r\n\n\n\r\r",
  "\n\r\r\r\n\nfoo\n\r\nbar\n\r\r\r\n\n",
  "\n \r\r\r\n\nfoo\n \r\nbar\n\r\r \r\n\n",
  "\n  Z\tY \x0A \n X W\uFEFFV \n\n  \n",
  "\r\n\r  abc  \r\n  def   \r \t   ghi   \n \t\t  \n \r\n\n\r\n\n\r\r  \r\r\n",
  " \n\r\n \u200B\u200C\u200D\u2060 \t\uFEFF\xA0 Sensible text \n Line 2 \n\r\n\r\r ",
  "  Some text  \n Yet basically valid \n\n  ",
  "  Some   arbitrary \t \xA0 text  ",
  "ABCDabcd01239 _-.,(abcd){defg}[hijk]",
  "ABCDEFGHabcdefghABCDEFGHabcdefgh",
  "aBcD01",
  "  XYZ 20fE\n\n  ",
  "-6.5e-2",
  "-6..5e-2",
  "0x1A",
  "-0x1A"
];

const whiteSpaceMap = {
  "\t": "\\t",
  "\v": "\\v",
  "\0": "\\0",
  "\b": "\\b",
  "\f": "\\f",
  "\n": "\\n",
  "\r": "\\r",
  "\\": "\\\\",
  "\u200B": "\\u200B",
  "\u200C": "\\u200C",
  "\u200D": "\\u200D",
  "\u2060": "\\u2060",
  "\uFEFF": "\\uFEFF",
  "\xA0": "\\xA0"
};

const escapeString = text => {
  return [...(text + "")]
    .map(char =>
      whiteSpaceMap[char]
        ? whiteSpaceMap[char]
        : char.charCodeAt(0) < 32
        ? "\\x" + char.charCodeAt(0).toString(16)
        : char
    )
    .join("");
};

export { userInputExamples, escapeString };
