import { BrowserRouter as Router } from 'react-router'
//import React from 'react'
import ReactDOM from 'react-dom/client'
import { RootCmp } from './RootCmp'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <Router>
			<RootCmp />
		</Router>
)
