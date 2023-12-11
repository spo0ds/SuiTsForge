import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { packageId, schoolRecordId } from "../constants/ids";
import * as dotenv from 'dotenv';
dotenv.config();


async function add_school_data() {
  const mnemonic = process.env.MNEMONICS || '';
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${packageId}::registration::addSchool`,
    arguments: [
      tx.pure.string("MIT"),
      tx.pure.string("77 Massachusetts Ave, Cambridge, MA 02139"),
      tx.pure(["https://brand.mit.edu/"]),
      tx.pure.string(
        "MIT is a private research university in Cambridge, Massachusetts. It is known for its strong programs in science, technology, engineering, and mathematics (STEM)."
      ),
      tx.pure.string("University"),
      tx.pure.string("100"),
      tx.pure.string("80"),
      tx.object(schoolRecordId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
  });
  console.log({ result });
}

add_school_data();
