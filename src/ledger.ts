const crypto = require('crypto');
import fp from 'lodash/fp';

type Sha256Hash = string;

const SHA256 = (text: string): Sha256Hash => crypto.createHash("sha256").update(text).digest("hex");

const getMerkleRootHash = (leaves: Transaction[]): Sha256Hash => {
    const tree = leaves.map(leave => SHA256(getTxString(leave)))
    return getMerkleRootHashHelper(tree)
}

const getMerkleRootHashHelper = (leaves: string[]): Sha256Hash => {
    if (leaves.length < 1) return ''
    if (leaves.length === 1) return leaves[0]
    if (leaves.length % 2 !== 0) {
        return getMerkleRootHashHelper([...leaves, leaves[leaves.length - 1]])
    }
    if (leaves.length % 2 === 0) {
        return fp.pipe(
            fp.chunk(2),
            fp.map<[string, string], string>(
                ([a, b]) => SHA256(a + b)
            ),
            getMerkleRootHashHelper
        )(leaves)
    }
    return ''
}

interface BlockChain {
    prevBlock: BlockChain;
    block: Block;
    currIndex: number;
}

interface Block {
    header: {
        prevHash: Sha256Hash;
        timestamp: string;
        nonce: number;
        merkleRootHash: Sha256Hash;
    };
    headerHash: Sha256Hash;
    data: Transaction[];
}

interface Transaction {
    from: string;
    to: string;
    amount: string;
    signature: Sha256Hash;
}

const getBlockHash = (target: Block): Sha256Hash => {
    return SHA256('')
}

const getTxHash = (target: Transaction): Sha256Hash => {
    return SHA256('')
}

const getTxString = (target: Transaction): string => {
    return target.from + target.to + target.amount
}

const txs: Transaction[] = [
    { from: 'address1', to: 'address2', amount: '100', signature: 'zeb' },
    { from: 'address1', to: 'address3', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address4', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address5', amount: '300', signature: 'zeb' },
    { from: 'address1', to: 'address6', amount: '300', signature: 'zeb' }
]

console.log(getMerkleRootHash(txs))
