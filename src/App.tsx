import React from "react";
import { User as FirebaseUser } from "firebase/auth";
import { Authenticator, FirebaseCMSApp, buildCollection } from "@firecms/core";

// Uvozimo ikone, ki jih bomo uporabili v meniju
import { 
    GroupIcon, 
    PersonIcon, 
    NewspaperIcon, 
    CollectionsBookmarkIcon, 
    BusinessCenterIcon, 
    AddTaskIcon 
} from "@firecms/ui";

import "typeface-rubik";
import "@fontsource/ibm-plex-mono";

// Tvoja pravilna Firebase konfiguracija iz slike
const firebaseConfig = {
    apiKey: "AIzaSyAbKVkXLDUbsx3RsjslmA8fwYL7WDqyoRKX2U",
    authDomain: "wintoget.firebaseapp.com",
    projectId: "wintoget",
    storageBucket: "wintoget.appspot.com",
    messagingSenderId: "786247750648",
    appId: "1:786247750648:web:015ec3fda558d8dec5bc0d",
    measurementId: "G-PPRZP6RQ58"
};

// Definicija, kako sponzor vidi obrazec za oddajo predlogov nagrad
const predlogiNagradSponsorCollection = buildCollection({
    name: "Moji Predlogi Nagrad",
    path: "predlogiNagrad",
    icon: AddTaskIcon,
    permissions: ({ authController }) => ({
        read: authController.extra?.isSponsor,
        edit: authController.extra?.isSponsor,
        create: authController.extra?.isSponsor,
        delete: authController.extra?.isSponsor,
    }),
    properties: {
        imeNagrade: { name: "Ime Nagrade", dataType: "string", validation: { required: true } },
        opisNagrade: { name: "Opis Nagrade", dataType: "string", config: { multiline: true }, validation: { required: true } },
        slikaNagrade: { name: "Slika Nagrade", dataType: "string", config: { storageMeta: { mediaType: "image", storagePath: "nagrade_predlogi" } }, description: "Priporočeno razmerje 16:9.", validation: { required: true } },
        tipNagrade: {
            name: "Tip Nagrade",
            dataType: "string",
            validation: { required: true },
            config: {
                enumValues: [
                    { id: "fizicna", label: "Fizična nagrada" },
                    { id: "digitalna", label: "Digitalna nagrada (koda, bon)" }
                ]
            }
        },
        digitalniPodTip: {
            name: "Vrsta digitalne nagrade",
            description: "Izpolni samo, če je tip 'Digitalna nagrada'.",
            dataType: "string",
            config: {
                enumValues: [
                    { id: "koda_trgovca", label: "Koda (lasten sistem preverjanja)" },
                    { id: "koda_wintoget_verifikacija", label: "Bon (WINT2GET verifikacija)" },
                ]
            }
        },
        zaloga: { name: "Zaloga (kosov/kod)", dataType: "number", validation: { required: true, min: 0 } },
        vrednostNagradeEUR: { name: "Vrednost Nagrade (€)", dataType: "number", description: "Informativna vrednost v EUR. Končne točke določi administrator." },
        statusPredloga: { name: "Status Predloga", dataType: "string", readOnly: true, defaultValue: "caka_na_odobritev" },
        sponsorId: { dataType: "string", readOnly: true, defaultValue: ({ authController }) => authController.user.uid }
    }
});


export default function App() {

    const myAuthController: Authenticator = {
        checkUser: (user: FirebaseUser | null) => {
            if (user) {
                return user.getIdTokenResult(true)
                    .then(idTokenResult => {
                        const claims = idTokenResult.claims;
                        const isAdmin = claims.admin === true;
                        const isSponsor = claims.role === 'sponsor';
                        console.log("Preverjam vloge uporabnika:", { isAdmin, isSponsor });
                        return { isAdmin, isSponsor };
                    });
            }
            return Promise.resolve(null);
        }
    };

    return (
        <FirebaseCMSApp
            name={"WINTOGET Portal"}
            authentication={myAuthController}
            signInOptions={[
                "password",
                "google.com"
            ]}
            navigation={({ user, authController }) => {
                
                if (authController.extra?.isAdmin) {
                    return {
                        groups: [
                            {
                                name: "Glavno",
                                icon: GroupIcon,
                                collections: [
                                    buildCollection({ name: "Uporabniki (Players)", path: "users", icon: PersonIcon }),
                                    buildCollection({ name: "Sponzorji (Profili)", path: "sponzorji", icon: BusinessCenterIcon }),
                                    buildCollection({ name: "Nagrade (Aktivne)", path: "nagrade", icon: CollectionsBookmarkIcon })
                                ]
                            },
                            {
                                name: "Administracija Sponzorjev",
                                icon: NewspaperIcon,
                                collections: [
                                    buildCollection({ name: "Prošnje Sponzorjev", path: "prosnjeSponzorjev" }),
                                    buildCollection({ name: "Vsi Predlogi Nagrad", path: "predlogiNagrad" })
                                ]
                            }
                        ]
                    };
                } 
                else if (authController.extra?.isSponsor) {
                    return {
                        groups: [
                            {
                                name: "Moj Portal",
                                collections: [
                                    predlogiNagradSponsorCollection
                                ]
                            }
                        ]
                    };
                }
                
                return { groups: [] };
            }}
            
            firebaseConfig={firebaseConfig}
        />
    );
}
