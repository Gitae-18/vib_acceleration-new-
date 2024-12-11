import { configureStore, createSlice } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
const initialState = {
    wifi_info: {
        ip: "N/A",
        netmask: "N/A",
        gateway: "N/A",
        mac: "N/A",
        ap_mode: false,
    },
    dev_info: {
        dev_id: "N/A",
        ip: "N/A",
        sub_port: "N/A",
        push_port: "N/A",
        req_port: "N/A",
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
// 액션과 리듀서 내보내기
export const { setWifiInfo, setDevInfo } = networkSlice.actions;
export const store = configureStore({
    reducer: {
        network: networkSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
});
export default store;