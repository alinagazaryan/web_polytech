function gcd(a, b) {
    while (b !== 0) {
        var temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

// Пример использования:
const number1 = 48;
const number2 = 18;

// Нахождение НОД чисел 48 и 18
const result = gcd(number1, number2);

console.log(`Наибольший общий делитель чисел ${number1} и ${number2}:`, result);
