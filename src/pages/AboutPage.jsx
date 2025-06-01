import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import TeachersList from "../components/about/TeachersList/TeachersList";
import AboutIntroSection from "../components/about/aboutUsGeneral/AboutIntroSection/AboutIntroSection";
import AboutSchool from "../components/about/aboutUsGeneral/AboutSchool/AboutSchool";
import OurMisison from "../components/about/aboutUsGeneral/OurMission/OurMission";
import StudyingBenefitsSection from "../components/about/aboutUsGeneral/StudyingBenfitsSection/StudyingBenefitsSection";

function AboutPage() {
    return (
        <div>
            <main>
                <AboutIntroSection />
                <AboutSchool />
                <OurMisison />
                <StudyingBenefitsSection />
            </main>
        </div>
    )
}

export default AboutPage;