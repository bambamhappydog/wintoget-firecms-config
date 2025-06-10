import React from "react";
import { User as FirebaseUser } from "firebase/auth";
import { FireCMS, FireCMSAppConfig, NavigationRoutes, User } from "@firecms/core";
import { useFirebaseAuthController } from "@firecms/firebase";
import { firebaseConfig } from "./firebase-config"; // Preverite, ali je pot do vaše Firebase konfiguracije pravilna

// Import vaših definicij kolekcij in pogledov
// Primer: import { productsCollection } from "./collections/products";
// Primer: import { sponsorjiCollection } from "./collections/sponsorji";


// TO JE KLJUČNA FUNKCIJA, KI DOLOČI, KAJ KDO VIDI
// Na podlagi Firebase uporabnika (in njegovih Custom Claimov) zgradi meni
const myNavigation: NavigationRoutes = ({ user, authController }) => {
    
    // Pripravimo si prostor za kolekcije, ki jih bo uporabnik videl
    const collections = [];

    // Če je uporabnik ADMIN (preverimo preko Custom Claima 'admin')
    if (user?.roles?.includes("admin")) {
        // Admin vidi vse. Dodajte vse vaše administratorske kolekcije sem.
        // Primer:
        // collections.push(usersCollection);
        // collections.push(prosnjeSponzorjevCollection);
        // collections.push(nagradeCollection);
        // collections.push(sponzorjiCollection);
        // collections.push(predlogiNagrad);
        console.log("Uporabnik je admin, prikazujem poln meni.");
    }
    // Če ima uporabnik vlogo 'sponsor'
    else if (user?.roles?.includes("sponsor")) {
        // Sponzor vidi samo določene stvari.
        // Primer:
        // collections.push(predlogiNagradSponzorja); // To mora biti kolekcija, ki jo sponzor lahko ureja
        console.log("Uporabnik je sponzor, prikazujem omejen meni.");
    }

    return {
        collections: collections,
        // Tukaj lahko dodate tudi poglede (views), če jih imate
        views: []
    };
};


function App() {

    // Uporabimo Firebase avtentikacijo
    const authController = useFirebaseAuthController({
        firebaseConfig: firebaseConfig,
        // To omogoči, da FireCMS prebere Custom Claime (npr. 'role' ali 'admin')
        onFirebaseUserChange: (user: FirebaseUser | null): Promise<User | null> => {
            if (!user) return Promise.resolve(null);
            
            return user.getIdTokenResult(true).then(idTokenResult => {
                const customClaims = idTokenResult.claims;
                console.log("Custom claims:", customClaims);

                // Ustvarimo FireCMS uporabnika z vlogami iz Custom Claimov
                const fireCMSUser: User = {
                    uid: user.uid,
                    email: user.email,
                    displayName: user.displayName,
                    roles: customClaims.role ? [customClaims.role] : (customClaims.admin ? ['admin'] : []),
                };
                return fireCMSUser;
            });
        }
    });

    // -------- GLAVNA NASTAVITEV APLIKACIJE --------
    // To je koren vaše FireCMS aplikacije.
    // Tukaj definiramo, kako se uporabnik prijavi in kaj vidi.
    return (
        <FireCMS
            authController={authController}
            // Zgradimo navigacijo dinamično na podlagi vloge uporabnika
            navigation={myNavigation}
            // TO JE NASTAVITEV, KI JO POTREBUJETE:
            // Omogoči prijavo z Googlom IN z emailom/geslom
            signInOptions={["google.com", "password"]}
        >
            {({ user, context }) => {
                
                // Konfiguracija, ki jo bere FireCMS (kolekcije, pogledi itd.)
                // Vsebino te konfiguracije lahko imate tukaj ali v ločeni appConfig.tsx datoteki
                const appConfig: FireCMSAppConfig = {
                    // Vaše ostale nastavitve, npr.:
                    version: "1.0",
                    locale: "sl",
                    dateTimeFormat: "dd.MM.yyyy, HH:mm:ss"
                };

                // Tukaj ne rabite ničesar spreminjati, to samo posreduje konfiguracijo naprej
                return <></>; 
            }}
        </FireCMS>
    );
}

export default App;
