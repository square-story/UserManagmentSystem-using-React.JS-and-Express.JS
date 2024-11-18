import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    users:[],
    filteredUsers:[]
}

const userslice = createSlice({
    name:'users',
    initialState,
    reducers:{
        setUsers:(state,action)=>{
            state.users = action.payload;
            state.filteredUsers= action.payload
        },
        addUser:(state,action)=>{
            state.users.push(action.payload)
            state.filteredUsers.push(action.payload)
        },
        searchUsers:(state,action)=>{
            const query = action.payload.toLowerCase();
            state.filteredUsers = state.users.filter(user=>
                user.username.toLowerCase().includes(query)||user.email.toLowerCase().includes(query)
            )
        }
    }
})

export const {addUser,searchUsers,setUsers} = userslice.actions

export default userslice.reducer;