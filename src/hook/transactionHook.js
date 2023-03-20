import { BigNumber, utils } from 'ethers'
export default function useTransaction() {
  function getGasUsed(transactionReceipt) {
    return BigNumber.from(transactionReceipt.gasUsed).toString()
  }

  function getFee(transactionReceipt, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(transactionReceipt.effectiveGasPrice).mul(
        BigNumber.from(transactionReceipt.gasUsed)
      ),
      unit
    )
  }

  function getGasLimitPecent(transaction, transactionReceipt) {
    return BigNumber.from(transactionReceipt.gasUsed)
      .mul(100)
      .div(BigNumber.from(transaction.gas))
      .toString()
  }

  function getGasLimit(transaction) {
    return BigNumber.from(transaction.gas).toString()
  }

  function getGasPrice(transactionReceipt, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(transactionReceipt.effectiveGasPrice),
      unit
    )
  }

  function getValue(transaction, unit = 'ether') {
    return utils.formatUnits(BigNumber.from(transaction.value), unit)
  }

  function getMaxPerGas(transaction, unit = 'ether') {
    return utils.formatUnits(BigNumber.from(transaction.maxFeePerGas), unit)
  }

  function getMaxPriorityFeePerGas(transaction, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(transaction.maxPriorityFeePerGas),
      unit
    )
  }

  function getBurntFees(block, transactionReceipt, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(block.baseFeePerGas).mul(transactionReceipt.gasUsed),
      unit
    )
  }

  return {
    getGasUsed,
    getFee,
    getGasLimit,
    getGasPrice,
    getValue,
    getGasLimitPecent,
    getMaxPriorityFeePerGas,
    getMaxPerGas,
    getBurntFees,
  }
}
