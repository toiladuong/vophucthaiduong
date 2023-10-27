//****
//**All changes are described in "problem3-readme.md" file and "problem3.tsx" file!
//****

interface WalletBalance {
  currency: string;
  amount: number;
}

interface Props extends BoxProps {}

const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  //Create an TABLE (same with JSON format to be easily replaced by response from API in the future) to store the priotiry of blockchain.
  const blockchainPriorities = {
    Osmosis: 100,
    Ethereum: 50,
    Arbitrum: 30,
    Zilliqa: 20,
    Neo: 20,
  };

  //Re-write the getPriority function to be more concise and easier to understand.
  const getPriority = (blockchain: string): number => {
    return blockchainPriorities[blockchain] || -99;
  };

  //remove the unnecessary dependency 'prices' so that useMemo hook is not invoked when prices state change.
  //Besides, re-write the sortedBalances function to be more concise and easier to understand.
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        //balance.blockchain  --> balance.currency
        const balancePriority = getPriority(balance.currency);
        return balancePriority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        //balance.blockchain  --> balance.currency
        const leftPriority = getPriority(lhs.currency);
        const rightPriority = getPriority(rhs.currency);

        return rightPriority - leftPriority;
      });
  }, [JSON.stringify(balances)]); //stringify to avoid improperly re-rendering

  //use useMemo to cache rows' result with dependency is the result from sortedBalances function
  const rows = useMemo(
    () =>
      sortedBalances.map((balance: WalletBalance) => {
        const usdValue = prices[balance.currency] * balance.amount;
        return (
          <WalletRow
            className={classes.row}
            //In this case, the currency field is unique string so we can pass as a key.
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            //we can pass directly balance.amount.toFixed() to formattedAmount prop
            formattedAmount={balance.amount.toFixed()}
          />
        );
      }),
    [sortedBalances]
  );

  return <div {...rest}>{rows}</div>;
};
