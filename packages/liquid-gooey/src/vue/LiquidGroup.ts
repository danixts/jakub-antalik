import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  provide,
  shallowRef,
  watch,
} from 'vue'
import { createLiquidGroup } from '../group'
import type { LiquidGroupController, LiquidGroupOptions } from '../types'
import { liquidGroupKey } from './context'

export interface LiquidGroupComponentExposed {
  controller: Readonly<{ value: LiquidGroupController | undefined }>
  update(options: Partial<LiquidGroupOptions>): void
  wake(): void
}

export const LiquidGroup = defineComponent({
  name: 'LiquidGroup',
  inheritAttrs: false,
  props: {
    as: { type: String, default: 'div' },
    blur: Number,
    contrast: Number,
    fill: String,
    shadow: String,
    filterPadding: Number,
  },
  setup(props, { attrs, expose, slots }) {
    const host = shallowRef<HTMLElement>()
    const controller = shallowRef<LiquidGroupController>()

    const options = (): LiquidGroupOptions => ({
      blur: props.blur,
      contrast: props.contrast,
      fill: props.fill,
      shadow: props.shadow,
      filterPadding: props.filterPadding,
    })

    provide(liquidGroupKey, { controller })

    onMounted(() => {
      if (host.value)
        controller.value = createLiquidGroup(host.value, options())
    })

    watch(options, (nextOptions) => controller.value?.update(nextOptions))

    onBeforeUnmount(() => {
      controller.value?.destroy()
      controller.value = undefined
    })

    expose<LiquidGroupComponentExposed>({
      controller,
      update: (nextOptions) => controller.value?.update(nextOptions),
      wake: () => controller.value?.wake(),
    })

    return () =>
      h(
        props.as,
        {
          ...attrs,
          ref: host,
        },
        slots.default?.(),
      )
  },
})
