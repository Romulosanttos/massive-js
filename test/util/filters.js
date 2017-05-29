'use strict';

const filters = require("../../lib/util/filters");

describe("filters", function () {
  describe("schema", function () {
    it("allows all schemata", function () {
      assert.equal(filters.schema("all"), "");
      assert.equal(filters.schema("*"), "");
      assert.equal(filters.schema(null), "");
      assert.equal(filters.schema(), "");
    });

    it("returns string filters", function () {
      assert.equal(filters.schema("one"), "one");
      assert.equal(filters.schema("one, two"), "one, two");
    });

    it("joins array filters", function () {
      assert.equal(filters.schema(["one"]), "one");
      assert.equal(filters.schema(["one", "two"]), "one, two");
    });

    it('throws on invalid input', function () {
      assert.throws(() => filters.schema({}));
    });
  });

  describe("entity", function () {
    it("allows all entities", function () {
      assert.equal(filters.entity(), "");
    });

    it("returns string filters", function () {
      assert.equal(filters.entity("one"), "one");
      assert.equal(filters.entity("one, two"), "one, two");
    });

    it("joins array filters", function () {
      assert.equal(filters.entity(["one"]), "one");
      assert.equal(filters.entity(["one", "two"]), "one, two");
    });

    it('throws on invalid input', function () {
      assert.throws(() => filters.entity({}));
    });
  });
});
