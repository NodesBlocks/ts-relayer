// This file outputs some basic test functionality, and includes tests that they work
import test from 'ava';

import {
  fundAccount,
  generateMnemonic,
  osmosis,
  signingClient,
  TestLogger,
} from './testutils';

test.serial('funds account and checks balance', async (t) => {
  const logger = new TestLogger();
  // create apps and fund an account
  const mnemonic = generateMnemonic();
  const src = await signingClient(osmosis, mnemonic, logger);
  await fundAccount(osmosis, src.senderAddress, '600000');

  const balance = await src.query.bank.allBalances(src.senderAddress);
  t.deepEqual(balance, [{ amount: '600000', denom: 'uosmo' }]);

  const unused = await src.query.bank.allBalances(osmosis.unused.address);
  t.deepEqual(unused, [
    { amount: osmosis.unused.balanceStaking, denom: 'uosmo' },
  ]);
});
