import { Vault, VaultDeposit, VaultWithdraw } from "../types/schema";
import {
  Executed,
  Deposit,
  Withdraw,
  ManagerAdded,
  ManagerRemoved,
  RiskManagerChanged,
  WithdrawFeeCharge as WithdrawFeeChargeEvent,
  DepositFeeCharge as DepositFeeChargeEvent,
  FeeCharged,
  AssetAdded,
  AssetRemoved,
  DebtAdded,
  DebtRemoved,
} from "../types/templates/StudioProVault/StudioProVault";
import { StudioProVault as StudioProVaultContract } from "../types/templates/StudioProVault/StudioProVault";
import { BigInt, Bytes } from "@graphprotocol/graph-ts";

export function getVault(id: string): Vault | null {
  return Vault.load(id);
}

export function handleDeposit(event: Deposit): void {
  // Create deposit
  const vaultDeposit = new VaultDeposit(
    event.transaction.hash.toHex() +
      ":" +
      event.logIndex.toHex() +
      ":" +
      event.params.depositAsset.toHex(),
  );
  vaultDeposit.sender = event.params.sender;
  vaultDeposit.owner = event.params.owner;
  vaultDeposit.vault = event.address;
  vaultDeposit.depositAsset = event.params.depositAsset;
  vaultDeposit.assets = event.params.assets;
  vaultDeposit.shares = event.params.shares;
  vaultDeposit.block = event.block.number;
  vaultDeposit.timestamp = event.block.timestamp;
  const vault = StudioProVaultContract.bind(event.address);
  // Get net vault value
  const netVaultValue = vault.try_getNetVaultValue();
  if (!netVaultValue.reverted) {
    vaultDeposit.netVaultValue = netVaultValue.value;
  } else {
    vaultDeposit.netVaultValue = BigInt.fromI32(0);
  }
  // Get price per share
  const pricePerShare = vault.try_getPricePerShare();
  if (!pricePerShare.reverted) {
    vaultDeposit.pricePerShare = pricePerShare.value;
  } else {
    vaultDeposit.pricePerShare = BigInt.fromI32(0);
  }
  vaultDeposit.save();
  // Update total supply and name/symbol
  const vaultEntity = getVault(event.address.toHex());
  if (vaultEntity) {
    vaultEntity.totalSupply = vault.totalSupply();
    vaultEntity.name = vault.name();
    vaultEntity.symbol = vault.symbol();
    if (!pricePerShare.reverted) {
      vaultEntity.pricePerShare = pricePerShare.value;
    } else {
      vaultEntity.pricePerShare = BigInt.fromI32(0);
    }
    if (!netVaultValue.reverted) {
      vaultEntity.netVaultValue = netVaultValue.value;
    } else {
      vaultEntity.netVaultValue = BigInt.fromI32(0);
    }
    vaultEntity.save();
  }
}

export function handleWithdraw(event: Withdraw): void {
  // Create withdraw
  const vaultWithdraw = new VaultWithdraw(
    event.transaction.hash.toHex() +
      ":" +
      event.logIndex.toHex() +
      ":" +
      event.params.withdrawAsset.toHex(),
  );
  vaultWithdraw.sender = event.params.sender;
  vaultWithdraw.receiver = event.params.receiver;
  vaultWithdraw.vault = event.address;
  vaultWithdraw.withdrawAsset = event.params.withdrawAsset;
  vaultWithdraw.assets = event.params.assets;
  vaultWithdraw.shares = event.params.shares;
  vaultWithdraw.block = event.block.number;
  vaultWithdraw.timestamp = event.block.timestamp;
  const vault = StudioProVaultContract.bind(event.address);
  // Get net vault value
  const netVaultValue = vault.try_getNetVaultValue();
  if (!netVaultValue.reverted) {
    vaultWithdraw.netVaultValue = netVaultValue.value;
  } else {
    vaultWithdraw.netVaultValue = BigInt.fromI32(0);
  }
  // Get price per share
  const pricePerShare = vault.try_getPricePerShare();
  if (!pricePerShare.reverted) {
    vaultWithdraw.pricePerShare = pricePerShare.value;
  } else {
    vaultWithdraw.pricePerShare = BigInt.fromI32(0);
  }
  vaultWithdraw.save();
  // Update total supply and name/symbol
  const vaultEntity = getVault(event.address.toHex());
  if (vaultEntity) {
    vaultEntity.totalSupply = vault.totalSupply();
    vaultEntity.name = vault.name();
    vaultEntity.symbol = vault.symbol();
    if (!pricePerShare.reverted) {
      vaultEntity.pricePerShare = pricePerShare.value;
    } else {
      vaultEntity.pricePerShare = BigInt.fromI32(0);
    }
    if (!netVaultValue.reverted) {
      vaultEntity.netVaultValue = netVaultValue.value;
    } else {
      vaultEntity.netVaultValue = BigInt.fromI32(0);
    }
    vaultEntity.save();
  }
}
