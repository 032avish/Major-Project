import Header from './Header'
import Footer from './Footer'

const Layout = ({children}) => {
  return (
    <div className='bg-gray-400'>
      <Header />
      <main style={{ minHeight: "84vh" }}>
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default Layout