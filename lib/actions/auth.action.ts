"use server";

import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7;

export async function setSessionCookie(idToken: string) {
  const cookieStore = await cookies();

  const sessionCookie = await auth.createSessionCookie(idToken, {
    expiresIn: ONE_WEEK * 1000, // 1 week
  });

  cookieStore.set("session", sessionCookie, {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "lax",
  });
}

export async function signUp(params: SignUpParams) {
  const { uid, name, email } = params;

  try {
    // checking for user existence
    const userRecord = await db.collection("users").doc(uid).get();

    if (userRecord.exists) {
      return {
        success: false,
        message: "User already exists. Please sign in instead.",
      };
    }

    // else create a new user
    await db.collection("users").doc(uid).set({
      name,
      email,
    });

    return {
      success: true,
      message: "Account created successfully. Please sign In.",
    };
  } catch (e) {
    console.error(`Error creating a user`, e);

    if (e instanceof Error && (e as any).code === "auth/email-already-exists") {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    return {
      success: false,
      message: "Failed to create an account",
    };
  }
}

export async function signIn(params: SignInParams) {
  const { email, idToken } = params;

  try {
    // access to the use
    const userRecord = await auth.getUserByEmail(email);

    if (!userRecord) {
      return {
        success: false,
        message: "User does not exits. Create an account instead.",
      };
    }

    await setSessionCookie(idToken);
  } catch (e) {
    console.error(`Error creating a user`, e);

    return {
      success: false,
      message: "Failed to log into an account.",
    };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();

  const sessionCookie = cookieStore.get("session")?.value;

  if (!sessionCookie) return null;

  try {
    const decodedIdToken = await auth.verifySessionCookie(sessionCookie, true);
    const userRecord = await db
      .collection("users")
      .doc(decodedIdToken.uid)
      .get();

    if (!userRecord.exists) return null;

    return {
      ...userRecord.data(),
      id: userRecord.id,
    } as User;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export async function isAuthenticated() {
  const user = await getCurrentUser();

  return !!user; // \!! this make existence or non-existence of user to boolean value
}

// fetching all details of a user
export async function getInterviewsByUserId(
  userId: string
): Promise<Interview[] | null> {
  const interviews = await db
    .collection("interviews")
    .where("userId", "==", userId)
    .orderBy("createdAt", "desc")
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}

// fetching all the details of other users
export async function getLatestInterviews(
  params: GetLatestInterviewsParams
): Promise<Interview[] | null> {
  const { userId, limit = 20 } = params;

  const interviews = await db
    .collection("interviews")
    .orderBy("createdAt", "desc")
    .where("finalized", "==", true)
    .where("userId", "!=", userId)
    .limit(limit)
    .get();

  return interviews.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Interview[];
}
