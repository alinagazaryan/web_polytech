function minDigit(x) {
    if (x < 0) {
        return "Число должно быть неотрицательным";
    }

    if (x === 0) {
        return 0;
    }

    let min = 9; 

    while (x > 0) {
        const digit = x % 10; 
        if (digit < min) {
            min = digit; 
        }
        x = Math.floor(x / 10);
    }

    return min;
}

const number1 = 35492;
const number2 = 1087;

// Нахождение минимальной цифры в числах
const minDigit1 = minDigit(number1);
console.log(`Минимальная цифра в числе ${number1}:`, minDigit1);

const minDigit2 = minDigit(number2);
console.log(`Минимальная цифра в числе ${number2}:`, minDigit2);
