import {
  defineComponent,
  h,
  onBeforeUnmount,
  onMounted,
  shallowRef,
  watch,
  type PropType,
} from 'vue'
import { createBorderBeam } from '../controller'
import type {
  BorderBeamColorVariant,
  BorderBeamController,
  BorderBeamOptions,
  BorderBeamSize,
  BorderBeamTheme,
} from '../types'

export interface BorderBeamComponentExposed {
  controller: Readonly<{ value: BorderBeamController | undefined }>
  activate(): void
  deactivate(): void
  update(options: Partial<BorderBeamOptions>): void
}

export const BorderBeam = defineComponent({
  name: 'BorderBeam',
  inheritAttrs: false,
  props: {
    as: { type: String, default: 'div' },
    size: String as PropType<BorderBeamSize>,
    colorVariant: String as PropType<BorderBeamColorVariant>,
    theme: String as PropType<BorderBeamTheme>,
    staticColors: Boolean,
    duration: Number,
    active: { type: Boolean, default: true },
    inset: Number,
    borderRadius: Number,
    brightness: Number,
    saturation: Number,
    hueRange: Number,
    strength: Number,
    tint: String,
  },
  emits: {
    activate: () => true,
    deactivate: () => true,
  },
  setup(props, { attrs, emit, expose, slots }) {
    const host = shallowRef<HTMLElement>()
    const controller = shallowRef<BorderBeamController>()

    const options = (): BorderBeamOptions => ({
      size: props.size,
      colorVariant: props.colorVariant,
      theme: props.theme,
      staticColors: props.staticColors,
      duration: props.duration,
      active: props.active,
      inset: props.inset,
      borderRadius: props.borderRadius,
      brightness: props.brightness,
      saturation: props.saturation,
      hueRange: props.hueRange,
      strength: props.strength,
      tint: props.tint,
      onActivate: () => emit('activate'),
      onDeactivate: () => emit('deactivate'),
    })

    onMounted(() => {
      if (host.value) controller.value = createBorderBeam(host.value, options())
    })

    watch(options, (nextOptions) => controller.value?.update(nextOptions))

    onBeforeUnmount(() => {
      controller.value?.destroy()
      controller.value = undefined
    })

    expose<BorderBeamComponentExposed>({
      controller,
      activate: () => controller.value?.activate(),
      deactivate: () => controller.value?.deactivate(),
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
