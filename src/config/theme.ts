import {
    MantineThemeOverride,
    Button,
    Input,
    TextInput,
    Select,
    NumberInput,
    Title,
    Table,
    Modal
} from '@mantine/core';
import localFont from "next/font/local";

const abcMonumentGrotesk = localFont({
    src: [
        {
            path: '../assets/fonts/ABCMonumentGrotesk-Light.otf',
            weight: '300',
            style: 'normal'
        },
        {
            path: '../assets/fonts/ABCMonumentGrotesk-Regular.otf',
            weight: '400',
            style: 'normal'
        },
        {
            path: '../assets/fonts/ABCMonumentGrotesk-Bold-Trial.otf',
            weight: '700',
            style: 'normal'
        }
    ]
})

export const defaultThemeOverride: MantineThemeOverride = {
    fontFamily: abcMonumentGrotesk.style.fontFamily,
    colors: {
        flare: [
            '#404041',
            '#3B3B3B',
            '#353536',
            '#303031',
            '#2C2C2D',
            '#282829',
            '#242425',
            '#202021',
            '#1D1D1E',
            '#1A1A1B'
        ]
    },
    components: {
        Button: Button.extend({
            defaultProps: {
                color: 'var(--flr-black)',
                radius: 'xl'
            },
        }),
        Input: Input.extend({
            defaultProps: {
                variant: 'filled',
            }
        }),
        InputWrapper: Input.Wrapper.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal mt-2'
            },
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal mt-2'
            },
        }),
        Select: Select.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal mt-2'
            }
        }),
        NumberInput: NumberInput.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal mt-2'
            }
        }),
        Title: Title.extend({
            defaultProps: {
                fw: 300
            }
        }),
        Table: Table.extend({
            classNames: {
                th: 'font-normal text-sm',
                tr: 'pt-5',
                td: 'text-sm'
            },
            styles: {
                th: {
                    paddingTop: '1.5rem',
                },
                table: {
                    borderCollapse: 'separate',
                    borderSpacing: 0
                }
            }
        }),
        Modal: Modal.extend({
            styles: {
                title: {
                    fontSize: '1.5rem'
                },
                close: {
                    width: '30px',
                    height: '30px',
                },
            }
        })
    }
}
