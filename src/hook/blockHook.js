import { BigNumber, utils } from 'ethers'
export default function useBlock() {
  function getGasUsed(block) {
    return utils.commify(BigNumber.from(block.gasUsed).toString())
  }
  function getGasLimit(block) {
    return utils.commify(BigNumber.from(block.gasLimit).toString())
  }
  function getGasUsePecent({ gasUsed, gasLimit }) {
    return (
      BigNumber.from(gasUsed)
        .mul(10000)
        .div(BigNumber.from(gasLimit))
        .toNumber() / 100
    )
  }
  function getBaseFee(block, unit = 'ether') {
    return utils
      .formatUnits(
        BigNumber.from(block.baseFeePerGas).mul(BigNumber.from(block.gasUsed)),
        unit
      )
      .toString()
  }
  function getBaseFeePerGas(block, unit = 'ether') {
    return utils
      .formatUnits(BigNumber.from(block.baseFeePerGas), unit)
      .toString()
  }
  function getBurntFees(block, unit = 'ether') {
    return utils.formatUnits(
      BigNumber.from(block.baseFeePerGas)
        .mul(BigNumber.from(block.gasUsed))
        .toString(),
      unit
    )
  }
  function getReward() {
    return BigNumber.from()
  }

  function getBlocksize(block) {
    return utils.commify(block.size)
  }

  return {
    getGasUsed,
    getGasLimit,
    getGasUsePecent,
    getBaseFeePerGas,
    getBaseFee,
    getBurntFees,
    getBlocksize,
  }
}
