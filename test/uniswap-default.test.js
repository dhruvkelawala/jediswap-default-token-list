const packageJson = require("../package.json");
const schema = require("@jediswap/token-lists/src/tokenlist.schema.json");
const { expect } = require("chai");
const Ajv = require("ajv");
const buildList = require("../src/buildList");
const { validateAndParseAddress } = require("starknet");

const ajv = new Ajv({ allErrors: true, format: "full", verbose: true });
const validator = ajv.compile(schema);

describe("buildList", () => {
  const defaultTokenList = buildList();
  // console.log(
  //   "🚀 ~ file: uniswap-default.test.js ~ line 13 ~ describe ~ defaultTokenList",
  //   defaultTokenList
  // );

  it("validates", () => {
    expect(validator(defaultTokenList)).to.equal(true);
  });

  it("contains no duplicate addresses", () => {
    const map = {};
    for (let token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.address}`;
      expect(typeof map[key]).to.equal("undefined");
      map[key] = true;
    }
  });

  it("contains no duplicate symbols", () => {
    const map = {};
    for (let token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.symbol.toLowerCase()}`;
      expect(typeof map[key]).to.equal("undefined");
      map[key] = true;
    }
  });

  it("contains no duplicate names", () => {
    const map = {};
    for (let token of defaultTokenList.tokens) {
      const key = `${token.chainId}-${token.name.toLowerCase()}`;
      expect(typeof map[key]).to.equal(
        "undefined",
        `duplicate name: ${token.name}`
      );
      map[key] = true;
    }
  });

  it("all addresses are valid and checksummed", () => {
    for (let token of defaultTokenList.tokens) {
      // const isAddressValid = ;

      expect(() => validateAndParseAddress(token.address)).to.not.throw();
    }
  });

  it("version matches package.json", () => {
    expect(packageJson.version).to.match(/^\d+\.\d+\.\d+$/);
    expect(packageJson.version).to.equal(
      `${defaultTokenList.version.major}.${defaultTokenList.version.minor}.${defaultTokenList.version.patch}`
    );
  });
});
