import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { childId } from "../constants/ids";

async function objectDetails(obj: any) {
  const client = new SuiClient({
    url: getFullnodeUrl("testnet"),
  });
  // obj is objectID in string
  try {
    const txn = await client.getObject({
      id: obj,
      // fetch the object content field
      options: { showContent: true },
    });
    let data: any;
    data = txn.data;
    let fields = data.content.fields;
    console.log(fields);
  } catch (error) {
    // Handle potential errors if the promise rejects
    console.error(error);
  }
}

objectDetails(childId);
