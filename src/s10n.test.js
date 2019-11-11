import s10n from "./s10n";

const multilineSamples = [
  "\r\n\r  abc  \r\n  def   \r \t   ghi   \n \t\t  \n \r\n\n\r\n\n\r\r  \r\r\n",
  "\r\n\r  abc  \r\n" +
    "  def   \r" +
    " \u200B\u200C\u200D\u2060\t\uFEFF\xA0 ghi   \n" +
    " \n\u200B\u200C\u200D\u2060\t\uFEFF\xA0\n" +
    " \r\n\n\r\n\n\r\r  \r\r\n"
];

describe("elementary transformers", () => {
  it("`trim` should trim leading and trailing spaces", () => {
    expect(s10n("  foo bar    ").trim().value).toBe("foo bar");
  });
  it("`mergeLineBreaks` should normalize line breaks and merge consequent line breaks disregarding `preserveLineBreaks` setting", () => {
    expect(s10n("\n\r\r\r\n\nfoo\n\r\nbar\n\r\r\r\n\n").mergeLineBreaks().value).toBe("\nfoo\nbar\n");
    expect(s10n("\n \r\r\r\n\nfoo\n \r\nbar\n\r\r \r\n\n").mergeLineBreaks().value).toBe("\n \nfoo\n \nbar\n \n");
  });
  it("`trimLineBreaks` should trim leading and trailing line break characters disregarding `preserveLineBreaks` setting", () => {
    expect(
      s10n("\n\r\r\r\n\nfoo\n\r\nbar\n\r\r\r\n\n")
        .preserveLineBreaks()
        .trimLineBreaks().value
    ).toBe("foo\n\r\nbar");
    expect(
      s10n("\n\r\r\r\n\nfoo\n\r\nbar\n\r\r\r\n\n")
        .disregardLineBreaks()
        .trimLineBreaks().value
    ).toBe("foo\n\r\nbar");
  });
  it("`normalizeWhitespaces` should replace whitespaces with a space char", () => {
    expect(s10n("  next is tab\t, then a line break\n    ").normalizeWhitespaces().value).toBe(
      "  next is tab , then a line break     "
    );
  });
  it("`mergeWhitespaces` should replace sequences of whitespaces with a single space char", () => {
    expect(s10n("  next is tab\t, then a line break\n    ").mergeWhitespaces().value).toBe(
      " next is tab , then a line break "
    );
    expect(
      s10n("  next is tab\t, then a line break\n    ")
        .preserveLineBreaks()
        .mergeWhitespaces().value
    ).toBe(" next is tab , then a line break\n ");
  });
  it("`stripWhitespaces` should remove any whitespaces", () => {
    expect(s10n("  next is tab\t, then a line break\n    ").stripWhitespaces().value).toBe("nextistab,thenalinebreak");
  });
  it("`normalizeMultiline` should strip whitespaces immediately preceding or following line breaks", () => {
    expect(s10n(multilineSamples[0]).normalizeMultiline().value).toBe(
      "\r\n\rabc\r\ndef\rghi\n\n\r\n\n\r\n\n\r\r\r\r\n"
    );
  });
  it("`normalizeLineBreaks` should convert CRLF, CR, LF into LF or specified line break character", () => {
    expect(s10n(multilineSamples[0]).normalizeLineBreaks().value).toBe(
      "\n\n  abc  \n  def   \n \t   ghi   \n \t\t  \n \n\n\n\n\n\n  \n\n"
    );
  });
  it("`keepOnlyCharset` should keep only allowed chars from the default char set", () => {
    expect(s10n("A-Za-z0-9 _-.,}{][)(/*'^#").keepOnlyCharset().value).toBe("A-Za-z0-9 _-.,}{][)(");
  });
  it("`keepOnlyRegexp` should keep only parts of input that match a RegExp", () => {
    expect(s10n("A-Za-z0-9 _-.,}{][)(/*'^#").keepOnlyRegexp(/[A-Za-z0-9 _\-.,}{\]\[)(/*'^#]/gu).value).toBe(
      "A-Za-z0-9 _-.,}{][)(/*'^#"
    );
    expect(s10n("ABCDabcd01239 _-.,(abcd){defg}[hijk]").keepOnlyRegexp(/\{.*?\}|\[.*?\]|\(.*?\)/gu).value).toBe(
      "(abcd){defg}[hijk]"
    );
  });
  it("`remove` should remove specified chars or as per regexp", () => {
    expect(s10n("ABCDEFGHabcdefghABCDEFGHabcdefgh").remove("ABCD").value).toBe("EFGHabcdefghEFGHabcdefgh");
    expect(s10n("ABCDEFGHabcdefghABCDEFGHabcdefgh").remove("ABCD", "gui").value).toBe("EFGHefghEFGHefgh");
    expect(s10n("ABCDEFGHabcdefghABCDEFGHabcdefgh").remove(/ABCD/).value).toBe("EFGHabcdefghABCDEFGHabcdefgh");
    expect(s10n("ABCDEFGHabcdefghABCDEFGHabcdefgh").remove(/ABCD/giu).value).toBe("EFGHefghEFGHefgh");
    expect(s10n("ABCDEFGHabcdefghABCDEFGHabcdefgh").remove(/ABCD/, "giu").value).toBe("EFGHefghEFGHefgh");
  });
  it("`replace` should replace specified needle with a replacement", () => {
    expect(s10n("22ABCDabcd33").replace("ABCD", "---").value).toBe("22---abcd33");
    expect(s10n("22ABCDabcd33").replace("ABCD", "---", "gui").value).toBe("22------33");
    expect(s10n("22ABCDabcd33").replace(/ABCD/, "---").value).toBe("22---abcd33");
    expect(s10n("22ABCDabcd33").replace(/ABCD/, "---").value).toBe("22---abcd33");
    expect(s10n("22ABCDabcd33").replace(/ABCD/giu, "---").value).toBe("22------33");
  });
  describe("text case transformers", () => {
    it("`toLowerCase` should make all chars lower case", () => {
      expect(s10n("aBcDщИ¿").toLowerCase().value).toBe("abcdщи¿");
    });
    it("`toUpperCase` should make all chars upper case", () => {
      expect(s10n("aBcDщИ¿").toUpperCase().value).toBe("ABCDЩИ¿");
    });
  });
});

describe("compound transformers and their aliases", () => {
  describe("integer numbers with a given base", () => {
    it("`keepBase10Digits` should keep only 0-9 chars", () => {
      expect(s10n("0123456789ABCDEFabcdefGHIJKLghijkl!@#$%^&*()").keepBase10Digits().value).toBe("0123456789");
    });
    it("`keepBase16Digits` should keep only 0-9, a-f and A-F chars", () => {
      expect(s10n("0123456789ABCDEFabcdefGHIJKLghijkl!@#$%^&*()").keepBase16Digits().value).toBe(
        "0123456789ABCDEFabcdef"
      );
    });
    it("`keepHexDigits` (alias for keepBase16Digits) should keep only 0-9, a-f and A-F chars", () => {
      expect(s10n("0123456789ABCDEFabcdefGHIJKLghijkl!@#$%^&*()").keepHexDigits().value).toBe("0123456789ABCDEFabcdef");
    });
    it("`minimizeWhitespaces` minimize whitespaces respecting preserveLineBreaks modifier", () => {
      multilineSamples.forEach(multilineSample => {
        expect(
          s10n(multilineSample)
            .preserveLineBreaks()
            .minimizeWhitespaces().value
        ).toBe("abc\ndef\nghi");
        expect(s10n(multilineSample).minimizeWhitespaces().value).toBe("abc def ghi");
      });
    });
  });
});

describe("semantic sanitizers and their aliases", () => {
  it("`keepOnlyEmailPopularCharset()` should keep only charset most common for emails `[A-Za-z0-9_@.-]`", () => {
    expect(s10n("  user.name+option(5)@abc.co.uk  ").keepOnlyEmailPopularCharset().value).toBe(
      "user.nameoption5@abc.co.uk"
    );
  });
  it("`keepOnlyEmailExtendedCharset()` should keep charset `[A-Za-z0-9_@.+)(-]`", () => {
    expect(s10n("  user.name+option(5)@abc.co.uk  ").keepOnlyEmailExtendedCharset().value).toBe(
      "user.name+option(5)@abc.co.uk"
    );
  });
  it("`keepUsername` should strip whitespaces", () => {
    expect(s10n("  UsEr #$%\"' NaMe  5_6-9  ").keepUsername().value).toBe("UsErNaMe5_6-9");
  });
  it("`keepUsernameLC` should strip whitespaces and apply toLowerCase", () => {
    expect(s10n("  UsEr #$%\"' NaMe  5_6-9  ").keepUsernameLC().value).toBe("username5_6-9");
  });
  it("`keepUsername` should strip whitespaces and replace interim whitespaces with '_'", () => {
    expect(s10n("  UsEr #$%\"' NaMe  5_6-9  ").keepUsername("_").value).toBe("UsEr_NaMe_5_6-9");
  });
  it("`keepUsernameLC` should strip whitespaces, replace interim whitespaces with '_' and apply toLowerCase", () => {
    expect(s10n("  UsEr #$%\"' NaMe  5_6-9  ").keepUsernameLC("_").value).toBe("user_name_5_6-9");
  });
});

describe("custom transformers/sanitizers", () => {
  it("`apply` should call a callback with value, current s10n object context and arbitrary params", () => {
    expect(
      s10n("c00l").apply(
        (value, context, needle, replacement) => value.replace(context._regexp(needle), replacement),
        "0",
        "o"
      ).value
    ).toBe("cool");
  });
  it("`extend` should add a normally callable sanitization method", () => {
    s10n.extend("makeCool", function() {
      this.replace(this._regexp("o\\s+", "gi"), "0");
      return this;
    });
    expect(s10n("coO\x0A o\t l").makeCool().value).toBe("co00l");
  });
});

describe("type casting", () => {
  it("`s10n` object should return a string in string context by default", () => {
    expect(s10n("ABC") + "").toBe("ABC");
    expect(`${s10n("ABC")}`).toBe("ABC");
  });
  it("`toString` should return a string", () => {
    expect(s10n("ABC").toString()).toBe("ABC");
  });
  it("`toNumber` should return a number", () => {
    expect(s10n("123").toNumber()).toBe(123);
  });
});
