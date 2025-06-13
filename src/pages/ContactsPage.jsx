import React from 'react';
import { useTranslation } from 'react-i18next';
import SocialLinks from "../components/contact/SocialLinks/SocialLinks";
import PersonContactCard from "../components/contact/PersonContactCard/PersonContactCard";

import { personContacts } from "../data/contactsData"; 

function ContactsPage() {
    const { t } = useTranslation(); 

    return (
        <div>
            <main className="container">
                <h1 className="contacts-page-title">{t('contactsPage.title', 'Контакти')}</h1>
                
                <SocialLinks />

                <div className="contacts-container">
                    {personContacts.map((person) => {
                        const translatedData = t(`contactsPage.people.${person.id}`, { returnObjects: true });

                        return (
                            <PersonContactCard
                                key={person.id}
                                // 6. Передаємо перекладені та статичні дані в компонент
                                name={translatedData.name}
                                title={translatedData.title}
                                description={translatedData.description}
                                photoSrc={person.photoSrc}
                                contact={person.contact}
                                reverseOrder={person.id === 'hr'}
                            />
                        );
                    })}
                </div>
            </main>
        </div>
    );
}

export default ContactsPage;