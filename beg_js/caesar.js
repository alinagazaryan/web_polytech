function caesar(str, shift, action) {
    const russianAlphabet = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";
    let result = "";

    for (let i = 0; i < str.length; i++) {
        const char = str[i];
        const charIndex = russianAlphabet.indexOf(char);

        if (charIndex !== -1) {
            // Символ находится в русском алфавите.
            let shiftedIndex;
            if (action === "encode") {
                shiftedIndex = (charIndex + shift) % russianAlphabet.length;
            } else if (action === "decode") {
                shiftedIndex = (charIndex - shift + russianAlphabet.length) % russianAlphabet.length;
            }
            result += russianAlphabet[shiftedIndex];
        } else {
            // Символ не является буквой русского алфавита, оставляем его неизменным.
            result += char;
        }
    }

    return result;
}