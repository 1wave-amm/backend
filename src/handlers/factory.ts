import { VaultCreated } from "../types/StudioProFactory/StudioProFactory";
import { StudioProVault } from "../types/templates";
import { Vault } from "../types/schema";
import { Bytes, BigInt, Address } from "@graphprotocol/graph-ts";

const AQUA_ADAPTER_ADDRESS = Address.fromString(
  "0x7b69b09cdcbcb8673b2647f146e1f4b90a5809f5",
);

export function handleVaultCreated(event: VaultCreated): void {
  // Check if the vault contains the AquaAdapter in initialManagerAdapters
  const managerAdapters = event.params.vaultParams.initialManagerAdapters;
  let hasAquaAdapter = false;
  for (let i = 0; i < managerAdapters.length; i++) {
    if (managerAdapters[i].equals(AQUA_ADAPTER_ADDRESS)) {
      hasAquaAdapter = true;
      break;
    }
  }

  // Only create vault if it contains the AquaAdapter
  if (!hasAquaAdapter) {
    return;
  }

  StudioProVault.create(event.params.vault);
  let vault = Vault.load(event.params.vault.toHex());
  if (!vault) {
    vault = new Vault(event.params.vault.toHex());
  }
  // Basic info
  vault.block = event.block.number;
  vault.timestamp = event.block.timestamp;
  vault.txid = event.transaction.hash;
  vault.user = event.transaction.from;
  // Denominator
  vault.denominator = event.params.vaultParams.denominator;
  // Assets
  vault.assets = event.params.vaultParams.initialAssets.map<Bytes>(
    (addr) => addr as Bytes,
  );
  vault.depositAssets =
    event.params.vaultParams.initialDepositAssets.map<Bytes>(
      (addr) => addr as Bytes,
    );
  vault.withdrawAssets =
    event.params.vaultParams.initialWithdrawAssets.map<Bytes>(
      (addr) => addr as Bytes,
    );
  // Debts
  vault.debts = event.params.vaultParams.initialDebts.map<Bytes>(
    (addr) => addr as Bytes,
  );
  // Managers
  vault.managers = [event.transaction.from];
  vault.riskManager = event.transaction.from;
  vault.feesReceiver = event.params.feeParams.feeReceiver;
  vault.depositFee = event.params.feeParams.depositFee;
  vault.withdrawFee = event.params.feeParams.withdrawFee;
  vault.managementFee = event.params.feeParams.managementFee;
  vault.performanceFee = event.params.feeParams.performanceFee;
  // Adapters
  vault.managerAdapters =
    event.params.vaultParams.initialManagerAdapters.map<Bytes>(
      (addr) => addr as Bytes,
    );
  vault.ownerAdapters =
    event.params.vaultParams.initialOwnerAdapters.map<Bytes>(
      (addr) => addr as Bytes,
    );
  vault.withdrawAdapters =
    event.params.vaultParams.initialWithdrawAdapters.map<Bytes>(
      (addr) => addr as Bytes,
    );
  // Deposit policy
  vault.depositorWhitelist = [];
  vault.depositWhitelistEnabled = false;
  vault.depositMinimum = [];
  vault.depositMinimumEnabled = false;
  vault.depositNetValueLimit = BigInt.fromI32(0);
  vault.netVaultValue = BigInt.fromI32(0);
  vault.depositNetValueLimitEnabled = false;
  vault.save();
}
