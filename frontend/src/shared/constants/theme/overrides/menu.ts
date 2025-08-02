import { Combobox, Menu } from '@mantine/core'

export default {
    Menu: Menu.extend({
        defaultProps: {
            shadow: 'md',
            withArrow: true,
            transitionProps: { transition: 'scale', duration: 200 }
        }
    }),
    Combobox: Combobox.extend({
        defaultProps: {
            shadow: 'md',
            withArrow: false,
            transitionProps: { transition: 'scale', duration: 200 }
        }
    })
}
