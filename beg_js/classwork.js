//№1 
function bubbleSort(arr) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                // Если текущий элемент больше следующего, меняем их местами.
                const temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;
            }
        }
    }

    return arr;
}
//№2 
function countDuplicates(arr) {
    const countMap = new Map(); 

    for (const num of arr) {
        if (countMap.has(num)) {
            countMap.set(num, countMap.get(num) + 1);
        } else {
            countMap.set(num, 1);
        }
    }

    const duplicates = new Map(); 

    for (const [key, value] of countMap) {
        if (value > 1) {
            duplicates.set(key, value);
        }
    }

    return duplicates;
}
//№3
function findLargestRowMin(matrix) {
    if (matrix.length === 0) {
        return undefined; 
    }

    let largestMin = Number.MIN_VALUE;

    for (const row of matrix) {
        if (row.length === 0) {
            return undefined; 
        }

        const rowMin = Math.min(...row); 
        if (rowMin > largestMin) {
            largestMin = rowMin; 
        }
    }

    return largestMin; 
}

// Пример использования:
const matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
];

const largestRowMin = findLargestRowMin(matrix);
console.log(largestRowMin); 
//№4 
class Vector3D {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // сумма двух векторов
    add(vector) {
        return new Vector3D(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    // разность двух векторов
    subtract(vector) {
        return new Vector3D(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    // покомпонентное произведение двух векторов
    multiply(vector) {
        return new Vector3D(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }

    //умножение вектора на скаляр
    multiplyScalar(scalar) {
        return new Vector3D(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    // вычисление длины вектора
    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    // вычисление скалярного произведения двух векторов
    dot(vector) {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }
}
//№5 
function cyclicShiftLeft(arr, k) {
    const n = arr.length;
    k = k % n; //  когда k больше длины массива

    //  новый массив для результата
    const result = new Array(n);

    for (let i = 0; i < n; i++) {
        // новый индекс для элемента с учетом сдвига
        const newIndex = (i - k + n) % n; // новый индекс с учетос сдвига ЫЫ
        result[newIndex] = arr[i];
    }

    return result;
}