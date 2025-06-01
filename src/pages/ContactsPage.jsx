import Header from "../components/layout/Header/Header";
import Footer from "../components/layout/Footer/Footer";
import SocialLinks from "../components/contact/SocialLinks/SocialLinks";
import PersonContactCard from "../components/contact/PersonContactCard/PersonContactCard";

import { personContacts } from "../data/contactsData";

function ContactsPage() {
    return (
        <div>
            <main className="container">
                <SocialLinks />
                <div className="contacts-container">
                    {personContacts.map((person) => (
                        <PersonContactCard
                            key={person.id}
                            name={person.name}
                            title={person.title}
                            photoSrc={person.photoSrc}
                            description={person.desctiption}
                            contact={person.contact}
                            reverseOrder={person.id === 'hr'}
                        />
                    ))}
                </div>
            </main>
        </div>
    )
}

export default ContactsPage;