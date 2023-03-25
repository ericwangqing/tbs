require("dotenv").config();
const { Polybase } = require("@polybase/client");
const { ethPersonalSign } = require("@polybase/eth");
const { PRIVATE_KEY } = process.env;

const db = new Polybase({
  defaultNamespace: "pk/0x54e5a716fa6247b6a28ec8acccdb5bd4ca09eb8f8e3d2633c24ce3de1b5813c80b63c6afbc70457e96a5f6b474a10cfd9e901f0b33b657dee29b6ddb3e43095c/tab",
});

db.applySchema(`
@public
collection Tab{
  id:string;
  slot:number;
  slotMap:map<string, string>;

  constructor (id: string,slot:number,slotMap:map<string, string>) {
    this.id = id;
    this.slot = slot;
    this.slotMap = slotMap;
  }

  function setTab(creator:string,blockHash:string){
    this.slotMap[creator] = blockHash;
  }

  function hasBlock(creator:string,blockHash:string){
    return this.slotMap[creator] == blockHash;
  }
}
  `);

// Add signer fn
// db.signer(async (data) => {
//   return { h: "eth-personal-sign", sig: ethPersonalSign(PRIVATE_KEY, data) };
// });

async function main() {
  const col = db.collection("Tab");
  await col.create(["2", 2, {}]);

  await col.record("2").call("setTab", ["lixinfengAddress", "lixinfengBlockHash"]);
}

main();
