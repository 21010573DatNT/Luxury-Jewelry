import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Componets/Header';
import Footer from '../Componets/Footer';

function Layout() {
    return(
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
        </>
    )
}

export default Layout;