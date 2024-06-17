import {
    MantineThemeOverride,
    Button,
    Input,
    TextInput,
    Select,
    NumberInput,
    Title
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
                color: 'black',
                radius: 'xl'
            },
        }),
        Input: Input.extend({
            defaultProps: {
                variant: 'filled',
            },
            styles: {
                input: {
                    backgroundColor: '#FAFAFA',
                    borderBottom: '1px solid #777777',

                }
            },
        }),
        InputWrapper: Input.Wrapper.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal'
            },
        }),
        TextInput: TextInput.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal'
            },
        }),
        Select: Select.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal'
            }
        }),
        NumberInput: NumberInput.extend({
            defaultProps: {
                inputWrapperOrder: ['label', 'input', 'error', 'description']
            },
            classNames: {
                label: 'font-normal uppercase',
                description: 'font-normal'
            }
        }),
        Title: Title.extend({
            defaultProps: {
                fw: 300
            }
        })
    }
}
