function getSortedArray(array, key) {
    const n = array.length;
    let temp;

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j][key] > array[j + 1][key]) {
                temp = array[j];
                array[j] = array[j + 1];
                array[j + 1] = temp;
            }
        }
    }

    return array;
}

// Пример использования:
const people = [
    { name: 'John', age: 30 },
    { name: 'Alice', age: 25 },
    { name: 'Bob', age: 35 }
];

const sortedPeopleByName = getSortedArray(people, 'name');
console.log("Сортировка по имени:", sortedPeopleByName);

const sortedPeopleByAge = getSortedArray(people, 'age');
console.log("Сортировка по возрасту:", sortedPeopleByAge);

