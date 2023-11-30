import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { getPackageInfo } from "./deploy";

export async function getCreatedObject() {
  try {
    const packageInfo = await getPackageInfo();
    const { digest, packageId } = packageInfo;

    if (!digest) {
      console.log("Digest is not available");
      return;
    }

    const client = new SuiClient({
      url: getFullnodeUrl("testnet"),
    });

    const txn = await client.getTransactionBlock({
      digest: String(digest),
      // only fetch the effects and objects field
      options: {
        showEffects: true,
        showInput: false,
        showEvents: false,
        showObjectChanges: true,
        showBalanceChanges: false,
      },
    });

    let capId;
    let schoolRecordId;

    if (txn.objectChanges) {
      txn.objectChanges.forEach((item) => {
        if (item.type === "created") {
          if (item.objectType === `${packageId}::registration::Cap`) {
            capId = String(item.objectId);
          } else if (
            item.objectType === `${packageId}::registration::School_Record`
          ) {
            schoolRecordId = String(item.objectId);
          }
        }
      });
    }

    console.log("New Digest is:", txn.digest);
    console.log("Package Id is:", packageId);
    console.log("CapId is:", capId);
    console.log("SchoolRecordId is:", schoolRecordId);
  } catch (error) {
    // Handle potential errors if the promise rejects
    console.error(error);
  }
}

getCreatedObject();
