
import { StayIndex } from "./pages/stayIndex"
import { Routes, Route } from 'react-router'



export function RootCmp() {

    return (
        <div className="main-container">
         

            <main>
                <Routes>
                   
                    <Route path="stay" element={<StayIndex />} />
                    
                    
                </Routes>
            </main>
       
        </div>
    )
}