

// Функция priority позволяет получить 
// значение приоритета для оператора.
// Возможные операторы: +, -, *, /.
// ----------------------------------------------------------------------------


function priority(operation) {
    if (operation == '+' || operation == '-') {
        return 1;
    } else {
        return 2;
    }
}

// Проверка, является ли строка str числом.
// ----------------------------------------------------------------------------


function isNumeric(str) {
    return /^\d+(.\d+){0,1}$/.test(str);
}

// Проверка, является ли строка str цифрой.
// ----------------------------------------------------------------------------


function isDigit(str) {
    return /^\d{1}$/.test(str);
}

// Проверка, является ли строка str оператором.
// ----------------------------------------------------------------------------


function isOperation(str) {
    return /^[\+\-\*\/]{1}$/.test(str);
}

// Функция tokenize принимает один аргумент -- строку
// с арифметическим выражением и делит его на токены 
// (числа, операторы, скобки). Возвращаемое значение --
// массив токенов.
// ----------------------------------------------------------------------------

function tokenize(str) {
    let tokens = [];
    let lastNumber = '';
    for (char of str) {
        if (isDigit(char) || char == '.') {
            lastNumber += char;
        } else {
            if (lastNumber.length > 0) {
                tokens.push(lastNumber);
                lastNumber = '';
            }
        } 
        if (isOperation(char) || char == '(' || char == ')') {
            tokens.push(char);
        } 
    }
    if (lastNumber.length > 0) {
        tokens.push(lastNumber);
    }
    return tokens;
}


// Функция compile принимает один аргумент -- строку
// с арифметическим выражением, записанным в инфиксной 
// нотации, и преобразует это выражение в обратную 
// польскую нотацию (ОПН). Возвращаемое значение -- 
// результат преобразования в виде строки, в которой 
// операторы и операнды отделены друг от друга пробелами. 
// Выражение может включать действительные числа, операторы 
// +, -, *, /, а также скобки. Все операторы бинарны и левоассоциативны.
// Функция реализует алгоритм сортировочной станции 
// (https://ru.wikipedia.org/wiki/Алгоритм_сортировочной_станции).
// ----------------------------------------------------------------------------


function compile(str) {
    let out = [];
    let stack = [];
    for (token of tokenize(str)) {
        if (isNumeric(token)) {
            out.push(token);
        } else if (isOperation(token)) {
            while (stack.length > 0 && 
                   isOperation(stack[stack.length - 1]) && 
                   priority(stack[stack.length - 1]) >= priority(token)) {
                out.push(stack.pop());
            }
            stack.push(token);
        } else if (token == '(') {
            stack.push(token);
        } else if (token == ')') {
            while (stack.length > 0 && stack[stack.length - 1] != '(') {
                out.push(stack.pop());
            }
            stack.pop();
        }
    }
    while (stack.length > 0) {
        out.push(stack.pop());
    }
    return out.join(' ');
}

// Функция evaluate принимает один аргумент -- строку 
// с арифметическим выражением, записанным в обратной 
// польской нотации. Возвращаемое значение -- результат 
// вычисления выражения. Выражение может включать 
// действительные числа и операторы +, -, *, /.
// Вам нужно реализовать эту функцию
// (https://ru.wikipedia.org/wiki/Обратная_польская_запись#Вычисления_на_стеке).
// ----------------------------------------------------------------------------


// Функция для оценки выражения в обратной польской нотации
function evaluate(expression) {
    const stack = [];
    const tokens = expression.split(' ');
  
    tokens.forEach(token => {
      if (isNumeric(token)) {
        stack.push(parseFloat(token));
      } else if (isOperation(token)) {
        const operand2 = stack.pop();
        const operand1 = stack.pop();
        switch (token) {
          case '+':
            stack.push(operand1 + operand2);
            break;
          case '-':
            stack.push(operand1 - operand2);
            break;
          case '*':
            stack.push(operand1 * operand2);
            break;
          case '/':
            stack.push(operand1 / operand2);
            break;
          default:
            console.error('Недопустимый оператор:', token);
        }
      }
    });
  
    if (stack.length !== 1) {
      console.error('Некорректное выражение:', expression);
      return NaN; // Возвращаем NaN в случае ошибки
    }
  
    return stack.pop();
  }
  
  // Обработчик события для нажатия на кнопки
  function clickHandler(event) {
    const target = event.target;
    const screen = document.querySelector('.screen');
  
    if (target.classList.contains('digit') || target.classList.contains('operation') || target.classList.contains('bracket')) {
      if (screen.innerText === '0') {
        screen.innerText = '';
      }
      screen.innerText += target.innerText;
    } else if (target.classList.contains('ac')) {
      screen.innerText = '0';
    } else if (target.classList.contains('result')) {
      const expression = screen.innerText;
      const rpnExpression = compile(expression);
      const result = evaluate(rpnExpression);
      screen.innerText = result.toFixed(2);
    }
  }
  
  // Добавляем обработчик события к элементу с идентификатором 'buttons'
  document.getElementById('buttons').addEventListener('click', clickHandler);
  