//****
//**All PROBLEMS are described in "problem3-readme.md and" and "problem3.tsx" file!
//****
interface WalletBalance {
  currency: string;
  amount: number;
}

// ## PROBLEMS 1: No need FormattedWalletBalance --> should remove or comment for using later in the future.
//The reason is mentioned below (## PROBELM 10)
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;

  // ## PROBLEM 2: balances is an array (reference type)
  //--> Although the 'inner value' of balances doesn't change, the useMemo hook below always re-calculate.
  //Because React uses Object.is to compare dependencies.
  const balances = useWalletBalances();
  const prices = usePrices();

  // ## PROBLEM 3: In practice, the blockchainPriorities can be changed over time by BACKEND system or users.
  // Therefore, the priority TABLE should be fetched from BACKEND or from User's priority customization.
  // Instead of using Switch/case to iterate overs cases one-by-one, create an TABLE (same with JSON format to be easily replaced by response from API in the future) to store the priotiry of blockchain.
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case 'Osmosis':
        return 100;
      case 'Ethereum':
        return 50;
      case 'Arbitrum':
        return 30;
      case 'Zilliqa':
        return 20;
      case 'Neo':
        return 20;
      default:
        return -99;
    }
  };

  // ## PROBLEM 4: sortedBalances function only depends on balances[]
  //We should remove the unnecessary dependency 'price' so that useMemo hook is not invoked when prices state change.
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain); //**PROBLEM 5: balance.blockchain is not a valid field on WalletBalance type defined

        //**PROBLEM 6: lhsPriority --> balancePriority
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        // ## PROBLEM 5 ##
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    // prices state is not a dependency of sortedBalances
    //balances[] is a non-primitive data type --> always make useMemo re-run
  }, [balances, prices]);

  // ## PROBLEM 7: Unnecessary formattedBalances variable --> should remove or comment for using later in the future
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      formatted: balance.amount.toFixed(),
    };
  });

  // ## PROBLEM 8: if we still need formattedBalances variable for another purpose --> rows' result should base on formattedBalances result
  //Besides, we should use useMemo hook to cache rows result because it seems to be an expensive computation
  const rows = sortedBalances.map(
    (balance: FormattedWalletBalance, index: number) => {
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          key={index} // ## PROBLEM 9: Using array index as a key is a bad practice. Each child should use a unique key like the id which indexed in database.
          amount={balance.amount}
          usdValue={usdValue}
          // ## PROBLEM 10: we can pass directly balance.amount.toFixed() to formattedAmount prop
          //--> no need to define and create an intermediate array (formattedWalletBalances) mentioned in PROBLEM 1 and PROBLEM 7
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  return <div {...rest}>{rows}</div>;
};
