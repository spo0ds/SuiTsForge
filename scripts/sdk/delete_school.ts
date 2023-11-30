import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import {
  packageId,
  cap,
  childId,
  schoolRecordId,
  mnemonic,
} from "../constants/ids";

async function delete_object() {
  const tx = new TransactionBlock();

  // Generate a new Ed25519 Keypair
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });
  const packageObjectId = packageId;

  tx.moveCall({
    target: `${packageObjectId}::registration::delete_school_object`,
    arguments: [
      tx.object(cap),
      tx.object(schoolRecordId),
      tx.pure.address(childId),
    ],
  });

  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });
  console.log({ result });
}

delete_object();
