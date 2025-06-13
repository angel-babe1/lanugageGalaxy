import { useTranslation } from 'react-i18next'; 
import FindOutMoreBtn from "../../common/Button/FindOutMoreBtn";
import './IntroSection.css';

import logo from '../../../assets/images/logo.svg';
import alien from '../../../assets/images/alien.svg';

function IntroSection() {
    const { t } = useTranslation();

    return (
        <section className="intro">
            <div className="container intro-content">
                <div className="bg-window">
                    <div className="logo-container">
                        <img src={logo} alt={t('introSection.logoAlt')} className="logo-image" />
                        <h1 className="logo-text">Language Galaxy</h1>
                    </div>
                </div>
                <div className="intro-info">
                    <p>
                        {t('introSection.greeting')}
                    </p>
                    <img src={alien} alt={t('introSection.alienAlt')} className="alien-image" />
                </div>
                <FindOutMoreBtn />
            </div>
        </section>
    )
}

export default IntroSection;