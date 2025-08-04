import * as React from 'react'
import {styled, alpha} from '@mui/material/styles'
import { Typography, AppBar, Button, Box } from '@mui/material'
import KitchenIcon from '@mui/icons-material/Kitchen'

export default function NavBar() {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position='static'>
                <Typography component={'div'} sx={{ flexGrow: 1 }} variant='h6' color='inherit' noWrap>
                   Co w lodówce?
                </Typography>
                <Button>Zaloguj się</Button>
            </AppBar>
        </Box>
    )
}