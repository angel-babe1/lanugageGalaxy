import React from "react";
import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import TeachersList from "../components/about/TeachersList/TeachersList";

function TeachersPage() {
    return (
        <>
            <main>
                <section className="container our-teachers">
                    <h1>Наші вчителя</h1>
                    <TeachersList />
                </section>
            </main>
        </>
    )
}

export default TeachersPage;