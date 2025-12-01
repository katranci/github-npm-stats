import formatNumber from "../format-number"

describe("formatNumber", () => {
  describe("numbers below 1000", () => {
    it("returns the number as-is", () => {
      expect(formatNumber(0)).toBe("0")
      expect(formatNumber(50)).toBe("50")
      expect(formatNumber(999)).toBe("999")
    })
  })

  describe("thousands (1K - 9.99K)", () => {
    it("formats round thousands without decimal", () => {
      expect(formatNumber(1000)).toBe("1K")
      expect(formatNumber(2000)).toBe("2K")
    })

    it("formats with two decimals for single-digit thousands", () => {
      expect(formatNumber(1230)).toBe("1.23K")
      expect(formatNumber(1500)).toBe("1.5K")
      expect(formatNumber(2340)).toBe("2.34K")
      expect(formatNumber(9990)).toBe("9.99K")
    })
  })

  describe("thousands (10K - 999K)", () => {
    it("formats round thousands without decimal", () => {
      expect(formatNumber(10000)).toBe("10K")
      expect(formatNumber(100000)).toBe("100K")
    })

    it("formats with one decimal for double/triple-digit thousands", () => {
      expect(formatNumber(52025)).toBe("52K")
      expect(formatNumber(52500)).toBe("52.5K")
    })
  })

  describe("millions (1M - 9.99M)", () => {
    it("formats round millions without decimal", () => {
      expect(formatNumber(1000000)).toBe("1M")
      expect(formatNumber(2000000)).toBe("2M")
    })

    it("formats with two decimals for single-digit millions", () => {
      expect(formatNumber(1230000)).toBe("1.23M")
      expect(formatNumber(1500000)).toBe("1.5M")
      expect(formatNumber(3210000)).toBe("3.21M")
      expect(formatNumber(9990000)).toBe("9.99M")
    })
  })

  describe("millions (10M - 999M)", () => {
    it("formats round millions without decimal", () => {
      expect(formatNumber(52000000)).toBe("52M")
      expect(formatNumber(100000000)).toBe("100M")
    })

    it("formats with one decimal for double/triple-digit millions", () => {
      expect(formatNumber(52025285)).toBe("52M")
      expect(formatNumber(213462906)).toBe("213.5M")
    })
  })

  describe("billions (1B+)", () => {
    it("formats round billions without decimal", () => {
      expect(formatNumber(1000000000)).toBe("1B")
      expect(formatNumber(2000000000)).toBe("2B")
      expect(formatNumber(10000000000)).toBe("10B")
    })

    it("formats billions with one decimal when second decimal is zero", () => {
      expect(formatNumber(1500000000)).toBe("1.5B")
      expect(formatNumber(2300000000)).toBe("2.3B")
    })

    it("formats billions with two decimals for more precision", () => {
      expect(formatNumber(1398300000)).toBe("1.4B")
      expect(formatNumber(1450000000)).toBe("1.45B")
      expect(formatNumber(1234000000)).toBe("1.23B")
      expect(formatNumber(2567000000)).toBe("2.57B")
    })
  })
})
