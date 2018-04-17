const { assert } = require("chai");
const hello = require("../src/hello");

describe("hello", function() {
  describe("#world", function(){
      it("should return 'hello world'", function() {
        assert.equal(hello.world(), "hello world");
      })
  })
  describe("#boulder", function(){
    it("should return 'hello boulder'", function() {
      assert.equal(hello.boulder(), "hello boulder");
    })
  })
})