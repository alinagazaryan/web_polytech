function fibb(n) {
    if (n <= 1) {
        return n;
    }

    let prev = 0;
    let current = 1;

    for (let i = 2; i <= n; i++) {
        const next = prev + current;
        prev = current;
        current = next;
    }

    return current;
}

// Пример использования:
const n = 7;

// Вычисление 7-го числа Фибоначчи
const result = fibb(n);

console.log(`Число Фибоначчи под номером ${n}:`, result);
