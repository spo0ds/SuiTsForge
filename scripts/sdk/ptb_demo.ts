import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { SUI_CLOCK_OBJECT_ID } from "@mysten/sui.js/utils";
import { packageId, schoolRecordId } from "../constants/ids";
import * as dotenv from 'dotenv';
dotenv.config();


async function ptb_add_data() {
  const mnemonic = process.env.MNEMONICS || '';
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  const packageObjectId = packageId;

  const tx = new TransactionBlock();
  tx.moveCall({
    target: `${packageObjectId}::registration::addSchool`,
    arguments: [
      tx.pure.string("Harvard University"),
      tx.pure.string("20 Quincy St, Cambridge, MA 02138"),
      tx.pure(["https://libguides.ucd.ie/harvardstyle/harvardimageorphoto"]),
      tx.pure.string(
        "Harvard is a private Ivy League university in Cambridge, Massachusetts. It is the oldest institution of higher learning in the United States and is consistently ranked one of the top universities in the world."
      ),
      tx.pure.string("University"),
      tx.pure.string("100"),
      tx.pure.string("80"),
      tx.object(schoolRecordId),
      tx.object(SUI_CLOCK_OBJECT_ID),
    ],
  });

  tx.moveCall({
    target: `${packageObjectId}::registration::addSchool`,
    arguments: [
      tx.pure.string("Stanford University"),
      tx.pure.string("450 Serra St, Stanford, CA 94305"),
      tx.pure([
        "https://identity.stanford.edu/visual-identity/stanford-logos/",
      ]),
      tx.pure.string(
        "Stanford is a private research university in Stanford, California. It is known for its entrepreneurial spirit and its strong programs in computer science, technology, and business."
      ),
      tx.pure.string("University"),
      tx.pure.string("145"),
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

ptb_add_data();
