import { configureStore, createSlice } from '@reduxjs/toolkit';
//import thunk from 'redux-thunk';
const initialState = {
    wifi_info: {
        ip: "",
        netmask: "",
        gateway: "",
        mac: "",
        ap_mode: false,
    },
    dev_info: {
        dev_id: "",
        ip: "",
        sub_port: "",
        push_port: "",
        req_port: "",
    },
};
// Slice 생성
const networkSlice = createSlice({
    name: 'network',
    initialState,
    reducers: {
        setWifiInfo(state, action) {
            return {
                ...state,
                wifi_info: action.payload,
            };
        },
        setDevInfo(state, action) {
            return {
                ...state,
                dev_info: action.payload,
            };
        },
    },
});

export const { setWifiInfo, setDevInfo } = networkSlice.actions;
export const store = configureStore({
    reducer: {
        network: networkSlice.reducer,
    }, 
});
export default store;