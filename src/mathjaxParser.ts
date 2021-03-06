/*
Inspiration from
https://www.tsmean.com/articles/math/mathjax-parser-for-html-strings/

Very very very hacky. Probably will fail very fast.
*/

import assert from "assert";

interface MathjaxParserConfig {
  // each tuple [string, string] means [opening symbol, closing symbol]
  inlineMath: [string, string][];
  displayMath: [string, string][];
  inlineMathReplacement: [string, string];
  displayMathReplacement: [string, string];
}

// const defaultParserConfig: MathjaxParserConfig = {
//   inlineMath: [
//     ["$", "$"],
//     ["\\(", "\\)"],
//   ],
//   displayMath: [
//     ["$$", "$$"],
//     ["\\[", "\\]"],
//   ],
//   inlineMathReplacement: ["<MyTeX>", "</MyTeX>"],
//   displayMathReplacement: ["<MyTeX block>", "</MyTeX>"],
// };

const defaultParserConfig: MathjaxParserConfig = {
  inlineMath: [
    ["$", "$"],
    ["\\(", "\\)"],
  ],
  displayMath: [
    ["$$", "$$"],
    ["\\[", "\\]"],
  ],
  inlineMathReplacement: ["<MyTeX math={'", "'} />"],
  displayMathReplacement: ["<MyTeX block math={'", "'} />"],
  // inlineMathReplacement: ["<MyTeX math={String.raw`", "`} />"],
  // displayMathReplacement: ["<MyTeX block math={String.raw`", "`} />"],
};

const transformText = (text: string) => {
  const parts = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] == "{") {
      parts.push('{"{"}');
    } else if (text[i] == "}") {
      parts.push('{"}"}');
    } else {
      parts.push(text[i]);
    }
  }
  // now the parser works on https://www.acmicpc.net/problem/18586
  return parts.join("");
};

const transformMath = (math: string) => {
  math = math.replaceAll("&lt;", " < ");
  math = math.replaceAll("&nbsp;", "~");
  return math;
};

export const parseHtmlAndMathjax = (
  html: string,
  config = defaultParserConfig
): string => {
  // find displayMath delimiters first?
  const len = html.length;

  // console.log("given html:", html);

  html = html.replaceAll('src="/', 'src="https://www.acmicpc.net/');
  html = html.replaceAll("\\(", "$");
  html = html.replaceAll("\\)", "$");
  // html = html.replaceAll("$$$", "$"); // for problems from Codeforces later?
  // html.replaceAll("\\[", config.displayMathReplacement[0]);
  // html.replaceAll("\\]", config.displayMathReplacement[1]);

  const dollarSigns = [];
  for (let i = 0; i < len; i++) {
    if (html[i] == "$" && (i == 0 || html[i - 1] != "\\")) {
      // this definitely isn't foolproof but it should work in most cases
      dollarSigns.push(i);
    }
  }
  const count = dollarSigns.length;
  assert(count % 2 == 0);
  const parts = [];
  let last = -1;
  for (let i = 0; i <= count; i += 2) {
    if (i == count) {
      const text = html.substr(last + 1);
      parts.push(transformText(text));
      break;
    }
    {
      // opening
      const next = dollarSigns[i];
      const text = html.substring(last + 1, next);
      parts.push(transformText(text));
      parts.push(config.inlineMathReplacement[0]);
      last = next;
    }
    {
      // closing
      const next = dollarSigns[i + 1];
      const math = html.substring(last + 1, next);
      parts.push(transformMath(math));
      parts.push(config.inlineMathReplacement[1]);
      last = next;
    }
  }

  let result = parts.join("");
  result = result.replaceAll("\\", "\\\\");

  // console.log("mathjax parsed result:", result);

  return result;
};
