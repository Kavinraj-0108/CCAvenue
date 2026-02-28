import PaymentForm from './Components/PaymentForm'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import PaymentSuccess from './Components/PaymentSuccess'
import PaymentFailure from './Components/PaymentFailure'

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Main payment form */}
          <Route path='/' element={<PaymentForm />} />

          {/* CCAvenue backend redirects to these paths with query strings */}
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/payment-failure" element={<PaymentFailure />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
