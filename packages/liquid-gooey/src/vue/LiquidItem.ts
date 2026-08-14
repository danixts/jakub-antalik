import {
  defineComponent,
  h,
  inject,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  type PropType,
} from 'vue'
import type {
  DissolveOptions,
  LiquidItemController,
  LiquidItemOptions,
  MorphTuning,
  MoveTuning,
} from '../types'
import type { CornerRadii } from '../geometry'
import type { Transition } from '../spring'
import { liquidGroupKey } from './context'

export interface LiquidItemComponentExposed {
  controller: Readonly<{ value: LiquidItemController | undefined }>
  update(options: Partial<LiquidItemOptions>): void
}

export const LiquidItem = defineComponent({
  name: 'LiquidItem',
  inheritAttrs: false,
  props: {
    as: { type: String, default: 'div' },
    effect: String as PropType<'morph' | 'move'>,
    morph: Object as PropType<MorphTuning>,
    move: Object as PropType<MoveTuning>,
    dissolve: [Boolean, Number, Object] as PropType<
      boolean | number | DissolveOptions
    >,
    x: Number,
    y: Number,
    scale: Number,
    transition: [String, Object] as PropType<Transition>,
    delay: Number,
    radius: [Number, Object] as PropType<number | CornerRadii>,
  },
  setup(props, { attrs, expose, slots }) {
    const context = inject(liquidGroupKey)
    if (!context) throw new Error('LiquidItem must be inside LiquidGroup')

    const host = shallowRef<HTMLElement>()
    const controller = shallowRef<LiquidItemController>()

    const options = (): LiquidItemOptions => ({
      effect: props.effect,
      morph: props.morph,
      move: props.move,
      dissolve: props.dissolve,
      x: props.x,
      y: props.y,
      scale: props.scale,
      transition: props.transition,
      delay: props.delay,
      radius: props.radius,
    })

    const register = (): void => {
      if (!host.value || !context.controller.value) return
      controller.value?.destroy()
      controller.value = context.controller.value.add(host.value, options())
    }

    onMounted(register)
    watch(context.controller, register)
    watch(options, (nextOptions) => controller.value?.update(nextOptions))

    onBeforeUnmount(() => {
      controller.value?.destroy()
      controller.value = undefined
    })

    expose<LiquidItemComponentExposed>({
      controller,
      update: (nextOptions) => controller.value?.update(nextOptions),
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
