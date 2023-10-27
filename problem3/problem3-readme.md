## Problem 3: Messy React

---

- Based on my knowledge in ReactJS, I found and marked 10 problems in the given code (**problem3.tsx**).
- I'm going to list out all details below and come up with a refactor version (**refactorVer.tsx**).

### PROBLEM 1: No need FormattedWalletBalance interface

In this context, I see that interface FormattedWalletBalance is defined for formattedBalances[]. However, it is not necessary to create formattedBalances[] to only add 1 more 'formatted' field to pass to WalletRow.

--> Solution: We should remove it to reduce memory using or comment for using later in the future.

---

### PROBLEM 2: balances returned from useWalletBalances() is an array - a reference data type

Whenever other props/states change and the 'inner value' of balances[] doesn't change, the useMemo hook below always re-calculate.
Because React uses Object.is as a comparator for hooks' dependencies array.

--> Solution: We should stringify balances[] then pass it as useMemo's dependency to help useMemo invoke properly.

---

### PROBLEM 3: blockchainPriorities

From my POV, the priority of blockchain isn't stable. It may change according to market trend or user's customization. Therefore, hardcode seems to be a bad practice if we use switch/case to loop over all cases and return corresponding priority. Besides, we must to directly edit in source code whenever there are any changes in priority. It's terrible!

--> Solution: We should create a TABLE which having a same format with JSON to store the priority. It can help avoiding case-over-case iretation and easily replacing with response data from API in the future

---

### PROBLEM 4: sortedBalances function only depends on balances[] and verbose code

As we can see, sortedBalances doesn't reply on 'prices' and it shouldn't re-compute when prices changes. Besides, it should be re-written to be more concise and easier to understand

--> Solution: Remove prices from useMemo's dependency array

---

### PROBLEM 5: 'balance.blockchain' is undefined

Defined interface WalletBalance doesn't exist field 'blockchain'. It maybe a mistake caused by 'blockchain' in getPriority parameter.

--> Solution: change from 'balance.blockchain' to 'balance.currency'

---

### PROBLEM 6: Another word mistake

--> Solution: lhsPriority --> balancePriority

---

### PROBLEM 7: Unnecessary formattedBalances array

\*\Same as PROBLEM 1

---

### PROBLEM 8: word mistake and optimization problem

Discussed in PROBLEM 1 and 7: if we still need using formattedBalances[] for another purpose, there is a mistake that rows' result should base on formattedBalances result, not sortedBalances.
Additionally, rows's result seem to be an expensive computation. Because the function loops over the array and return corresponding number of WalletRow with passed props processing inside.

--> Solution: We should use useMemo hook to cache rows result.

\*\Note: in the two case using useMemo hook(sortedBalances and rows) to memorize its result, we should carefully consider useMemo pitfall. Using useMemo indiscriminately will lead to counterproductive consequence instead of improving the performance.

---

### PROBLEM 9: Using array index as a key is a bad practice

Using index as a key will lead to unexpected behaviours by React if there are some changes in array. Each child should provide a unique key like its own id which indexed in database. However, it seems to have no id field in this context.

--> Solution: We can use 'currency' field as an identifier

---

### PROBLEM 10: pass directly balance.amount.toFixed()

This is a reason for PROBLEM 1 and 7, we can pass directly without having an intermediate array to do that.

--> Solution: change value of formattedAmount prop from 'balance.formatted' to 'balance.amount.toFixed()'

---

---

That's all. I'm glad to hear from you soon.
Have a good day !!

VoPhucThaiDuong
