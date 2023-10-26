//The solutions are described in file problem1-readme.md

//THE FIRST WAY:
//Providing a parameter N (N: any integer), assume N is a positive integer  --> sumTo(N) == 0 + 1 + ... + (N-1) + N
//let's have a reverse number series of the sumToN mentioned above: N + (N-1) + ... + 1 + 0
//Then, add the two series in the corresponding order:
// sumTo(N) + sumTo(N) == (0 + N) + (1 + N-1) + ... + (N-1 + 1) + (N + 0) == sum (N+1) times of N
// --> sumToN == N*(N+1)/2
//In case the parameter is a negative integer, the absolute value sum of (-N, -N+1, ..., -1, 0) is still equal
//Therefore, we add the indentifier "N/Math.abs(N)" to determine the returned sum is positive or negative according to N
var sum_to_n_a = function (n) {
  let m = Math.abs(n)
  if (m <= 1) return n

  return ((n / m) * m * (m + 1)) / 2
}

//THE SECOND WAY: recursion
var sum_to_n_b = function (n) {
  let m = Math.abs(n)
  if (m <= 1) return n

  return (m + sum_to_n_b(m - 1)) * (n / m)
}

//The third way: for loop
var sum_to_n_c = function (n) {
  let m = Math.abs(n)
  if (m <= 1) return n

  let sum = 0
  for (let i = 0; i <= m; i++) {
    sum += i
  }

  return (n / m) * sum
}
