import React from "react";
import { FirebaseCMSApp, buildCollection } from "@firecms/core";

// Uvozimo ikone za osnovni prikaz
import { PersonIcon, BusinessCenterIcon } from "@firecms/ui";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// Tvoja pravilna Firebase konfiguracija
const firebaseConfig = {
    apiKey: "AIzaSyAbKVkXLDUbsx3RsjslmA8fwYL7WDqyoRKX2U",
    authDomain: "wintoget.firebaseapp.com",
    projectId: "wintoget",
    storageBucket: "wintoget.appspot.com",
    messagingSenderId: "786247750648",
    appId: "1:786247750648:web:015ec3fda558d8dec5bc0d",
    measurementId: "G-PPRZP6RQ58"
};

// Glavna komponenta aplikacije
export default function App() {

    return (
        <FirebaseCMSApp
            name={"WINTOGET Portal - Test"}
            
            // To je ključni del, ki ga testiramo.
            // Pustimo samo to nastavitev, brez kontrolerja za vloge.
            signInOptions={[
                "password",
                "google.com"
            ]}
            
            // Prikažemo samo osnovne kolekcije, brez dinamične logike.
            collections={[
                 buildCollection({ name: "Users", path: "users", icon: PersonIcon }),
                 buildCollection({ name: "Sponsors", path: "sponzorji", icon: BusinessCenterIcon }),
            ]}
            
            firebaseConfig={firebaseConfig}
        />
    );
}
