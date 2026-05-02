export class Calculadora {
  soma(a: number, b: number): number {
    return a + b;
  }

  subtracao(a: number, b: number): number {
    return a - b;
  }

  multiplicacao(a: number, b: number): number {
    return a * b;
  }

  divisao(a: number, b: number): number {
    if (b === 0) {
      throw new Error('Divisão por zero não é permitida');
    }
    return a / b;
  }

  raizQuadrada(n: number): number {
    if (n < 0) {
      throw new Error('Não é possível calcular a raiz quadrada de número negativo');
    }
    return Math.sqrt(n);
  }

  media(numbers: number[]): number {
    if (numbers.length === 0) {
      throw new Error('Lista vazia: não é possível calcular a média');
    }
    const total = numbers.reduce((acc, x) => acc + x, 0);
    return total / numbers.length;
  }
}
