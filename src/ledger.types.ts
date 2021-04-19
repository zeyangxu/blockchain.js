export type Sha256Hash = string;

export interface BlockChain {
  index: string;
  prevBlock: BlockChain | null;
  block: Block;
}

// const addBlock = (chain: BlockChain): BlockChain { }

export interface Header {
  prevBlockHeaderHash: Sha256Hash;
  timestamp: string;
  nonce: string;
  merkleRootHash: Sha256Hash;
};

export interface Block {
  header: Header;
  headerHash: Sha256Hash;
  data: Transaction[];
}

export interface Transaction {
  from: string;
  to: string;
  amount: string;
  signature: Sha256Hash;
}