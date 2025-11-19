import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../Componets/Header';
import Footer from '../Componets/Footer';
import ScrollToTopButton from '../Componets/ScrollToTopButton';

function Layout() {
    return (
        <>
            <Header />
            <main>
                <Outlet />
            </main>
            <Footer />
            <ScrollToTopButton />
        </>
    )
}

export default Layout;