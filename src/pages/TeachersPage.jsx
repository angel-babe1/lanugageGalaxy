import React from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import TeachersList from "../components/about/TeachersList/TeachersList";
import './TeachersPage.css';

function TeachersPage() {
    return (
        <>
            <main>
                <section className="container teachers-page">
                    <h1 className="teachers-page-title">Наші вчителя</h1>
                    <TeachersList />
                </section>
            </main>
        </>
    )
}

export default TeachersPage;