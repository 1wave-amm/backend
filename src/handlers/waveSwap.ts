import {
  SwapExactIn,
  SwapExactOut,
} from "../types/WaveSwap/WaveSwap";
import { Swap } from "../types/schema";
import { Bytes, BigInt } from "@graphprotocol/graph-ts";

export function handleSwapExactIn(event: SwapExactIn): void {
  const swapId =
    event.transaction.hash.toHex() +
    ":" +
    event.logIndex.toHex();

  const swap = new Swap(swapId);

  swap.vault = event.params.vault;
  swap.tokenIn = event.params.tokenIn;
  swap.tokenOut = event.params.tokenOut;
  swap.amountIn = event.params.amountIn;
  swap.amountOut = event.params.amountOut;
  swap.swapType = "ExactIn";
  swap.block = event.block.number;
  swap.timestamp = event.block.timestamp;
  swap.txid = event.transaction.hash;

  swap.save();
}

export function handleSwapExactOut(event: SwapExactOut): void {
  const swapId =
    event.transaction.hash.toHex() +
    ":" +
    event.logIndex.toHex();

  const swap = new Swap(swapId);

  swap.vault = event.params.vault;
  swap.tokenIn = event.params.tokenIn;
  swap.tokenOut = event.params.tokenOut;
  swap.amountIn = event.params.amountIn;
  swap.amountOut = event.params.amountOut;
  swap.swapType = "ExactOut";
  swap.block = event.block.number;
  swap.timestamp = event.block.timestamp;
  swap.txid = event.transaction.hash;

  swap.save();
}

