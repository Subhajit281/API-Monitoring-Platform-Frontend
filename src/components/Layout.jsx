import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import Footer from "./Footer";

function Layout({ children }) {
    return (
        <div className="flex min-h-screen">
            {/* Sidebar stays fixed on the left */}
            <Sidebar />
            
            {/* Main content area takes up remaining space */}
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar />

                {/* flex-grow ensures the main content pushes the footer to the bottom */}
                <main className="flex-grow">
                    {children}
                </main>

                <Footer />
            </div>
        </div>
    );
};

export default Layout;