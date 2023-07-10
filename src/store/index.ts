import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import rootReducer from './reducers'

const middlewares = [
    thunkMiddleware
]

if (process.env.NODE_ENV === 'development' && process.env.TARO_ENV !== 'quickapp') {
    middlewares.push(require('redux-logger').createLogger())
}


export default function configStore() {
    const store = createStore(rootReducer, applyMiddleware(...middlewares))
    return store
}