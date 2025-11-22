import {
  PairSet,
  StrategyShipped,
} from "../types/templates/StudioProVault/StudioProVault";
import { AquaPair, AquaStrategy } from "../types/schema";
import { Bytes, BigInt } from "@graphprotocol/graph-ts";

export function handlePairSet(event: PairSet): void {
  // Create unique ID: vault address + pairHash
  const pairId = event.address.toHex() + ":" + event.params.pairHash.toHex();

  let pair = AquaPair.load(pairId);
  if (!pair) {
    pair = new AquaPair(pairId);
  }

  pair.vault = event.address;
  pair.token0 = event.params.token0;
  pair.token1 = event.params.token1;
  pair.feeBps = event.params.feeBps;
  pair.pairHash = event.params.pairHash;
  pair.block = event.block.number;
  pair.timestamp = event.block.timestamp;
  pair.txid = event.transaction.hash;

  pair.save();
}

export function handleStrategyShipped(event: StrategyShipped): void {
  // Create unique ID: vault address + pairHash + strategyHash + logIndex
  const strategyId =
    event.address.toHex() +
    ":" +
    event.params.pairHash.toHex() +
    ":" +
    event.params.strategyHash.toHex() +
    ":" +
    event.logIndex.toHex();

  const strategy = new AquaStrategy(strategyId);

  strategy.vault = event.address;
  strategy.pairHash = event.params.pairHash;
  strategy.strategyHash = event.params.strategyHash;
  strategy.block = event.block.number;
  strategy.timestamp = event.block.timestamp;
  strategy.txid = event.transaction.hash;

  strategy.save();
}
