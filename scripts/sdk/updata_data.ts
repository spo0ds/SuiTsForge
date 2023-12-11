import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import {
  packageId,
  cap,
  childId,
  schoolRecordId,
} from "../constants/ids";
import * as dotenv from 'dotenv';
dotenv.config();


async function update_name() {
  const tx = new TransactionBlock();
  const mnemonic = process.env.MNEMONICS || '';

  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  const packageObjectId = packageId;

  tx.moveCall({
    target: `${packageObjectId}::registration::update_name`,
    arguments: [
      tx.object(cap),
      tx.object(schoolRecordId),
      tx.pure.address(childId),
      tx.pure.string("Massachusetts Institute of Technology "),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });

  const result1 = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });
  console.log({ result1 });
}

update_name();
