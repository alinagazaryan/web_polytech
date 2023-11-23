function pow(x, n) {
    let result = 1;
    for (var i = 0; i < n; i++) {
      result *= x;
    }
    return result;
  }


const result1 = pow(6, 2);
console.log(result1);


