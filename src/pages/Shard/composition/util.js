import {watch, ref} from "vue"

function useNewBlockTrigger(blockchainRef, lastNumber = -1) {
  const block = ref(null)
  watch(blockchainRef, (blockchain) => {
    const len = blockchain.length
    const lastBlock = blockchain[len - 1]
    if (lastBlock?.state === 'collect' && (lastBlock?.number !== lastNumber)) {
      lastNumber = lastBlock?.number
      block.value = lastBlock
    }
  }, {deep: true, immediate: true})
  return block
}

function useSlotProcess(controller) {
  const percent = ref(0)
  let timer
  const lastBlock = useNewBlockTrigger(() => controller.visibleLatestTbBlocks)
  watch(lastBlock, (n, o, onCleanup) => {
    if (lastBlock.value) {
      clearInterval(timer)
      const time = Date.now()
      timer = setInterval(() => {
        const t = (Date.now() - time) % 12000
        percent.value = 0.00833333333333333 * t
      }, 50)
    }
    onCleanup(() => clearInterval(timer))
  }, {immediate: true})
  watch(() => controller.state, () => {
    if (controller.state !== 'running') {
      clearInterval(timer)
    }
  }, {immediate: true})
  return percent
}

export {
  useNewBlockTrigger,
  useSlotProcess
}
