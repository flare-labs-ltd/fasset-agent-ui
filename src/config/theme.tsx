import { MantineThemeOverride, Paper } from '@mantine/core';

export const defaultThemeOverride: MantineThemeOverride = {
    /** Put your mantine theme override here */
    colorScheme: 'light',
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
        ],
        primary: [
            '#e5f6ff',
            '#d0eafe',
            '#a5d0f6',
            '#74b6ef',
            '#4da0ea',
            '#3392e7',
            '#228be6',
            '#1078cd',
            '#006ab9',
            '#005ca4'
        ]
    }
}
