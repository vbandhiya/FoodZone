import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    setPersistence,
    browserSessionPersistence
} from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Apply strict Session Management - the user is forcibly reset to Guest Mode on fresh tabs/closes.
    useEffect(() => {
        setPersistence(auth, browserSessionPersistence).catch((error) => {
            console.error("Failed to strictly enforce session persistence:", error);
        });
    }, []);

    const signup = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            // Add user metadata to Firestore
            await setDoc(doc(db, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                email,
                name,
                role: 'user', // Default role
                createdAt: new Date().toISOString()
            });
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    // Fetch additional user role/details from Firestore
                    const userDocRef = doc(db, "users", user.uid);
                    const userDocSnap = await getDoc(userDocRef);
                    if (userDocSnap.exists()) {
                        setCurrentUser({ ...user, ...userDocSnap.data() });
                    } else {
                        setCurrentUser(user);
                    }
                } catch (error) {
                    console.error("Error fetching user data from Firestore:", error);
                    setCurrentUser(user); // Fallback to basic auth user
                }
            } else {
                setCurrentUser(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        signup,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
