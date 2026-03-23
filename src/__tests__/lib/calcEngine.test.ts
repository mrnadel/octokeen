import { evaluate } from '@/components/calculator/calcEngine';

describe('calcEngine', () => {
  describe('basic arithmetic', () => {
    it('evaluates addition', () => { expect(evaluate('2+3')).toBe(5); });
    it('evaluates subtraction', () => { expect(evaluate('10-4')).toBe(6); });
    it('evaluates multiplication', () => { expect(evaluate('3*4')).toBe(12); });
    it('evaluates division', () => { expect(evaluate('15/3')).toBe(5); });
    it('respects operator precedence', () => { expect(evaluate('2+3*4')).toBe(14); });
    it('handles parentheses', () => { expect(evaluate('(2+3)*4')).toBe(20); });
    it('handles nested parentheses', () => { expect(evaluate('((2+3)*4)+1')).toBe(21); });
    it('handles decimals', () => { expect(evaluate('1.5+2.5')).toBe(4); });
    it('handles negative numbers', () => { expect(evaluate('-5+3')).toBe(-2); });
    it('handles unary minus', () => { expect(evaluate('-(3+2)')).toBe(-5); });
  });

  describe('error handling', () => {
    it('returns null for empty input', () => { expect(evaluate('')).toBeNull(); });
    it('returns null for unmatched parentheses', () => { expect(evaluate('(2+3')).toBeNull(); });
    it('returns null for division by zero', () => { expect(evaluate('5/0')).toBeNull(); });
    it('returns null for invalid expression', () => { expect(evaluate('2++3')).toBeNull(); });
    it('returns null for gibberish', () => { expect(evaluate('abc')).toBeNull(); });
  });

  describe('scientific functions', () => {
    it('evaluates sqrt', () => { expect(evaluate('sqrt(16)')).toBe(4); });
    it('evaluates power with ^', () => { expect(evaluate('2^3')).toBe(8); });
    it('evaluates log base 10', () => { expect(evaluate('log(100)')).toBe(2); });
    it('evaluates natural log', () => { expect(evaluate('ln(e)')).toBeCloseTo(1, 10); });
    it('evaluates sin (radians)', () => { expect(evaluate('sin(0)')).toBe(0); });
    it('evaluates cos (radians)', () => { expect(evaluate('cos(0)')).toBe(1); });
    it('evaluates nested functions', () => { expect(evaluate('sqrt(abs(-16))')).toBe(4); });
  });

  describe('constants', () => {
    it('evaluates pi', () => { expect(evaluate('pi')).toBeCloseTo(3.14159265, 6); });
    it('evaluates e', () => { expect(evaluate('e')).toBeCloseTo(2.71828, 4); });
    it('evaluates g', () => { expect(evaluate('g')).toBe(9.81); });
    it('uses pi in expressions', () => { expect(evaluate('2*pi')).toBeCloseTo(6.28318, 4); });
  });

  describe('degree mode', () => {
    it('evaluates sin(90) in degrees', () => { expect(evaluate('sin(90)', true)).toBeCloseTo(1, 10); });
    it('evaluates cos(0) in degrees', () => { expect(evaluate('cos(0)', true)).toBe(1); });
    it('evaluates tan(45) in degrees', () => { expect(evaluate('tan(45)', true)).toBeCloseTo(1, 10); });
    it('handles nested expressions in degree trig', () => { expect(evaluate('sin(45+45)', true)).toBeCloseTo(1, 10); });
    it('handles trig of complex expression in degrees', () => { expect(evaluate('sin(sqrt(8100))', true)).toBeCloseTo(1, 10); });
  });

  describe('abs function', () => {
    it('evaluates abs of negative', () => { expect(evaluate('abs(-5)')).toBe(5); });
  });

  describe('chained operations', () => {
    it('handles chained addition', () => { expect(evaluate('2+3+4')).toBe(9); });
    it('handles chained multiplication', () => { expect(evaluate('2*3*4')).toBe(24); });
    it('handles mixed chained ops with precedence', () => { expect(evaluate('2+3*4-1')).toBe(13); });
  });
});
