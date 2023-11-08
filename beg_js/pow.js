function pow(x, n) {
    let result = 1;
    for (var i = 0; i < n; i++) {
      result *= x;
    }
    return result;
  }