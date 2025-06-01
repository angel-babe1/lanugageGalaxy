import FindOutMoreBtn from "../../common/Button/FindOutMoreBtn";
import './IntroSection.css';

import logo from '../../../assets/images/logo.svg';
import alien from '../../../assets/images/alien.svg';



function IntroSection() {
    return (
        <section className="intro">
            <div className="container intro-content">
                <div className="bg-window">
                    <div className="logo-container">
                        <img src={logo} alt="Language Galaxy Logo" className="logo-image" />
                        <h1 className="logo-text">Language Galaxy</h1>
                    </div>
                </div>
                <div className="intro-info">
                    <p>
                        Hey, everybody. We are Language Galaxy. We're ready to help you with
                        learning different languages. This site can offer you reading our blog with
                        loads of helpful articles. Also there's a possibility to purchase different types
                        of lessons for almost any language here.
                    </p>
                    <img src={alien} alt="Friendly alien" className="alien-image" />
                </div>
                <FindOutMoreBtn />
            </div>
        </section>
    )
}

export default IntroSection;