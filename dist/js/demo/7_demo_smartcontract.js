"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
const utils_1 = require("../utils");
const demoutils_1 = require("./demoutils");
console.log('\n\n### Object ###\n');
console.log(demoutils_1.demoinput);
console.log('\n\n### Leafs ###\n');
const leafs = __1.PreciseProofs.createLeafs(demoutils_1.demoinput);
console.log(leafs);
console.log('\n\n### The Merkle Tree ###\n');
const merkleTree = __1.PreciseProofs.createMerkleTree(leafs.map((leaf) => leaf.hash));
const rootHash = merkleTree[merkleTree.length - 1][0];
const schema = leafs.map((leaf) => leaf.key);
const extendedTreeHash = __1.PreciseProofs.createExtendedTreeRootHash(rootHash, schema);
console.log(merkleTree);
console.log("\nRoot hash:" + rootHash);
console.log("Extended root hash:" + extendedTreeHash);
utils_1.printMerkleTree(merkleTree, leafs, schema);
console.log('\n\n### Publish commitment to a Smart Contract###\n');
demoutils_1.localAccounts().then((accounts) => {
    let from = accounts[0];
    console.log("account " + from);
    demoutils_1.newCommitment("test", extendedTreeHash, schema, { from: from })
        .on('transactionHash', function (hash) {
        console.log("Transaction hash: " + hash);
    })
        .then((receipt) => {
        console.log('\n\n### Extended Proof ###\n');
        const extendedProof = __1.PreciseProofs.createProof('street', leafs, true);
        console.log(extendedProof);
        //Verifier reads the commitment from the contract then verifies
        demoutils_1.getCommitment(from, "test").then((comm) => {
            console.log("\nVerifying the proof to the extended root hash: " + comm.merkleRoot);
            console.log("Result: " + __1.PreciseProofs.verifyProof(comm.merkleRoot, extendedProof, comm.schema));
        });
    });
});
//# sourceMappingURL=7_demo_smartcontract.js.map