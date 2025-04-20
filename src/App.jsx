import { Outlet } from "react-router-dom"
import Header from "./components/section/Header"
function App() {
  return (
      <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
             <Outlet/>
          </main>
          <footer className="bg-gray-100 text-center text-sm text-gray-500 py-4">
              © {new Date().getFullYear()} Himanshu. All rights reserved.
          </footer>
      </div>
  )
}

export default App
