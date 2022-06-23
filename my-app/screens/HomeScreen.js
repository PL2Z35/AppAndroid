import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { signin } from '../api'

const HomeScreen = () => {

    const login = async () => {
        const data = await signin();
        console.log(data)
    }
    useEffect(() => {
        login()
    }, [])
    return (
        <View>
            <Text>HomeScreen</Text>
        </View>
    )
}

export default HomeScreen