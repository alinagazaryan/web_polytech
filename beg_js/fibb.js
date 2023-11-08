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