import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import FeaturesCasousel from "../components/home/FeaturesCarousel/FeaturesCarousel";
import IntroSection from "../components/home/IntroSection/IntroSection";


function HomePage() {
    return (
        <>
            <main>
                <IntroSection />
                <FeaturesCasousel />
            </main>
        </>
    )
}

export default HomePage;