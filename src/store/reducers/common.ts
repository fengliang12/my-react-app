import { forOwn, isNil, set } from 'lodash-es'
import { createReducer } from '../help'

const INITIAL_STATE = {
    navHeight: 0
}

export default createReducer({
    SET_COMMON(state, action: { payload: Partial<Store.Common> }) {
        if (action.payload) {
            forOwn(action.payload, function (value, key) {
                if (!isNil(value)) {
                    set(state, key, value)
                }
            })
        }
    }
}, INITIAL_STATE)

