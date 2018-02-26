const path = require("path");
const { expect } = require("chai");

const root = process.env.ROOT_DIR;
const testDir = "test";
const libDir = "lib";
const formattingDir = path.join(libDir, "formatting");
const linterDir = path.join(formattingDir, "linter");

const util = require(path.join(root, testDir, libDir, "util"));

const eslint = require(path.join(root, linterDir, "eslint"));

describe("eslint", () => {
  describe("exports", () => {
    const expectedExports = ["fullSummary", "summary", "ruleSummary"];

    util.expectExports(eslint, expectedExports);
  });

  const generateExpectedSummary = (errors, warnings) => {
    return [
      "Type | Count",
      "--- | ---",
      "Warnings|" + warnings,
      "Errors|" + errors,
    ];
  };

  const generateExpectedRuleSummary = lines => {
    if (lines.length === 0) return [];

    return ["Rule | Count", "--- | ---"].concat(lines);
  };

  describe("one file, no messages", () => {
    const results = [
      {
        messages: [],
        errorCount: 0,
        warningCount: 0,
      },
    ];

    const expectedSummary = generateExpectedSummary(0, 0);
    const expectedRuleSummary = [];

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(expectedRuleSummary)
      );
    });
  });

  describe("zero files", () => {
    const results = [];

    const expectedSummary = generateExpectedSummary(0, 0);
    const expectedRuleSummary = [];

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(expectedRuleSummary)
      );
    });
  });

  describe("one file, one message", () => {
    const results = [
      {
        messages: [
          {
            ruleId: "example",
          },
        ],
        errorCount: 1,
        warningCount: 0,
      },
    ];

    const expectedSummary = generateExpectedSummary(1, 0);
    const expectedRuleSummary = generateExpectedRuleSummary(["example|1"]);

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(["\n"].concat(expectedRuleSummary))
      );
    });
  });

  describe("one file, two different messages", () => {
    const results = [
      {
        messages: [
          {
            ruleId: "example",
          },
          {
            ruleId: "example2",
          },
        ],
        errorCount: 1,
        warningCount: 1,
      },
    ];

    const expectedSummary = generateExpectedSummary(1, 1);
    const expectedRuleSummary = generateExpectedRuleSummary([
      "example|1",
      "example2|1",
    ]);

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(["\n"].concat(expectedRuleSummary))
      );
    });
  });

  describe("one file, two messages same rule", () => {
    const results = [
      {
        messages: [
          {
            ruleId: "example",
          },
          {
            ruleId: "example",
          },
        ],
        errorCount: 2,
        warningCount: 0,
      },
    ];

    const expectedSummary = generateExpectedSummary(2, 0);
    const expectedRuleSummary = generateExpectedRuleSummary(["example|2"]);

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(["\n"].concat(expectedRuleSummary))
      );
    });
  });

  describe("two files, one message each, same rule", () => {
    const results = [
      {
        messages: [
          {
            ruleId: "example",
          },
        ],
        errorCount: 1,
        warningCount: 0,
      },
      {
        messages: [
          {
            ruleId: "example",
          },
        ],
        errorCount: 1,
        warningCount: 0,
      },
    ];

    const expectedSummary = generateExpectedSummary(2, 0);
    const expectedRuleSummary = generateExpectedRuleSummary(["example|2"]);

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(["\n"].concat(expectedRuleSummary))
      );
    });
  });

  describe("two files, one message each, different rule", () => {
    const results = [
      {
        messages: [
          {
            ruleId: "example",
          },
        ],
        errorCount: 1,
        warningCount: 0,
      },
      {
        messages: [
          {
            ruleId: "example2",
          },
        ],
        errorCount: 0,
        warningCount: 1,
      },
    ];

    const expectedSummary = generateExpectedSummary(1, 1);
    const expectedRuleSummary = generateExpectedRuleSummary([
      "example|1",
      "example2|1",
    ]);

    it("should produce the expected markdown table", () => {
      expect(eslint.summary(results)).to.deep.equal(expectedSummary);
      expect(eslint.ruleSummary(results)).to.deep.equal(expectedRuleSummary);
      expect(eslint.fullSummary(results)).to.deep.equal(
        expectedSummary.concat(["\n"].concat(expectedRuleSummary))
      );
    });
  });
});
