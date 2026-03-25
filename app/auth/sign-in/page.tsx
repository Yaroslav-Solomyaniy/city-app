import { Suspense } from "react"
import { Metadata } from "next"
import SignInForm from "./sign-in-form"

export const metadata: Metadata = {
  title: "Вхід",
  robots: { index: false, follow: false },
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
