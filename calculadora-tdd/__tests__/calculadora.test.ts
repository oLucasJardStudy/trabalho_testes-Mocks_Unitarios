import { Calculadora } from '../src/calculadora';

describe('Calculadora', () => {
  let calculadora: Calculadora;

  beforeEach(() => {
    calculadora = new Calculadora();
  });

  test('deve somar dois números corretamente', () => {
    expect(calculadora.soma(2, 3)).toBe(5);
  });

  test('deve somar com zero e números negativos', () => {
    expect(calculadora.soma(0, 7)).toBe(7);
    expect(calculadora.soma(-2, 5)).toBe(3);
    expect(calculadora.soma(-4, -1)).toBe(-5);
  });

  test('deve subtrair dois números corretamente', () => {
    expect(calculadora.subtracao(10, 4)).toBe(6);
  });

  test('deve subtrair com resultado negativo ou zero', () => {
    expect(calculadora.subtracao(3, 10)).toBe(-7);
    expect(calculadora.subtracao(5, 5)).toBe(0);
  });

  test('deve multiplicar dois números corretamente', () => {
    expect(calculadora.multiplicacao(3, 4)).toBe(12);
  });

  test('deve multiplicar por zero e por negativo', () => {
    expect(calculadora.multiplicacao(9, 0)).toBe(0);
    expect(calculadora.multiplicacao(-3, 4)).toBe(-12);
  });

  test('deve dividir dois números corretamente', () => {
    expect(calculadora.divisao(10, 2)).toBe(5);
  });

  test('deve dividir com decimais e numerador zero', () => {
    expect(calculadora.divisao(1, 4)).toBe(0.25);
    expect(calculadora.divisao(0, 5)).toBe(0);
  });

  test('deve lançar erro ao dividir por zero', () => {
    expect(() => calculadora.divisao(5, 0)).toThrow('Divisão por zero não é permitida');
  });

  test('deve calcular a raiz quadrada de um número não negativo', () => {
    expect(calculadora.raizQuadrada(9)).toBe(3);
    expect(calculadora.raizQuadrada(0)).toBe(0);
    expect(calculadora.raizQuadrada(2)).toBeCloseTo(Math.SQRT2);
  });

  test('deve lançar erro ao calcular raiz quadrada de número negativo', () => {
    expect(() => calculadora.raizQuadrada(-1)).toThrow(
      'Não é possível calcular a raiz quadrada de número negativo',
    );
  });

  test('deve calcular a média de uma lista de números', () => {
    expect(calculadora.media([2, 4, 6])).toBe(4);
    expect(calculadora.media([10])).toBe(10);
    expect(calculadora.media([1, 2, 3])).toBe(2);
    expect(calculadora.media([-10, 10, 4])).toBeCloseTo(4 / 3);
  });

  test('deve lançar erro ao calcular média de lista vazia', () => {
    expect(() => calculadora.media([])).toThrow('Lista vazia: não é possível calcular a média');
  });
});
