import formatNumber from "../format-number"

describe("formatNumber", () => {
  describe("numbers below 1000", () => {
    it("returns the number as-is", () => {
      expect(formatNumber(0)).toBe("0")
      expect(formatNumber(50)).toBe("50")
      expect(formatNumber(999)).toBe("999")
    })
  })

  describe("thousands (1K - 999K)", () => {
    it("formats round thousands without decimal", () => {
      expect(formatNumber(1000)).toBe("1K")
      expect(formatNumber(2000)).toBe("2K")
      expect(formatNumber(10000)).toBe("10K")
      expect(formatNumber(100000)).toBe("100K")
    })

    it("formats non-round thousands with one decimal", () => {
      expect(formatNumber(1500)).toBe("1.5K")
      expect(formatNumber(2300)).toBe("2.3K")
      expect(formatNumber(52025)).toBe("52K")
      expect(formatNumber(52500)).toBe("52.5K")
    })
  })

  describe("millions (1M - 999M)", () => {
    it("formats round millions without decimal", () => {
      expect(formatNumber(1000000)).toBe("1M")
      expect(formatNumber(2000000)).toBe("2M")
      expect(formatNumber(52000000)).toBe("52M")
      expect(formatNumber(100000000)).toBe("100M")
    })

    it("formats non-round millions with one decimal", () => {
      expect(formatNumber(1500000)).toBe("1.5M")
      expect(formatNumber(3200900)).toBe("3.2M")
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

    it("formats non-round billions with one decimal", () => {
      expect(formatNumber(1398300000)).toBe("1.4B")
      expect(formatNumber(1500000000)).toBe("1.5B")
      expect(formatNumber(2300000000)).toBe("2.3B")
    })
  })
})
