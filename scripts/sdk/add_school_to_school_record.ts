import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { packageId, cap, childId, schoolRecordId } from "../constants/ids";

async function add_loc() {
  const tx = new TransactionBlock();

  const keypair = Ed25519Keypair.deriveKeypair(packageId);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  const packageObjectId = packageId;

  tx.moveCall({
    target: `${packageObjectId}::registration::add_school_to_school_record`,
    arguments: [tx.object(cap), tx.object(schoolRecordId), tx.object(childId)],
  });

  const result1 = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });
  console.log({ result1 });
}

add_loc();
