import React from 'react'
import Landing from './components/pages/Landing'
import About from './components/pages/About'
import Shop from './components/shop/Shop'
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import Header from './Header'
import Chatbot from './components/chatbot/Chatbot'
export default function App() {
    return (
        <BrowserRouter>
            <Header />
            <div className="container">
                <Switch>
                    <Route exact path="/" component={Landing} />
                    <Route exact path="/about" component={About} />
                    <Route exact path="/shop" component={Shop} />
                </Switch>
                <Chatbot />
            </div>
        </BrowserRouter>
    )
}
