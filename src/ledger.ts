import crypto from 'crypto';
import fp from 'lodash/fp';
import {
  BlockChain,
  Header,
  Block,
  Transaction,
  Sha256Hash
} from './ledger.types'

const SHA256 = (text: string): Sha256Hash => crypto.createHash("sha256").update(text).digest("hex");

const getMerkleRootHash = (leaves: Transaction[]): Sha256Hash => {
  const tree = leaves.map(leave => getTxHash(leave))
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

const getTxHash = (tx: Transaction): Sha256Hash => {
  const getTxString = (tx: Transaction): string => {
    return tx.from + tx.to + tx.amount + tx.signature
  }
  return SHA256(getTxString(tx))
}

const getHeaderHash = (header: Header): Sha256Hash => {
  return SHA256(header.prevBlockHeaderHash + header.timestamp + header.nonce + header.merkleRootHash)
}

const isValidHash = (hash: Sha256Hash): boolean => {
  return hash.slice(0, 2) === '00'
}

const mine = (txs: Transaction[], prevBlockHeaderHash: Sha256Hash, timestamp: string) => {
  let nonce = 0
  const getHeader = (nonce: number) => ({
    prevBlockHeaderHash,
    nonce: String(nonce),
    timestamp,
    merkleRootHash: getMerkleRootHash(txs)
  })
  while (!isValidHash(getHeaderHash(getHeader(nonce)))) {
    nonce = nonce + 1
    console.log('trying', nonce)
  }
  return String(nonce)
}

// 构造区块
const getBlock = (txs: Transaction[], prevBlockHeaderHash: Sha256Hash, nonce: string, timestamp: string) => {
  const header = {
    prevBlockHeaderHash,
    nonce,
    timestamp,
    merkleRootHash: getMerkleRootHash(txs)
  }
  return {
    header,
    headerHash: getHeaderHash(header),
    data: txs
  }
}

const addBlockToChain = (chain: BlockChain, txs: Transaction[], timestamp: string) => {
  const nonce = mine(txs, chain.block.headerHash, timestamp)
  return {
    index: String(chain.index + 1),
    prevBlock: genesisBlock,
    block: getBlock(txs, chain.block.headerHash, nonce, timestamp)
  }
}

const txs: Transaction[] = [
  { from: 'address1', to: 'address2', amount: '100', signature: 'zeb' },
  { from: 'address1', to: 'address3', amount: '300', signature: 'zeb' },
  { from: 'address1', to: 'address4', amount: '300', signature: 'zeb' },
  { from: 'address1', to: 'address5', amount: '300', signature: 'zeb' },
  { from: 'address1', to: 'address6', amount: '300', signature: 'zeb' }
]

const genesisBlock: Block = getBlock(txs, '', mine(txs, '', String(new Date('2020-01-01').getTime())), String(new Date('2020-01-01').getTime()))

const genesisBlockChain: BlockChain = {
  index: '1',
  prevBlock: null,
  block: genesisBlock
}

console.log(genesisBlockChain)
console.log(addBlockToChain(genesisBlockChain, txs, String(Date.now())))
