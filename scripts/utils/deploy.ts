import {
  getFullnodeUrl,
  SuiClient,
  SuiObjectChangePublished,
} from "@mysten/sui.js/client";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { account, mnemonic, packagePath } from "../constants/ids";

import { execSync } from "child_process";

export async function getPackageInfo() {
  const keypair = Ed25519Keypair.deriveKeypair(mnemonic);
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });

  const { modules, dependencies } = JSON.parse(
    execSync(`sui move build --dump-bytecode-as-base64 --path ${packagePath}`, {
      encoding: "utf-8",
    })
  );
  const tx = new TransactionBlock();
  const [upgradeCap] = tx.publish({
    modules,
    dependencies,
  });
  tx.transferObjects([upgradeCap], tx.pure(account));
  const result = await client.signAndExecuteTransactionBlock({
    signer: keypair,
    transactionBlock: tx,
    options: {
      showEffects: true,
      showObjectChanges: true,
    },
  });
  const packageId = ((result.objectChanges?.filter(
    (a) => a.type === "published"
  ) as SuiObjectChangePublished[]) ?? [])[0].packageId.replace(
    /^(0x)(0+)/,
    "0x"
  ) as string;
  return {
    digest: result.digest,
    packageId: packageId,
  };
}

getPackageInfo();
